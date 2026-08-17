import { Router } from 'express'
import { quizzesController } from './quizzes.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createQuizSchema, submitQuizSchema, updateQuizSchema } from './quizzes.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('quizzes', 'view'), asyncHandler(quizzesController.list))

router.get('/:id', requirePermission('quizzes', 'view'), asyncHandler(quizzesController.getById))

router.post(
  '/',
  requirePermission('quizzes', 'create'),
  validateBody(createQuizSchema),
  asyncHandler(quizzesController.create)
)

router.patch(
  '/:id',
  requirePermission('quizzes', 'edit'),
  validateBody(updateQuizSchema),
  asyncHandler(quizzesController.update)
)

router.delete('/:id', requirePermission('quizzes', 'delete'), asyncHandler(quizzesController.remove))

router.post(
  '/:id/submissions',
  requirePermission('quizzes', 'create'),
  validateBody(submitQuizSchema),
  asyncHandler(quizzesController.submit)
)

export default router