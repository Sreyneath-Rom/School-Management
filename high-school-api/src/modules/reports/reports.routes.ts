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