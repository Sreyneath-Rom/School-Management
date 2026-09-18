import { Router } from 'express'
import { gradesController } from './grades.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  listGradesQuerySchema,
  upsertGradeSchema,
} from './grades.validation'

const router = Router()
router.use(authenticate)

// Route order: `/me` is a single-segment literal and must be registered
// before `/:id`, which is a single-segment param. Otherwise a GET /me would
// be routed to getById with params.id = "me".
router.get(
  '/me',
  requirePermission('grades', 'view'),
  asyncHandler(gradesController.me)
)

router.get(
  '/',
  requirePermission('grades', 'view'),
  validateQuery(listGradesQuerySchema),
  asyncHandler(gradesController.list)
)

router.get(
  '/:id',
  requirePermission('grades', 'view'),
  asyncHandler(gradesController.getById)
)

/**
 * Upsert on the (studentId, subjectId, period, periodLabel) unique constraint
 * — resubmitting a grade for the same period corrects it instead of creating
 * a duplicate.
 *
 * Permission is `edit` (not `create`): the semantics are "set the current
 * value for this slot", which is a correction whether or not a row existed.
 * If a client needs to know whether they created or updated, the response
 * doesn't currently distinguish — call `GET /:id` first, or add a `created`
 * boolean to the response envelope later.
 */
router.put(
  '/',
  requirePermission('grades', 'edit'),
  validateBody(upsertGradeSchema),
  asyncHandler(gradesController.upsert)
)

router.delete(
  '/:id',
  requirePermission('grades', 'delete'),
  asyncHandler(gradesController.remove)
)

export default router