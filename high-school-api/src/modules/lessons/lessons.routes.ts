import { Router } from 'express'
import { lessonsController } from './lessons.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createLessonSchema, updateLessonSchema } from './lessons.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('lessons', 'view'), asyncHandler(lessonsController.list))

router.get('/:id', requirePermission('lessons', 'view'), asyncHandler(lessonsController.getById))

router.post(
  '/',
  requirePermission('lessons', 'create'),
  validateBody(createLessonSchema),
  asyncHandler(lessonsController.create)
)

router.patch(
  '/:id',
  requirePermission('lessons', 'edit'),
  validateBody(updateLessonSchema),
  asyncHandler(lessonsController.update)
)

router.delete('/:id', requirePermission('lessons', 'delete'), asyncHandler(lessonsController.remove))

export default router