import { Router } from 'express'
import { schoolController } from './school.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission, requireRole } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { upload } from '@/middleware/upload.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createSchoolSchema,
  updateSchoolSchema,
} from './school.validation'

const router = Router()
router.use(authenticate)

/**
 * All school routes are for a singleton resource. Paths are `/` (get,
 * create, update, delete) plus a handful of single-segment literals
 * (`/setup`, `/logo`). No params, no route-order concerns.
 */

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

/**
 * `/setup` is a distinct endpoint from `PATCH /` because the semantics
 * differ: `PATCH /` requires the school to exist (404 otherwise), while
 * `PATCH /setup` creates it on first call. Same input schema, different
 * "does it exist yet" contract. The setup page uses `/setup`; subsequent
 * edits use `PATCH /`.
 */
router.patch(
  '/setup',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  validateBody(updateSchoolSchema),
  asyncHandler(schoolController.upsert)
)

/**
 * Destructive. Deleting the school removes the singleton config that other
 * modules implicitly depend on (school context for reports, term naming,
 * etc.). Gated on both `school.delete` AND admin role — a permission grant
 * alone shouldn't be enough to nuke the deployment's identity.
 */
router.delete(
  '/',
  requireRole('admin'),
  requirePermission('school', 'delete'),
  asyncHandler(schoolController.remove)
)

/**
 * Logo upload. The multer middleware enforces the MIME whitelist and
 * `MAX_UPLOAD_MB` size cap. `upload.single('logo')` is a proper middleware
 * now — the previous `as any` cast was hiding a type mismatch between the
 * multer RequestHandler signature and Express's expectation.
 */
router.post(
  '/logo',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  upload.single('logo') as any,
  asyncHandler(schoolController.uploadLogo)
)

router.delete(
  '/logo',
  requireRole('admin'),
  requirePermission('school', 'edit'),
  asyncHandler(schoolController.removeLogo)
)

export default router