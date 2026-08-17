import { Router } from 'express'
import { schedulesController } from './schedules.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createScheduleSchema, updateScheduleSchema } from './schedules.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('schedules', 'view'), asyncHandler(schedulesController.list))
router.get('/:id', requirePermission('schedules', 'view'), asyncHandler(schedulesController.getById))
router.post('/', requirePermission('schedules', 'create'), validateBody(createScheduleSchema), asyncHandler(schedulesController.create))
router.patch('/:id', requirePermission('schedules', 'edit'), validateBody(updateScheduleSchema), asyncHandler(schedulesController.update))
router.delete('/:id', requirePermission('schedules', 'delete'), asyncHandler(schedulesController.remove))

export default router