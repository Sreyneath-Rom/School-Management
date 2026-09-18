import { Router } from 'express'
import { examsController } from './exams.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  listExamsQuerySchema,
  listMarksQuerySchema,
  listReportCardsQuerySchema,
  listSchedulesQuerySchema,
} from './exams.validation'

const router = Router()
router.use(authenticate)

/**
 * The exams module is a stub. Reads return empty data; writes return 501
 * Not Implemented. The Prisma models (Exam, ExamSchedule, MarkEntry,
 * ReportCard) don't exist yet — see the note at the top of exams.service.ts
 * for the implementation path.
 *
 * Permissions: `grades.*` rather than `exams.*`. The permission catalog in
 * prisma/seed.ts defines `exams.*` keys but grants no role those permissions,
 * whereas `grades.*` is granted broadly. Using `grades.*` keeps the module
 * reachable by teachers and admins without a seed migration. If exams ever
 * gets its own role grants, switch these to `requirePermission('exams', …)`.
 */

// -----------------------------------------------------------------------------
// ROUTE ORDER — DO NOT REORDER
//
// Express matches in registration order. Every literal path (`/schedules/all`,
// `/marks/entries`, `/report-cards/all`) must be registered BEFORE `/:id`.
// Today they don't collide because they have two segments and `/:id` has one,
// but the moment a single-segment literal such as `/schedules` is added, `/:id`
// shadows it unless that new route also sits above `/:id`.
//
// Rule: literal paths first, `/:id` last, for every method.
// -----------------------------------------------------------------------------

// ---- Reads ----

router.get(
  '/',
  requirePermission('grades', 'view'),
  validateQuery(listExamsQuerySchema),
  asyncHandler(examsController.list)
)

router.get(
  '/schedules/all',
  requirePermission('grades', 'view'),
  validateQuery(listSchedulesQuerySchema),
  asyncHandler(examsController.listSchedules)
)

router.get(
  '/marks/entries',
  requirePermission('grades', 'view'),
  validateQuery(listMarksQuerySchema),
  asyncHandler(examsController.listMarks)
)

router.get(
  '/report-cards/all',
  requirePermission('grades', 'view'),
  validateQuery(listReportCardsQuerySchema),
  asyncHandler(examsController.listReportCards)
)

// `/:id` — must be the last GET registered.
router.get(
  '/:id',
  requirePermission('grades', 'view'),
  asyncHandler(examsController.getById)
)

// ---- Writes ----
//
// No `validateBody` yet: the service throws 501 before inspecting the body,
// so there is nothing to validate. Adding validation here would return 400
// for input that the eventual implementation will accept — a temporary
// contract that isn't the real one. Validation arrives with the handler.

router.post(
  '/',
  requirePermission('grades', 'create'),
  asyncHandler(examsController.create)
)

router.put(
  '/:id',
  requirePermission('grades', 'edit'),
  asyncHandler(examsController.update)
)

router.delete(
  '/:id',
  requirePermission('grades', 'delete'),
  asyncHandler(examsController.remove)
)

router.post(
  '/schedules',
  requirePermission('grades', 'create'),
  asyncHandler(examsController.createSchedule)
)

router.post(
  '/marks/batch',
  requirePermission('grades', 'create'),
  asyncHandler(examsController.batchMark)
)

router.post(
  '/report-cards/generate',
  requirePermission('grades', 'create'),
  asyncHandler(examsController.generateReportCard)
)

export default router