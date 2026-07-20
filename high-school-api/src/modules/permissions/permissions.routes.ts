import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()

/**
 * GET /api/v1/permissions
 * Returns the full permission catalog: { id, key, moduleId, action }.
 * `key` is stored as "<module>.<action>" (e.g. "grades.edit") — moduleId/action
 * here are derived from that key so the frontend doesn't have to parse it.
 */
router.get(
  '/',
  authenticate,
  requirePermission('roles', 'view'),
  asyncHandler(async (_req, res) => {
    const permissions = await prisma.permission.findMany({ orderBy: { key: 'asc' } })
    const catalog = permissions.map((p: { id: string; key: string }) => {
      const [moduleId, action] = p.key.split('.')
      return { id: p.id, key: p.key, moduleId, action }
    })
    sendSuccess(res, catalog)
  })
)

export default router
