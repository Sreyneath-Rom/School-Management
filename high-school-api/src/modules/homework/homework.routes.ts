import { Router } from 'express'
import { homeworkController } from './homework.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createHomeworkSchema,
  gradeHomeworkSchema,
  listHomeworkQuerySchema,
  submitHomeworkSchema,
  updateHomeworkSchema,
} from './homework.validation'

const router = Router()
router.use(authenticate)

// -----------------------------------------------------------------------------
// ROUTE ORDER — DO NOT REORDER
//
// `/:id` is a single-segment param. Every literal path must be registered
// before it, or `/:id` shadows the literal. Currently the literals are two
// segments (`/submissions/:id/grade`) so they don't collide today — but the
// moment a single-segment literal such as `/recent` or `/upcoming` is added,
// `/:id` will swallow it unless that route is placed above.
//
// Rule: literal paths first, `/:id` last, for every method.
// -----------------------------------------------------------------------------

router.get(
  '/',
  requirePermission('homework', 'view'),
  validateQuery(listHomeworkQuerySchema),
  asyncHandler(homeworkController.list)
)

// Teacher grades a submission. Registered BEFORE `/:id` to honour the rule
// above, even though this is a PATCH and `/:id` below is GET/PATCH/DELETE —
// keep the ordering consistent so the pattern is obvious.
router.patch(
  '/submissions/:submissionId/grade',
  requirePermission('homework', 'edit'),
  validateBody(gradeHomeworkSchema),
  asyncHandler(homeworkController.grade)
)

// Student submits homework. `studentId` is resolved from the token in the
// controller — the schema takes only `content` / `fileUrl`.
router.post(
  '/:id/submissions',
  requirePermission('homework', 'create'),
  validateBody(submitHomeworkSchema),
  asyncHandler(homeworkController.submit)
)

router.get(
  '/:id',
  requirePermission('homework', 'view'),
  asyncHandler(homeworkController.getById)
)

router.post(
  '/',
  requirePermission('homework', 'create'),
  validateBody(createHomeworkSchema),
  asyncHandler(homeworkController.create)
)

router.patch(
  '/:id',
  requirePermission('homework', 'edit'),
  validateBody(updateHomeworkSchema),
  asyncHandler(homeworkController.update)
)

router.delete(
  '/:id',
  requirePermission('homework', 'delete'),
  asyncHandler(homeworkController.remove)
)

export default router