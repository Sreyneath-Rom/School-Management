import { Router } from 'express'
import { dashboardController } from './dashboard.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { asyncHandler } from '@/utils/asyncHandler'

const router = Router()
router.use(authenticate)

// NOTE: unlike every other module in this codebase, these routes have no
// requirePermission gate — only authenticate. Kept that way since the
// original file didn't have one either; if dashboard data should be
// restricted (e.g. to staff), add requirePermission('dashboard', 'view')
// per route the same way the other modules do.

router.get('/stats', asyncHandler(dashboardController.stats))

router.get('/attendance-summary', asyncHandler(dashboardController.attendanceSummary))

router.get('/grade-summary', asyncHandler(dashboardController.gradeSummary))

router.get('/notifications', asyncHandler(dashboardController.recentNotifications))

export default router