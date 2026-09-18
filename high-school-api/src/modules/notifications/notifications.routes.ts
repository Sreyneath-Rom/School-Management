import { Router } from 'express'
import { notificationsController } from './notifications.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requireRole } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createNotificationSchema,
  listNotificationsQuerySchema,
  updateNotificationSchema,
} from './notifications.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method.
 */

/**
 * List — every authenticated user sees only their own notifications. No
 * permission gate: gating this behind `notifications.view` would just be one
 * more thing to misconfigure, since ownership is already enforced in the
 * service. Every role can read their own feed.
 */
router.get(
  '/',
  validateQuery(listNotificationsQuerySchema),
  asyncHandler(notificationsController.list)
)

router.get(
  '/:id',
  asyncHandler(notificationsController.getById)
)

/**
 * Create — admin-only.
 *
 * The seed grants teachers `notifications.create`, and the endpoint accepts
 * an arbitrary recipient id in the body. Without a stronger gate, a teacher
 * could forge an in-app notification addressed to any other user — including
 * an admin — and it would appear alongside legitimate system messages. Users
 * have no way to tell a forged notification from a real one.
 *
 * Changing the gate to `requireRole('admin')` closes the hole. The
 * `notifications.create` permission remains in the catalog (for future use)
 * but is not consulted here — the role check is stricter.
 *
 * If teachers legitimately need to notify their own students, the right
 * shape is a recipient-scoped check in the service, not a broader role gate:
 *
 *     if (req.user.roleName === 'teacher') {
 *       const teacherId = await teacherIdForUser(req.user.sub)
 *       const allowed = await prisma.student.count({
 *         where: {
 *           id: body.userId,   // body.userId would be a student id
 *           class: { homeroomTeacherId: teacherId },
 *         },
 *       })
 *       if (!allowed) throw ApiError.forbidden('You can only notify your own students')
 *     }
 *
 * Until that exists, admin-only is the honest default.
 */
router.post(
  '/',
  requireRole('admin'),
  validateBody(createNotificationSchema),
  asyncHandler(notificationsController.create)
)

router.patch(
  '/:id',
  validateBody(updateNotificationSchema),
  asyncHandler(notificationsController.update)
)

router.delete(
  '/:id',
  asyncHandler(notificationsController.remove)
)

export default router