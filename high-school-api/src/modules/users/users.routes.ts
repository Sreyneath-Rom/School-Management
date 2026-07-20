import { Router } from 'express'
import { usersController } from './users.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createUserSchema, resetUserPasswordSchema, updateUserSchema } from './users.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('users', 'view'), asyncHandler(usersController.list))
router.get('/:id', requirePermission('users', 'view'), asyncHandler(usersController.getById))
router.post('/', requirePermission('users', 'create'), validateBody(createUserSchema), asyncHandler(usersController.create))
router.patch('/:id', requirePermission('users', 'edit'), validateBody(updateUserSchema), asyncHandler(usersController.update))
router.delete('/:id', requirePermission('users', 'delete'), asyncHandler(usersController.remove))
router.post(
  '/:id/reset-password',
  requirePermission('users', 'edit'),
  validateBody(resetUserPasswordSchema),
  asyncHandler(usersController.resetPassword)
)

export default router
