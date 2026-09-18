import { Router } from 'express'
import { usersController } from './users.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission, requireRole } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  bulkStatusSchema,
  createUserSchema,
  listUsersQuerySchema,
  resetUserPasswordSchema,
  updateUserSchema,
} from './users.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. `/bulk-status` is
 * a single-segment literal on POST, so it must be registered ABOVE any
 * `POST /:id` route. Currently there is no `POST /:id`, but if one is added
 * later, place it AFTER `/bulk-status`.
 */

router.get(
  '/',
  requirePermission('users', 'view'),
  validateQuery(listUsersQuerySchema),
  asyncHandler(usersController.list)
)

/**
 * `/bulk-status` — registered above `/:id` for every method that might
 * later add a param route. Currently only POST matters, but keeping the
 * ordering consistent avoids surprises.
 */
router.post(
  '/bulk-status',
  requirePermission('users', 'edit'),
  validateBody(bulkStatusSchema),
  asyncHandler(usersController.bulkUpdateStatus)
)

router.get(
  '/:id',
  requirePermission('users', 'view'),
  asyncHandler(usersController.getById)
)

router.post(
  '/',
  requirePermission('users', 'create'),
  validateBody(createUserSchema),
  asyncHandler(usersController.create)
)

router.patch(
  '/:id',
  requirePermission('users', 'edit'),
  validateBody(updateUserSchema),
  asyncHandler(usersController.update)
)

router.delete(
  '/:id',
  requirePermission('users', 'delete'),
  asyncHandler(usersController.remove)
)

/**
 * Admin-triggered password reset. Same permission as `users.edit` — the
 * operation is "help a locked-out user regain access", which is part of
 * user administration, not a separate capability. The service enforces
 * that the caller cannot reset a user id they don't have access to via the
 * auth layer.
 *
 * If your policy separates "can edit profile fields" from "can reset
 * credentials", change this to a distinct permission (e.g.
 * `users.reset-password` added to the seed).
 */
router.post(
  '/:id/reset-password',
  requireRole('admin'),
  requirePermission('users', 'edit'),
  validateBody(resetUserPasswordSchema),
  asyncHandler(usersController.resetPassword)
)

export default router