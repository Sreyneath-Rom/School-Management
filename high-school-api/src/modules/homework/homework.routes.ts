import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import {
  createHomeworkSchema,
  gradeHomeworkSchema,
  submitHomeworkSchema,
  updateHomeworkSchema,
} from './homework.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('homework', 'view'),
  asyncHandler(async (req, res) => {
    const { subjectId } = req.query as { subjectId?: string }
    const items = await prisma.homework.findMany({
      where: { subjectId },
      include: { subject: true, _count: { select: { submissions: true } } },
      orderBy: { dueDate: 'asc' },
    })
    sendSuccess(res, items)
  })
)

router.post(
  '/',
  requirePermission('homework', 'create'),
  validateBody(createHomeworkSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await prisma.homework.create({ data: req.body }))
  })
)

router.patch(
  '/:id',
  requirePermission('homework', 'edit'),
  validateBody(updateHomeworkSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, await prisma.homework.update({ where: { id: req.params.id }, data: req.body }))
  })
)

router.delete(
  '/:id',
  requirePermission('homework', 'delete'),
  asyncHandler(async (req, res) => {
    await prisma.homework.delete({ where: { id: req.params.id } })
    res.status(204).send()
  })
)

// Student submits homework
router.post(
  '/:id/submissions',
  requirePermission('homework', 'create'),
  validateBody(submitHomeworkSchema),
  asyncHandler(async (req, res) => {
    const homework = await prisma.homework.findUnique({ where: { id: req.params.id } })
    if (!homework) throw ApiError.notFound('Homework not found')
    if (new Date() > homework.dueDate) throw ApiError.badRequest('Submission deadline has passed')

    const submission = await prisma.homeworkSubmission.upsert({
      where: { homeworkId_studentId: { homeworkId: req.params.id, studentId: req.body.studentId } },
      create: { homeworkId: req.params.id, studentId: req.body.studentId, fileUrl: req.body.fileUrl },
      update: { fileUrl: req.body.fileUrl, submittedAt: new Date() },
    })
    sendCreated(res, submission)
  })
)

// Teacher grades a submission
router.patch(
  '/submissions/:submissionId/grade',
  requirePermission('homework', 'edit'),
  validateBody(gradeHomeworkSchema),
  asyncHandler(async (req, res) => {
    const updated = await prisma.homeworkSubmission.update({
      where: { id: req.params.submissionId },
      data: { score: req.body.score, feedback: req.body.feedback, gradedAt: new Date() },
    })
    sendSuccess(res, updated)
  })
)

export default router
