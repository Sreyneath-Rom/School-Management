import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { createQuizSchema, submitQuizSchema } from './quizzes.validation'
import { quizzesService } from './quizzes.service'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('quizzes', 'view'),
  asyncHandler(async (req, res) => {
    const { subjectId } = req.query as { subjectId?: string }
    const quizzes = await prisma.quiz.findMany({
      where: { subjectId },
      include: { subject: true, _count: { select: { questions: true, submissions: true } } },
      orderBy: { createdAt: 'desc' },
    })
    sendSuccess(res, quizzes)
  })
)

router.get(
  '/:id',
  requirePermission('quizzes', 'view'),
  asyncHandler(async (req, res) => {
    // NOTE: for students taking the quiz, strip `correctAnswer` from the
    // response at the controller level based on req.user.roleName before
    // shipping this to production.
    const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id }, include: { questions: true } })
    sendSuccess(res, quiz)
  })
)

router.post(
  '/',
  requirePermission('quizzes', 'create'),
  validateBody(createQuizSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await quizzesService.create(req.body))
  })
)

router.post(
  '/:id/submissions',
  requirePermission('quizzes', 'create'),
  validateBody(submitQuizSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await quizzesService.submit(req.params.id, req.body.studentId, req.body.answers))
  })
)

export default router
