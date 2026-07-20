import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { createTeacherSchema, updateTeacherSchema } from './teachers.validation'

const router = Router()
router.use(authenticate)

const teacherInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true } },
  subjects: { include: { subject: true } },
  classesLed: true,
}

router.get(
  '/',
  requirePermission('teachers', 'view'),
  asyncHandler(async (_req, res) => {
    const teachers = await prisma.teacher.findMany({ where: { deletedAt: null }, include: teacherInclude })
    sendSuccess(res, teachers)
  })
)

router.get(
  '/:id',
  requirePermission('teachers', 'view'),
  asyncHandler(async (req, res) => {
    const teacher = await prisma.teacher.findFirst({ where: { id: req.params.id, deletedAt: null }, include: teacherInclude })
    if (!teacher) throw ApiError.notFound('Teacher not found')
    sendSuccess(res, teacher)
  })
)

router.post(
  '/',
  requirePermission('teachers', 'create'),
  validateBody(createTeacherSchema),
  asyncHandler(async (req, res) => {
    const { subjectIds, ...rest } = req.body
    const teacher = await prisma.teacher.create({
      data: { ...rest, subjects: { create: subjectIds.map((subjectId: string) => ({ subjectId })) } },
      include: teacherInclude,
    })
    sendCreated(res, teacher)
  })
)

router.patch(
  '/:id',
  requirePermission('teachers', 'edit'),
  validateBody(updateTeacherSchema),
  asyncHandler(async (req, res) => {
    const { subjectIds, ...rest } = req.body
    if (subjectIds) {
      await prisma.teacherSubject.deleteMany({ where: { teacherId: req.params.id } })
      await prisma.teacherSubject.createMany({
        data: subjectIds.map((subjectId: string) => ({ teacherId: req.params.id, subjectId })),
      })
    }
    const teacher = await prisma.teacher.update({ where: { id: req.params.id }, data: rest, include: teacherInclude })
    sendSuccess(res, teacher)
  })
)

router.delete(
  '/:id',
  requirePermission('teachers', 'delete'),
  asyncHandler(async (req, res) => {
    await prisma.teacher.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } })
    res.status(204).send()
  })
)

export default router
