import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [studentCount, teacherCount, classCount, pendingLeaveRequests] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.teacher.count({ where: { deletedAt: null } }),
      prisma.class.count({ where: { deletedAt: null } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ])
    sendSuccess(res, { studentCount, teacherCount, classCount, pendingLeaveRequests })
  })
)

router.get(
  '/attendance-summary',
  asyncHandler(async (req, res) => {
    const { from, to } = req.query as { from?: string; to?: string }
    const counts = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date: from || to ? { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } : undefined,
      },
      _count: true,
    })
    sendSuccess(res, counts)
  })
)

router.get(
  '/grade-summary',
  asyncHandler(async (_req, res) => {
    const bySubject = await prisma.grade.groupBy({ by: ['subjectId'], _avg: { score: true }, _count: true })
    sendSuccess(res, bySubject)
  })
)

router.get(
  '/notifications',
  asyncHandler(async (req, res) => {
    if (!req.user) return
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.sub, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    sendSuccess(res, notifications)
  })
)

export default router
