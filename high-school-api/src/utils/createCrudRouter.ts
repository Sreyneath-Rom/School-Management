import { Router } from 'express'
import type { z } from 'zod'
import { asyncHandler } from './asyncHandler'
import { sendCreated, sendSuccess } from './apiResponse'
import { ApiError } from './ApiError'
import { paginationQuerySchema, toSkipTake, buildPaginationMeta } from './pagination'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'

// Minimal shape every Prisma model delegate satisfies (prisma.subject, prisma.class, ...).
interface PrismaDelegate {
  findMany: (args?: unknown) => Promise<unknown[]>
  count: (args?: unknown) => Promise<number>
  findUnique: (args: { where: { id: string } }) => Promise<unknown>
  create: (args: { data: unknown }) => Promise<unknown>
  update: (args: { where: { id: string }; data: unknown }) => Promise<unknown>
  delete: (args: { where: { id: string } }) => Promise<unknown>
}

interface CrudRouterOptions {
  model: PrismaDelegate
  createSchema: z.ZodTypeAny
  updateSchema: z.ZodTypeAny
  /** Permission module key used for RBAC checks, e.g. "subjects" -> "subjects.view" */
  permissionModule: string
  /** Optional soft-delete: if true, delete() sets deletedAt instead of removing the row. */
  softDelete?: boolean
  /** Extra Prisma `include` applied to list/get queries. */
  include?: unknown
}

export function createCrudRouter(opts: CrudRouterOptions): Router {
  const router = Router()
  const { model, createSchema, updateSchema, permissionModule, softDelete, include } = opts

  router.use(authenticate)

  router.get(
    '/',
    requirePermission(permissionModule, 'view'),
    asyncHandler(async (req, res) => {
      const pagination = paginationQuerySchema.parse(req.query)
      const where = softDelete ? { deletedAt: null } : undefined
      const [items, total] = await Promise.all([
        model.findMany({ where, include, ...toSkipTake(pagination) }),
        model.count({ where }),
      ])
      sendSuccess(res, items, 200, buildPaginationMeta(total, pagination))
    })
  )

  router.get(
    '/:id',
    requirePermission(permissionModule, 'view'),
    asyncHandler(async (req, res) => {
      const item = await model.findUnique({ where: { id: req.params.id } })
      if (!item) throw ApiError.notFound()
      sendSuccess(res, item)
    })
  )

  router.post(
    '/',
    requirePermission(permissionModule, 'create'),
    validateBody(createSchema),
    asyncHandler(async (req, res) => {
      const created = await model.create({ data: req.body })
      sendCreated(res, created)
    })
  )

  router.patch(
    '/:id',
    requirePermission(permissionModule, 'edit'),
    validateBody(updateSchema),
    asyncHandler(async (req, res) => {
      const updated = await model.update({ where: { id: req.params.id }, data: req.body })
      sendSuccess(res, updated)
    })
  )

  router.delete(
    '/:id',
    requirePermission(permissionModule, 'delete'),
    asyncHandler(async (req, res) => {
      if (softDelete) {
        await model.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } })
      } else {
        await model.delete({ where: { id: req.params.id } })
      }
      res.status(204).send()
    })
  )

  return router
}
