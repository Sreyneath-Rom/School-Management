import { Router } from 'express'
import { gradesController } from './grades.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { upsertGradeSchema } from './grades.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('grades', 'view'), asyncHandler(gradesController.list))

router.get('/:id', requirePermission('grades', 'view'), asyncHandler(gradesController.getById))

// Upsert on the (studentId, subjectId, period, periodLabel) unique constraint —
// re-submitting a grade for the same period corrects it instead of duplicating.
router.put(
  '/',
  requirePermission('grades', 'edit'),
  validateBody(upsertGradeSchema),
  asyncHandler(gradesController.upsert)
)

router.delete('/:id', requirePermission('grades', 'delete'), asyncHandler(gradesController.remove))

export default router