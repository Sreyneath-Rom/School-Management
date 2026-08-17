import { Router } from 'express'
import { notificationsController } from './notifications.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createNotificationSchema, updateNotificationSchema } from './notifications.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('notifications', 'view'), asyncHandler(notificationsController.list))

router.get('/:id', requirePermission('notifications', 'view'), asyncHandler(notificationsController.getById))

router.post(
  '/',
  requirePermission('notifications', 'create'),
  validateBody(createNotificationSchema),
  asyncHandler(notificationsController.create)
)

router.patch(
  '/:id',
  requirePermission('notifications', 'edit'),
  validateBody(updateNotificationSchema),
  asyncHandler(notificationsController.update)
)

router.delete('/:id', requirePermission('notifications', 'delete'), asyncHandler(notificationsController.remove))

export default router