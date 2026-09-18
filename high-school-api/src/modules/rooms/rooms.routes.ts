import { Router } from 'express'
import { roomsController } from './rooms.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createRoomSchema,
  listRoomsQuerySchema,
  updateRoomSchema,
} from './rooms.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. Currently no
 * single-segment literals besides `/`, so the ordering below is safe. Add
 * new literals (e.g. `GET /available`) ABOVE `/:id` when they appear.
 */

router.get(
  '/',
  requirePermission('rooms', 'view'),
  validateQuery(listRoomsQuerySchema),
  asyncHandler(roomsController.list)
)

router.get(
  '/:id',
  requirePermission('rooms', 'view'),
  asyncHandler(roomsController.getById)
)

router.post(
  '/',
  requirePermission('rooms', 'create'),
  validateBody(createRoomSchema),
  asyncHandler(roomsController.create)
)

router.patch(
  '/:id',
  requirePermission('rooms', 'edit'),
  validateBody(updateRoomSchema),
  asyncHandler(roomsController.update)
)

router.delete(
  '/:id',
  requirePermission('rooms', 'delete'),
  asyncHandler(roomsController.remove)
)

export default router