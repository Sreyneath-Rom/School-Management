import { Router } from 'express'
import { gradeLevelsController } from './gradeLevels.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createGradeLevelSchema,
  listGradeLevelsQuerySchema,
  updateGradeLevelSchema,
} from './gradeLevels.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('gradeLevels', 'view'),
  validateQuery(listGradeLevelsQuerySchema),
  asyncHandler(gradeLevelsController.list)
)

router.get(
  '/:id',
  requirePermission('gradeLevels', 'view'),
  asyncHandler(gradeLevelsController.getById)
)

router.post(
  '/',
  requirePermission('gradeLevels', 'create'),
  validateBody(createGradeLevelSchema),
  asyncHandler(gradeLevelsController.create)
)

router.patch(
  '/:id',
  requirePermission('gradeLevels', 'edit'),
  validateBody(updateGradeLevelSchema),
  asyncHandler(gradeLevelsController.update)
)

router.delete(
  '/:id',
  requirePermission('gradeLevels', 'delete'),
  asyncHandler(gradeLevelsController.remove)
)

export default router