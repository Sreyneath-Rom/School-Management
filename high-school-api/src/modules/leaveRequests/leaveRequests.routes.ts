import { Router } from 'express'
import { leaveRequestsController } from './leaveRequests.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createLeaveRequestSchema,
  reviewLeaveRequestSchema,
  updateLeaveRequestSchema,
} from './leaveRequests.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('leaveRequests', 'view'), asyncHandler(leaveRequestsController.list))

router.get('/:id', requirePermission('leaveRequests', 'view'), asyncHandler(leaveRequestsController.getById))

router.post(
  '/',
  requirePermission('leaveRequests', 'create'),
  validateBody(createLeaveRequestSchema),
  asyncHandler(leaveRequestsController.create)
)

router.patch(
  '/:id',
  requirePermission('leaveRequests', 'edit'),
  validateBody(updateLeaveRequestSchema),
  asyncHandler(leaveRequestsController.update)
)

router.patch(
  '/:id/review',
  requirePermission('leaveRequests', 'edit'),
  validateBody(reviewLeaveRequestSchema),
  asyncHandler(leaveRequestsController.review)
)

router.delete('/:id', requirePermission('leaveRequests', 'delete'), asyncHandler(leaveRequestsController.remove))

export default router