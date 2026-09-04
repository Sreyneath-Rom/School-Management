// school.routes.ts
import { Router } from 'express'
import { schoolController } from './school.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { upload } from '@/middleware/upload.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createSchoolSchema, updateSchoolSchema } from './school.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('school', 'view'),
  asyncHandler(schoolController.get)
)

router.post(
  '/',
  requirePermission('school', 'create'),
  validateBody(createSchoolSchema),
  asyncHandler(schoolController.create)
)

router.patch(
  '/',
  requirePermission('school', 'edit'),
  validateBody(updateSchoolSchema),
  asyncHandler(schoolController.update)
)

router.patch(
  '/setup',
  requirePermission('school', 'edit'),
  validateBody(updateSchoolSchema),          // accepts null, and now rejects an empty {} body
  asyncHandler(schoolController.upsert)
)

router.delete(
  '/',
  requirePermission('school', 'delete'),
  asyncHandler(schoolController.remove)
)

router.post(
  '/logo',
  requirePermission('school', 'edit'),
  upload.single('logo') as any,
  asyncHandler(schoolController.uploadLogo)
)

router.delete(
  '/logo',
  requirePermission('school', 'edit'),
  asyncHandler(schoolController.removeLogo)
)

export default router