import { Router } from 'express'
import { announcementsController } from './announcements.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcements.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('announcements', 'view'), asyncHandler(announcementsController.list))

router.get('/:id', requirePermission('announcements', 'view'), asyncHandler(announcementsController.getById))

router.post(
  '/',
  requirePermission('announcements', 'create'),
  validateBody(createAnnouncementSchema),
  asyncHandler(announcementsController.create)
)

router.patch(
  '/:id',
  requirePermission('announcements', 'edit'),
  validateBody(updateAnnouncementSchema),
  asyncHandler(announcementsController.update)
)

router.delete('/:id', requirePermission('announcements', 'delete'), asyncHandler(announcementsController.remove))

export default router