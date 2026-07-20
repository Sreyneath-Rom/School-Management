import { Router } from 'express'
import { rolesController } from './roles.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createRoleSchema, updateRolePermissionsSchema } from './roles.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('roles', 'view'), asyncHandler(rolesController.list))
router.post('/', requirePermission('roles', 'create'), validateBody(createRoleSchema), asyncHandler(rolesController.create))
router.patch(
  '/:roleId/permissions',
  requirePermission('roles', 'edit'),
  validateBody(updateRolePermissionsSchema),
  asyncHandler(rolesController.updatePermissions)
)

export default router
