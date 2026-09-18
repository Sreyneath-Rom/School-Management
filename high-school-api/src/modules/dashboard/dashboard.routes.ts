import { Router } from 'express'
import { dashboardController } from './dashboard.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  attendanceSummaryQuerySchema,
  gradeSummaryQuerySchema,
  statsQuerySchema,
} from './dashboard.validation'

const router = Router()
router.use(authenticate)

/**
 * All routes are gated by `dashboard.view`. The seed grants it to every
 * role (admin, teacher, student, parent), so in practice this is
 * equivalent to `authenticate` alone — but naming the permission here
 * means a future role without dashboard access is denied by the RBAC
 * layer rather than by a special case in this file.
 *
 * The previous version of this file had a comment claiming these routes
 * were NOT permission-gated, which contradicted the `requirePermission`
 * calls right below it. Removed.
 */

router.get(
  '/stats',
  requirePermission('dashboard', 'view'),
  validateQuery(statsQuerySchema),
  asyncHandler(dashboardController.stats)
)

router.get(
  '/attendance-summary',
  requirePermission('dashboard', 'view'),
  validateQuery(attendanceSummaryQuerySchema),
  asyncHandler(dashboardController.attendanceSummary)
)

router.get(
  '/grade-summary',
  requirePermission('dashboard', 'view'),
  validateQuery(gradeSummaryQuerySchema),
  asyncHandler(dashboardController.gradeSummary)
)

router.get(
  '/notifications',
  requirePermission('dashboard', 'view'),
  validateQuery(statsQuerySchema),
  asyncHandler(dashboardController.recentNotifications)
)

export default router