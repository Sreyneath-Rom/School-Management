import { Router } from 'express'
import { dashboardController } from './dashboard.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'

const router = Router()
router.use(authenticate)

// NOTE: unlike every other module in this codebase, these routes have no
// requirePermission gate — only authenticate. Kept that way since the
// original file didn't have one either; if dashboard data should be
// restricted (e.g. to staff), add requirePermission('dashboard', 'view')
// per route the same way the other modules do.

router.get('/stats', requirePermission('dashboard', 'view'), asyncHandler(dashboardController.stats))

router.get('/attendance-summary', requirePermission('dashboard', 'view'), asyncHandler(dashboardController.attendanceSummary))

router.get('/grade-summary', requirePermission('dashboard', 'view'), asyncHandler(dashboardController.gradeSummary))

router.get('/notifications', requirePermission('dashboard', 'view'), asyncHandler(dashboardController.recentNotifications))

export default router