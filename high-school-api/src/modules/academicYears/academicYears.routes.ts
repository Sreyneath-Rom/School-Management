import { Router } from 'express'
import { academicYearsController } from './academicYears.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
} from './academicYears.validation'

const router = Router()
router.use(authenticate)

// Route order note: `/:id` matches exactly one segment, so `/:id/current`
// (a POST) and `/:id` (a GET) don't collide. If a single-segment
// `/current` route is ever added, register it BEFORE `/:id` — otherwise
// `/:id` shadows it.
router.get(
  '/',
  requirePermission('academicYears', 'view'),
  asyncHandler(academicYearsController.list)
)

router.get(
  '/:id',
  requirePermission('academicYears', 'view'),
  asyncHandler(academicYearsController.getById)
)

router.post(
  '/',
  requirePermission('academicYears', 'create'),
  validateBody(createAcademicYearSchema),
  asyncHandler(academicYearsController.create)
)

router.patch(
  '/:id',
  requirePermission('academicYears', 'edit'),
  validateBody(updateAcademicYearSchema),
  asyncHandler(academicYearsController.update)
)

router.post(
  '/:id/current',
  requirePermission('academicYears', 'edit'),
  asyncHandler(academicYearsController.setCurrent)
)

router.delete(
  '/:id',
  requirePermission('academicYears', 'delete'),
  asyncHandler(academicYearsController.remove)
)

export default router