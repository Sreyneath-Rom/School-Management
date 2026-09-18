import { Router } from 'express'
import { classesController } from './classes.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createClassSchema,
  listClassesQuerySchema,
  updateClassSchema,
} from './classes.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('classes', 'view'),
  validateQuery(listClassesQuerySchema),
  asyncHandler(classesController.list)
)

router.get(
  '/:id',
  requirePermission('classes', 'view'),
  asyncHandler(classesController.getById)
)

router.post(
  '/',
  requirePermission('classes', 'create'),
  validateBody(createClassSchema),
  asyncHandler(classesController.create)
)

router.patch(
  '/:id',
  requirePermission('classes', 'edit'),
  validateBody(updateClassSchema),
  asyncHandler(classesController.update)
)

router.delete(
  '/:id',
  requirePermission('classes', 'delete'),
  asyncHandler(classesController.remove)
)

export default router