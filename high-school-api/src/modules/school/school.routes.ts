import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { upsertSchoolSchema } from './school.validation'

const router = Router()
router.use(authenticate)

// Single-tenant: there is exactly one School row. GET returns it (or 404 if
// setup hasn't run yet); PATCH upserts it.
router.get(
  '/',
  requirePermission('school', 'view'),
  asyncHandler(async (_req, res) => {
    const school = await prisma.school.findFirst()
    if (!school) throw ApiError.notFound('School has not been configured yet')
    sendSuccess(res, school)
  })
)

router.patch(
  '/',
  requirePermission('school', 'edit'),
  validateBody(upsertSchoolSchema),
  asyncHandler(async (req, res) => {
    const existing = await prisma.school.findFirst()
    const school = existing
      ? await prisma.school.update({ where: { id: existing.id }, data: req.body })
      : await prisma.school.create({ data: req.body })
    sendSuccess(res, school)
  })
)

export default router
