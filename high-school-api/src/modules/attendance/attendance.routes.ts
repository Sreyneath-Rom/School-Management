import { Router } from 'express'
import { attendanceController } from './attendance.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  bulkMarkSchema,
  checkInSchema,
  checkOutSchema,
  listAttendanceQuerySchema,
  statsQuerySchema,
  updateAttendanceSchema,
} from './attendance.validation'

const router = Router()
router.use(authenticate)

// Route order: `/stats` is a single-segment literal and `/:id` is a
// single-segment param, so `/stats` must be registered first — otherwise a
// GET /stats would be routed to getById with params.id = "stats".
router.get(
  '/stats',
  requirePermission('attendance', 'view'),
  validateQuery(statsQuerySchema),
  asyncHandler(attendanceController.getStats)
)

router.get(
  '/',
  requirePermission('attendance', 'view'),
  validateQuery(listAttendanceQuerySchema),
  asyncHandler(attendanceController.list)
)

router.get(
  '/:id',
  requirePermission('attendance', 'view'),
  asyncHandler(attendanceController.getById)
)

router.post(
  '/check-in',
  requirePermission('attendance', 'create'),
  validateBody(checkInSchema),
  asyncHandler(attendanceController.checkIn)
)

router.post(
  '/bulk',
  requirePermission('attendance', 'create'),
  validateBody(bulkMarkSchema),
  asyncHandler(attendanceController.bulkMark)
)

router.post(
  '/check-out',
  requirePermission('attendance', 'edit'),
  validateBody(checkOutSchema),
  asyncHandler(attendanceController.checkOut)
)

router.patch(
  '/:id',
  requirePermission('attendance', 'edit'),
  validateBody(updateAttendanceSchema),
  asyncHandler(attendanceController.update)
)

router.delete(
  '/:id',
  requirePermission('attendance', 'delete'),
  asyncHandler(attendanceController.remove)
)

export default router