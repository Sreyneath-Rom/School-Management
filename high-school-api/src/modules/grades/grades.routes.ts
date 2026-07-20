import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'
import { upsertGradeSchema } from './grades.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('grades', 'view'),
  asyncHandler(async (req, res) => {
    const { studentId, subjectId, period } = req.query as { studentId?: string; subjectId?: string; period?: string }
    const grades = await prisma.grade.findMany({
      where: { studentId, subjectId, period: period as never },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    })
    sendSuccess(res, grades)
  })
)

// Upsert on the (studentId, subjectId, period, periodLabel) unique constraint —
// re-submitting a grade for the same period corrects it instead of duplicating.
router.put(
  '/',
  requirePermission('grades', 'edit'),
  validateBody(upsertGradeSchema),
  asyncHandler(async (req, res) => {
    const { studentId, subjectId, period, periodLabel, ...rest } = req.body
    const grade = await prisma.grade.upsert({
      where: { studentId_subjectId_period_periodLabel: { studentId, subjectId, period, periodLabel } },
      create: { studentId, subjectId, period, periodLabel, ...rest },
      update: rest,
    })
    sendSuccess(res, grade)
  })
)

export default router
