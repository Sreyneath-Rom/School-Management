import { Router } from 'express'
import { attendanceController } from './attendance.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { checkInSchema, checkOutSchema, bulkMarkSchema, updateAttendanceSchema } from './attendance.validation'

const router = Router()
router.use(authenticate)

router.get('/stats', requirePermission('attendance', 'view'), asyncHandler(attendanceController.getStats))

router.get('/', requirePermission('attendance', 'view'), asyncHandler(attendanceController.list))

router.get('/:id', requirePermission('attendance', 'view'), asyncHandler(attendanceController.getById))

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

router.delete('/:id', requirePermission('attendance', 'delete'), asyncHandler(attendanceController.remove))

export default router
