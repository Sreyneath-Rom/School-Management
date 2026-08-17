import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const gradesService = {
  async list(filters: { studentId?: string; subjectId?: string; period?: string }) {
    return prisma.grade.findMany({
      where: { studentId: filters.studentId, subjectId: filters.subjectId, period: filters.period as never },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(gradeId: string) {
    const grade = await prisma.grade.findUnique({ where: { id: gradeId }, include: { subject: true } })
    if (!grade) throw ApiError.notFound('Grade not found')
    return grade
  },

  // Upsert on the (studentId, subjectId, period, periodLabel) unique constraint —
  // re-submitting a grade for the same period corrects it instead of duplicating.
  // Kept as-is from the original route rather than split into create/update,
  // since that's the actual semantics this endpoint needs (a teacher resubmitting
  // a grade shouldn't have to know whether one already exists).
  async upsert(input: {
    studentId: string
    subjectId: string
    teacherId: string
    period: 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
    periodLabel: string
    score: number
    maxScore: number
    comment?: string
  }) {
    const { studentId, subjectId, period, periodLabel, ...rest } = input
    return prisma.grade.upsert({
      where: { studentId_subjectId_period_periodLabel: { studentId, subjectId, period, periodLabel } },
      create: { studentId, subjectId, period, periodLabel, ...rest },
      update: rest,
    })
  },

  async remove(gradeId: string) {
    const grade = await prisma.grade.findUnique({ where: { id: gradeId } })
    if (!grade) throw ApiError.notFound('Grade not found')

    await prisma.grade.delete({ where: { id: gradeId } })
  },
}