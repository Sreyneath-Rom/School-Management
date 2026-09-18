import { Router } from 'express'
import { roomsController } from './rooms.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createRoomSchema, updateRoomSchema } from './rooms.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('rooms', 'view'), asyncHandler(roomsController.list))
router.get('/:id', requirePermission('rooms', 'view'), asyncHandler(roomsController.getById))
router.post('/', requirePermission('rooms', 'create'), validateBody(createRoomSchema), asyncHandler(roomsController.create))
router.patch('/:id', requirePermission('rooms', 'edit'), validateBody(updateRoomSchema), asyncHandler(roomsController.update))
router.delete('/:id', requirePermission('rooms', 'delete'), asyncHandler(roomsController.remove))

export default router
