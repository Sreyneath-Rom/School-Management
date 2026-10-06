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
  model: PrismaDelegate
  modelName: string
  createSchema: z.ZodTypeAny
  updateSchema: z.ZodTypeAny
  permissionModule: string
  softDelete?: boolean
  include?: unknown
  defaultOrderBy?:
    | Record<string, 'asc' | 'desc'>
    | Array<Record<string, 'asc' | 'desc'>>
  sortableFields?: readonly string[]
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

  const notDeleted = softDelete ? { deletedAt: null } : {}

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

  router.get(
    '/:id',
    requirePermission(permissionModule, 'view'),
    asyncHandler(async (req, res) => {
      const item = await model.findFirst({
        where: { id: req.params.id, ...notDeleted },
        include,
      })
      if (!item) throw ApiError.notFound(`${modelName} not found`)
      sendSuccess(res, item)
    })
  )

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

  router.patch(
    '/:id',
    requirePermission(permissionModule, 'edit'),
    validateBody(updateSchema),
    asyncHandler(async (req, res) => {
      const body = req.validated?.body
      if (!body || Object.keys(body as object).length === 0) {
        throw ApiError.badRequest('At least one field must be provided')
      }

      const existing = await model.findFirst({
        where: { id: req.params.id, ...notDeleted },
        include: undefined,
      })
      if (!existing) throw ApiError.notFound(`${modelName} not found`)

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

  router.delete(
    '/:id',
    requirePermission(permissionModule, 'delete'),
    asyncHandler(async (req, res) => {
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