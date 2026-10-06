import { Router } from 'express'
import { schoolController } from './school.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission, requireRole } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { uploadTo } from '@/middleware/upload.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createSchoolSchema,
  updateSchoolSchema,
} from './school.validation'

const router = Router()
router.use(authenticate)

const logoUpload = uploadTo('logos')

router.get(
  '/',
  requirePermission('school', 'view'),
  asyncHandler(schoolController.get)
)

router.post(
  '/',
  requireRole('admin'),
  requirePermission('school', 'create'),
  validateBody(createSchoolSchema),
  asyncHandler(schoolController.create)
)

router.patch(
  '/',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  validateBody(updateSchoolSchema),
  asyncHandler(schoolController.update)
)

router.patch(
  '/setup',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  validateBody(updateSchoolSchema),
  asyncHandler(schoolController.upsert)
)

router.delete(
  '/',
  requireRole('admin'),
  requirePermission('school', 'delete'),
  asyncHandler(schoolController.remove)
)

router.post(
  '/logo',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  logoUpload.single('logo') as never,
  asyncHandler(schoolController.uploadLogo)
)

router.delete(
  '/logo',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  asyncHandler(schoolController.removeLogo)
)

export default router