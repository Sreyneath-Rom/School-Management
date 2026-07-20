import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { checkInSchema, checkOutSchema } from './attendance.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('attendance', 'view'),
  asyncHandler(async (req, res) => {
    const { studentId, from, to } = req.query as { studentId?: string; from?: string; to?: string }
    const records = await prisma.attendance.findMany({
      where: {
        studentId,
        date: from || to ? { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } : undefined,
      },
      orderBy: { date: 'desc' },
    })
    sendSuccess(res, records)
  })
)

router.post(
  '/check-in',
  requirePermission('attendance', 'create'),
  validateBody(checkInSchema),
  asyncHandler(async (req, res) => {
    const { studentId, date, status, note } = req.body
    const record = await prisma.attendance.upsert({
      where: { studentId_date: { studentId, date } },
      create: { studentId, date, status, note, checkIn: new Date() },
      update: { status, note, checkIn: new Date() },
    })
    sendSuccess(res, record)
  })
)

router.post(
  '/check-out',
  requirePermission('attendance', 'edit'),
  validateBody(checkOutSchema),
  asyncHandler(async (req, res) => {
    const { studentId, date } = req.body
    const existing = await prisma.attendance.findUnique({ where: { studentId_date: { studentId, date } } })
    if (!existing) throw ApiError.notFound('No check-in found for this student/date')
    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: new Date() },
    })
    sendSuccess(res, record)
  })
)

export default router
