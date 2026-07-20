import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

router.get(
  '/attendance',
  requirePermission('reports', 'view'),
  asyncHandler(async (req, res) => {
    const { classId, from, to } = req.query as { classId?: string; from?: string; to?: string }
    const records = await prisma.attendance.findMany({
      where: {
        student: classId ? { classId } : undefined,
        date: from || to ? { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } : undefined,
      },
      include: { student: { include: { user: true } } },
    })
    sendSuccess(res, records)
  })
)

router.get(
  '/grades',
  requirePermission('reports', 'view'),
  asyncHandler(async (req, res) => {
    const { classId, subjectId, period } = req.query as { classId?: string; subjectId?: string; period?: string }
    const grades = await prisma.grade.findMany({
      where: {
        subjectId,
        period: period as never,
        student: classId ? { classId } : undefined,
      },
      include: { student: { include: { user: true } }, subject: true },
    })
    sendSuccess(res, grades)
  })
)

router.get(
  '/students/:id',
  requirePermission('reports', 'view'),
  asyncHandler(async (req, res) => {
    const [attendance, grades, leaveRequests] = await Promise.all([
      prisma.attendance.groupBy({ by: ['status'], where: { studentId: req.params.id }, _count: true }),
      prisma.grade.findMany({ where: { studentId: req.params.id }, include: { subject: true } }),
      prisma.leaveRequest.findMany({ where: { studentId: req.params.id } }),
    ])
    sendSuccess(res, { attendance, grades, leaveRequests })
  })
)

router.get(
  '/teachers/:id',
  requirePermission('reports', 'view'),
  asyncHandler(async (req, res) => {
    const [subjects, classesLed, homeworkGiven, quizzesGiven] = await Promise.all([
      prisma.teacherSubject.findMany({ where: { teacherId: req.params.id }, include: { subject: true } }),
      prisma.class.findMany({ where: { homeroomTeacherId: req.params.id } }),
      prisma.homework.count({ where: { teacherId: req.params.id } }),
      prisma.quiz.count({ where: { teacherId: req.params.id } }),
    ])
    sendSuccess(res, { subjects, classesLed, homeworkGiven, quizzesGiven })
  })
)

export default router
