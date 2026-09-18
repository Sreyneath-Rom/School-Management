import { Router } from 'express'
import { quizzesController } from './quizzes.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission, requireRole } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createQuizSchema,
  listQuizzesQuerySchema,
  submitQuizSchema,
  updateQuizSchema,
} from './quizzes.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. Currently no
 * single-segment literals besides `/`, so the ordering below is safe. When
 * adding one (e.g. `GET /upcoming`), register it ABOVE `/:id`.
 */

/**
 * Reads — every authenticated user with `quizzes.view` (per the seed: admin,
 * teacher, student, parent all have it). The list projection deliberately
 * omits questions, so there's no answer-key exposure here regardless of role.
 * `GET /:id` returns questions, and the service projects them role-aware.
 */
router.get(
  '/',
  requirePermission('quizzes', 'view'),
  validateQuery(listQuizzesQuerySchema),
  asyncHandler(quizzesController.list)
)

router.get(
  '/:id',
  requirePermission('quizzes', 'view'),
  asyncHandler(quizzesController.getById)
)

/**
 * Create/update/delete — `requireRole` is on top of the permission check.
 *
 * WHY: the seed grants students `quizzes.create` so they can SUBMIT (see the
 * submit route below). If this create route only checked `quizzes.create`,
 * a student could POST a new quiz. `requireRole('admin', 'teacher')` closes
 * that hole. The permission check remains in place for future flexibility
 * (e.g. a "reviewer" role that can see the quiz editor but not submit).
 */
router.post(
  '/',
  requireRole('admin', 'teacher'),
  requirePermission('quizzes', 'create'),
  validateBody(createQuizSchema),
  asyncHandler(quizzesController.create)
)

router.patch(
  '/:id',
  requireRole('admin', 'teacher'),
  requirePermission('quizzes', 'edit'),
  validateBody(updateQuizSchema),
  asyncHandler(quizzesController.update)
)

router.delete(
  '/:id',
  requireRole('admin', 'teacher'),
  requirePermission('quizzes', 'delete'),
  asyncHandler(quizzesController.remove)
)

/**
 * Student submission. Gated on `quizzes.create` (which the seed grants
 * students) and on role `student` — a teacher who somehow holds the
 * permission gets a 403 from `studentIdForUser` before any write.
 */
router.post(
  '/:id/submissions',
  requireRole('student'),
  requirePermission('quizzes', 'create'),
  validateBody(submitQuizSchema),
  asyncHandler(quizzesController.submit)
)

export default router