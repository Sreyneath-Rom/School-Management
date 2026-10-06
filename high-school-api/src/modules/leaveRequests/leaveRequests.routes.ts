import { Router, type NextFunction, type Request, type Response } from 'express'
import { leaveRequestsController } from './leaveRequests.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createLeaveRequestForStudentSchema,
  createLeaveRequestSchema,
  listLeaveRequestsQuerySchema,
  reviewLeaveRequestSchema,
  updateLeaveRequestSchema,
} from './leaveRequests.validation'

const router = Router()
router.use(authenticate)

function validateCreateBody(req: Request, res: Response, next: NextFunction) {
  const schema =
    req.user?.roleName === 'student'
      ? createLeaveRequestSchema
      : createLeaveRequestForStudentSchema
  return validateBody(schema)(req, res, next)
}

// `/pending/count` must come BEFORE `/:id` so the literal isn't shadowed.
router.get(
  '/pending/count',
  requirePermission('leaveRequests', 'view'),
  asyncHandler(leaveRequestsController.pendingCount)
)

router.get(
  '/',
  requirePermission('leaveRequests', 'view'),
  validateQuery(listLeaveRequestsQuerySchema),
  asyncHandler(leaveRequestsController.list)
)

router.get(
  '/:id',
  requirePermission('leaveRequests', 'view'),
  asyncHandler(leaveRequestsController.getById)
)

router.post(
  '/',
  requirePermission('leaveRequests', 'create'),
  validateCreateBody,
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

router.delete(
  '/:id',
  requirePermission('leaveRequests', 'delete'),
  asyncHandler(leaveRequestsController.remove)
)

export default router