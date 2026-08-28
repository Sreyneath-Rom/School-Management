import { Router } from 'express'
import attendanceRoutes from '@/modules/attendance/attendance.routes'
import leaveRequestsRoutes from '@/modules/leaveRequests/leaveRequests.routes'

const router = Router()

/**
 * Attendance & Leave Requests Unified Routes
 */
router.use('/', attendanceRoutes)
router.use('/leaves', leaveRequestsRoutes)

export default router
