import { Router } from 'express'
import { permissionsController } from './permissions.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createPermissionSchema, updatePermissionSchema } from './permissions.validation'

const router = Router()
router.use(authenticate)

// There's no dedicated "permissions" module in the permission catalog itself
// (chicken-and-egg), so — same as the original GET route — these are gated
// on the "roles" module: viewing/managing permissions is part of managing roles.

router.get('/', requirePermission('roles', 'view'), asyncHandler(permissionsController.list))

router.post(
  '/',
  requirePermission('roles', 'edit'),
  validateBody(createPermissionSchema),
  asyncHandler(permissionsController.create)
)

router.patch(
  '/:permissionId',
  requirePermission('roles', 'edit'),
  validateBody(updatePermissionSchema),
  asyncHandler(permissionsController.update)
)

router.delete('/:permissionId', requirePermission('roles', 'edit'), asyncHandler(permissionsController.remove))

export default router