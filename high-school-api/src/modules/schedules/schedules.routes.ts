import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { createScheduleSchema, updateScheduleSchema } from './schedules.validation'
import { schedulesService } from './schedules.service'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('schedules', 'view'),
  asyncHandler(async (req, res) => {
    const { classId, teacherId } = req.query as { classId?: string; teacherId?: string }
    const schedules = await prisma.schedule.findMany({
      where: { classId, teacherId },
      include: { class: true, subject: true, teacher: { include: { user: true } } },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
    sendSuccess(res, schedules)
  })
)

router.get(
  '/:id',
  requirePermission('schedules', 'view'),
  asyncHandler(async (req, res) => {
    const schedule = await prisma.schedule.findUnique({ where: { id: req.params.id } })
    if (!schedule) throw ApiError.notFound()
    sendSuccess(res, schedule)
  })
)

// Conflict checking (teacher / class / room double-booking) lives in schedules.service —
// this is the one CRUD module that couldn't use the generic factory as-is.
router.post(
  '/',
  requirePermission('schedules', 'create'),
  validateBody(createScheduleSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await schedulesService.create(req.body))
  })
)

router.patch(
  '/:id',
  requirePermission('schedules', 'edit'),
  validateBody(updateScheduleSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, await schedulesService.update(req.params.id, req.body))
  })
)

router.delete(
  '/:id',
  requirePermission('schedules', 'delete'),
  asyncHandler(async (req, res) => {
    await prisma.schedule.delete({ where: { id: req.params.id } })
    res.status(204).send()
  })
)

export default router
