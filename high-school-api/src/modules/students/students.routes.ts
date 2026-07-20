import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { paginationQuerySchema, toSkipTake, buildPaginationMeta } from '@/utils/pagination'
import { createStudentSchema, updateStudentSchema } from './students.validation'

const router = Router()
router.use(authenticate)

const studentInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, isActive: true } },
  class: true,
}

router.get(
  '/',
  requirePermission('students', 'view'),
  asyncHandler(async (req, res) => {
    const pagination = paginationQuerySchema.parse(req.query)
    const { classId } = req.query as { classId?: string }
    const where = { deletedAt: null, classId }
    const [items, total] = await Promise.all([
      prisma.student.findMany({ where, include: studentInclude, ...toSkipTake(pagination) }),
      prisma.student.count({ where }),
    ])
    sendSuccess(res, items, 200, buildPaginationMeta(total, pagination))
  })
)

// Full profile: student + attendance summary + recent grades, in one call —
// this is what the "Student Profile" page needs.
router.get(
  '/:id',
  requirePermission('students', 'view'),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: { ...studentInclude, parents: { include: { parent: { include: { user: true } } } } },
    })
    if (!student) throw ApiError.notFound('Student not found')

    const [attendanceCounts, recentGrades] = await Promise.all([
      prisma.attendance.groupBy({ by: ['status'], where: { studentId: student.id }, _count: true }),
      prisma.grade.findMany({ where: { studentId: student.id }, orderBy: { createdAt: 'desc' }, take: 10, include: { subject: true } }),
    ])

    sendSuccess(res, { ...student, attendanceSummary: attendanceCounts, recentGrades })
  })
)

router.post(
  '/',
  requirePermission('students', 'create'),
  validateBody(createStudentSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await prisma.student.create({ data: req.body, include: studentInclude }))
  })
)

router.patch(
  '/:id',
  requirePermission('students', 'edit'),
  validateBody(updateStudentSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, await prisma.student.update({ where: { id: req.params.id }, data: req.body, include: studentInclude }))
  })
)

router.delete(
  '/:id',
  requirePermission('students', 'delete'),
  asyncHandler(async (req, res) => {
    await prisma.student.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } })
    res.status(204).send()
  })
)

export default router
