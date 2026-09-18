import { Router } from 'express'
import { termsController } from './terms.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createTermSchema,
  listTermsQuerySchema,
  updateTermSchema,
} from './terms.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. `/:id/active` is
 * a POST with two segments and doesn't collide with any single-segment
 * literal today. If a literal single-segment route (e.g. `GET /current`)
 * is added later, register it ABOVE `/:id`.
 */

router.get(
  '/',
  requirePermission('terms', 'view'),
  validateQuery(listTermsQuerySchema),
  asyncHandler(termsController.list)
)

router.get(
  '/:id',
  requirePermission('terms', 'view'),
  asyncHandler(termsController.getById)
)

router.post(
  '/',
  requirePermission('terms', 'create'),
  validateBody(createTermSchema),
  asyncHandler(termsController.create)
)

router.patch(
  '/:id',
  requirePermission('terms', 'edit'),
  validateBody(updateTermSchema),
  asyncHandler(termsController.update)
)

/**
 * Sets the term as the year's active term. Same permission as editing —
 * this is a state transition on the term, not a distinct resource.
 */
router.post(
  '/:id/active',
  requirePermission('terms', 'edit'),
  asyncHandler(termsController.setActive)
)

router.delete(
  '/:id',
  requirePermission('terms', 'delete'),
  asyncHandler(termsController.remove)
)

export default router