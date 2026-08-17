import { Router } from 'express'
import { homeworkController } from './homework.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createHomeworkSchema,
  gradeHomeworkSchema,
  submitHomeworkSchema,
  updateHomeworkSchema,
} from './homework.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('homework', 'view'), asyncHandler(homeworkController.list))

router.get('/:id', requirePermission('homework', 'view'), asyncHandler(homeworkController.getById))

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

router.delete('/:id', requirePermission('homework', 'delete'), asyncHandler(homeworkController.remove))

// Student submits homework
router.post(
  '/:id/submissions',
  requirePermission('homework', 'create'),
  validateBody(submitHomeworkSchema),
  asyncHandler(homeworkController.submit)
)

// Teacher grades a submission
router.patch(
  '/submissions/:submissionId/grade',
  requirePermission('homework', 'edit'),
  validateBody(gradeHomeworkSchema),
  asyncHandler(homeworkController.grade)
)

export default router