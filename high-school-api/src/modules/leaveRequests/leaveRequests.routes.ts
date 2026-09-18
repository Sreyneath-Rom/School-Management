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

/**
 * The create endpoint takes a different body shape depending on role:
 *   - student: { startDate, endDate, reason }
 *   - everyone else: { studentId, startDate, endDate, reason }
 *
 * A small middleware applies the correct schema. This is cleaner than two
 * routes with the same path, and clearer than a single permissive schema
 * that lets a student smuggle in a `studentId` (Zod would strip it, but the
 * intent wouldn't be obvious from the schema alone).
 */
function validateCreateBody(req: Request, res: Response, next: NextFunction) {
  const schema =
    req.user?.roleName === 'student'
      ? createLeaveRequestSchema
      : createLeaveRequestForStudentSchema
  return validateBody(schema)(req, res, next)
}

// -----------------------------------------------------------------------------
// ROUTE ORDER: literal paths before `/:id`, per method. Currently no literal
// single-segment GETs exist besides `/`, so the ordering below is safe. Add
// new literals ABOVE `/:id` when they appear.
// -----------------------------------------------------------------------------

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