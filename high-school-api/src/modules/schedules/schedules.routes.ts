import { Router } from 'express'
import { schedulesController } from './schedules.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createScheduleSchema,
  listSchedulesQuerySchema,
  updateScheduleSchema,
} from './schedules.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. Currently no
 * single-segment literals besides `/`, so the ordering below is safe. Add
 * new literals (e.g. `GET /today`) ABOVE `/:id` when they appear.
 */

router.get(
  '/',
  requirePermission('schedules', 'view'),
  validateQuery(listSchedulesQuerySchema),
  asyncHandler(schedulesController.list)
)

router.get(
  '/:id',
  requirePermission('schedules', 'view'),
  asyncHandler(schedulesController.getById)
)

router.post(
  '/',
  requirePermission('schedules', 'create'),
  validateBody(createScheduleSchema),
  asyncHandler(schedulesController.create)
)

router.patch(
  '/:id',
  requirePermission('schedules', 'edit'),
  validateBody(updateScheduleSchema),
  asyncHandler(schedulesController.update)
)

router.delete(
  '/:id',
  requirePermission('schedules', 'delete'),
  asyncHandler(schedulesController.remove)
)

export default router