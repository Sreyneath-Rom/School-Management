import { Router } from 'express'
import { reportsController } from './reports.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateParams, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  attendanceReportQuerySchema,
  gradesReportQuerySchema,
  reportSubjectParamSchema,
} from './reports.validation'

const router = Router()
router.use(authenticate)

/**
 * All report routes are staff-only (`reports.view`, held by admin and
 * teacher per the seed). Self-service access for students and parents —
 * "show me my own attendance", "show me my child's grades" — lives in the
 * domain modules (`GET /grades/me`, `GET /attendance` with role-scoped
 * filtering, etc.). Reports is for staff-facing aggregate views.
 *
 * ROUTE ORDER: literal paths (`/attendance`, `/grades`) before param paths
 * (`/students/:id`, `/teachers/:id`). No collision today — the literal paths
 * are single-segment and the param paths are two — but keeping the rule
 * avoids a surprise if a single-segment `/attendance` variant is ever added.
 */

router.get(
  '/attendance',
  requirePermission('reports', 'view'),
  validateQuery(attendanceReportQuerySchema),
  asyncHandler(reportsController.attendance)
)

router.get(
  '/grades',
  requirePermission('reports', 'view'),
  validateQuery(gradesReportQuerySchema),
  asyncHandler(reportsController.grades)
)

router.get(
  '/students/:id',
  requirePermission('reports', 'view'),
  validateParams(reportSubjectParamSchema),
  asyncHandler(reportsController.forStudent)
)

router.get(
  '/teachers/:id',
  requirePermission('reports', 'view'),
  validateParams(reportSubjectParamSchema),
  asyncHandler(reportsController.forTeacher)
)

export default router