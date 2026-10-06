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

router.get(
  '/',
  validateQuery(listNotificationsQuerySchema),
  asyncHandler(notificationsController.list)
)

// Must be registered BEFORE `/:id` — otherwise `/:id` shadows it.
router.get(
  '/unread/count',
  asyncHandler(notificationsController.unreadCount)
)

router.get(
  '/:id',
  asyncHandler(notificationsController.getById)
)

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