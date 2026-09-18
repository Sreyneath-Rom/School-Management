import { Router } from 'express'
import { languagesController } from './languages.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createLanguageSchema,
  updateLanguageSchema,
} from './languages.validation'

const router = Router()
router.use(authenticate)

/**
 * Languages are a sub-resource of the translations domain — anyone who can
 * manage translations needs to manage the languages they're translated into.
 * That's why the permission module is `translations.*` rather than a separate
 * `languages.*` catalog. If languages ever becomes an admin-only concern, add
 * a `languages` module to the permission catalog in prisma/seed.ts and swap
 * these calls.
 *
 * ROUTE ORDER: `/:code` is a single-segment param. If a literal route is
 * added later (e.g. `GET /active`), it must be registered ABOVE `/:code` or
 * it will be shadowed.
 */

router.get(
  '/',
  requirePermission('translations', 'view'),
  asyncHandler(languagesController.list)
)

router.post(
  '/',
  requirePermission('translations', 'create'),
  validateBody(createLanguageSchema),
  asyncHandler(languagesController.create)
)

router.patch(
  '/:code',
  requirePermission('translations', 'edit'),
  validateBody(updateLanguageSchema),
  asyncHandler(languagesController.update)
)

router.delete(
  '/:code',
  requirePermission('translations', 'delete'),
  asyncHandler(languagesController.remove)
)

export default router