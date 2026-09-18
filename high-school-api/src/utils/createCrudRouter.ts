import { Router } from 'express'
import type { z } from 'zod'
import { asyncHandler } from './asyncHandler'
import { sendCreated, sendSuccess } from './apiResponse'
import { ApiError } from './ApiError'
import {
  paginationQuerySchema,
  toSkipTake,
  buildPaginationMeta,
  buildOrderBy,
} from './pagination'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'

/**
 * Minimal shape every Prisma model delegate satisfies. Kept loose on purpose —
 * the real delegate type is a generic function of the model, and pinning it
 * here would force every caller to pass an exhaustive generic parameter for
 * no benefit.
 */
interface PrismaDelegate {
  findMany: (args?: unknown) => Promise<unknown[]>
  count: (args?: unknown) => Promise<number>
  findUnique: (args: { where: { id: string }; include?: unknown }) => Promise<unknown>
  findFirst: (args: { where: unknown; include?: unknown }) => Promise<unknown>
  create: (args: { data: unknown; include?: unknown }) => Promise<unknown>
  update: (args: {
    where: { id: string }
    data: unknown
    include?: unknown
  }) => Promise<unknown>
  delete: (args: { where: { id: string } }) => Promise<unknown>
}

export interface CrudRouterOptions {
  /** Prisma model delegate: prisma.subject, prisma.class, etc. */
  model: PrismaDelegate

  /**
   * Human-readable model name. Used in 404 / conflict messages, so callers
   * see "Subject not found" instead of a generic "Not found".
   */
  modelName: string

  /** Zod schema for POST body. */
  createSchema: z.ZodTypeAny

  /** Zod schema for PATCH body. Should be `.partial()` of create. */
  updateSchema: z.ZodTypeAny

  /** RBAC module key, e.g. "subjects" -> checks subjects.view / .create / .edit / .delete */
  permissionModule: string

  /**
   * When true, DELETE sets `deletedAt` instead of removing the row, and every
   * read path filters `deletedAt: null`. Requires the model to have a
   * nullable `deletedAt DateTime?` column.
   */
  softDelete?: boolean

  /** Prisma `include` applied to list, get, create, and update responses. */
  include?: unknown

  /**
   * Default `orderBy` when the client doesn't supply a valid `sortBy`.
   * Recommend `{ createdAt: 'desc' }` for anything append-heavy.
   */
  defaultOrderBy?:
    | Record<string, 'asc' | 'desc'>
    | Array<Record<string, 'asc' | 'desc'>>

  /**
   * Fields the client is allowed to sort by. `sortBy` values not in this list
   * are ignored (falls back to defaultOrderBy). Always supply this — an open
   * sort parameter lets a client trigger unindexed full-table sorts.
   */
  sortableFields?: readonly string[]

  /**
   * Optional filter builder. Receives the raw validated query object and
   * returns a Prisma `where` fragment. Merged with the soft-delete filter.
   *
   * Example for subjects:
   *   buildWhere: (q) => ({
   *     ...(q.department ? { department: q.department } : {}),
   *     ...(q.search ? { name: { contains: q.search, mode: 'insensitive' } } : {}),
   *   })
   */
  buildWhere?: (query: Record<string, unknown>) => Record<string, unknown> | undefined
}

export function createCrudRouter(opts: CrudRouterOptions): Router {
  const {
    model,
    modelName,
    createSchema,
    updateSchema,
    permissionModule,
    softDelete = false,
    include,
    defaultOrderBy,
    sortableFields = [],
    buildWhere,
  } = opts

  const router = Router()
  router.use(authenticate)

  /**
   * The `where` fragment applied to every read path when soft-delete is on.
   * Centralized so a change to the soft-delete convention (e.g. adding a
   * `status: 'deleted'` filter) only has to happen in one place.
   */
  const notDeleted = softDelete ? { deletedAt: null } : {}

  // ---------------------------------------------------------------------------
  // LIST
  // ---------------------------------------------------------------------------
  router.get(
    '/',
    requirePermission(permissionModule, 'view'),
    validateQuery(paginationQuerySchema),
    asyncHandler(async (req, res) => {
      const query = (req.validated?.query ?? {}) as {
        page: number
        limit: number
        sortBy?: string
        sortOrder: 'asc' | 'desc'
      }

      const userWhere = buildWhere?.(query as Record<string, unknown>) ?? {}
      const where = { ...notDeleted, ...userWhere }

      const orderBy =
        buildOrderBy(query, sortableFields) ?? defaultOrderBy ?? { createdAt: 'desc' }

      const [items, total] = await Promise.all([
        model.findMany({
          where,
          include,
          orderBy,
          ...toSkipTake(query),
        }),
        model.count({ where }),
      ])

      sendSuccess(res, items, 200, buildPaginationMeta(total, query))
    })
  )

  // ---------------------------------------------------------------------------
  // GET ONE
  // ---------------------------------------------------------------------------
  router.get(
    '/:id',
    requirePermission(permissionModule, 'view'),
    asyncHandler(async (req, res) => {
      // `findFirst` (not `findUnique`) because the where clause includes the
      // soft-delete filter, which Prisma's unique-only `findUnique` rejects.
      const item = await model.findFirst({
        where: { id: req.params.id, ...notDeleted },
        include,
      })
      if (!item) throw ApiError.notFound(`${modelName} not found`)
      sendSuccess(res, item)
    })
  )

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------
  router.post(
    '/',
    requirePermission(permissionModule, 'create'),
    validateBody(createSchema),
    asyncHandler(async (req, res) => {
      const body = req.validated?.body
      if (!body) throw ApiError.badRequest('Request body is required')

      const created = await model.create({ data: body, include })
      sendCreated(res, created)
    })
  )

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------
  router.patch(
    '/:id',
    requirePermission(permissionModule, 'edit'),
    validateBody(updateSchema),
    asyncHandler(async (req, res) => {
      const body = req.validated?.body
      if (!body || Object.keys(body as object).length === 0) {
        throw ApiError.badRequest('At least one field must be provided')
      }

      // Verify existence and (for soft-delete) that the row isn't already
      // deleted, before running the update. Prisma's `update` matches on
      // id alone and would happily resurrect a soft-deleted row.
      const existing = await model.findFirst({
        where: { id: req.params.id, ...notDeleted },
        include: undefined,
      })
      if (!existing) throw ApiError.notFound(`${modelName} not found`)

      // Defensive: strip `deletedAt` even if the update schema somehow lets
      // it through. A client that can set `deletedAt: null` on a soft-delete
      // model can undelete records it shouldn't see.
      const data = { ...(body as Record<string, unknown>) }
      if (softDelete) delete data.deletedAt

      const updated = await model.update({
        where: { id: req.params.id },
        data,
        include,
      })
      sendSuccess(res, updated)
    })
  )

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------
  router.delete(
    '/:id',
    requirePermission(permissionModule, 'delete'),
    asyncHandler(async (req, res) => {
      // Same existence check as update — deleting an already-deleted row
      // should 404, not silently overwrite the original deletedAt timestamp.
      const existing = await model.findFirst({
        where: { id: req.params.id, ...notDeleted },
        include: undefined,
      })
      if (!existing) throw ApiError.notFound(`${modelName} not found`)

      if (softDelete) {
        await model.update({
          where: { id: req.params.id },
          data: { deletedAt: new Date() },
        })
      } else {
        await model.delete({ where: { id: req.params.id } })
      }

      res.status(204).send()
    })
  )

  return router
}