import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  ListGradesQuery,
  UpsertGradeBody,
} from './grades.validation'

const gradeInclude = {
  subject: { select: { id: true, name: true, code: true } },
  student: {
    select: {
      id: true,
      studentCode: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
  teacher: {
    select: {
      id: true,
      teacherCode: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
} as const

/**
 * Confirms a set of related entities exist before writing FK references that
 * point at them. Without this, a typo'd id surfaces as a P2003 foreign key
 * violation from Prisma and gets mapped to a generic error — the caller can't
 * tell which of three ids was wrong.
 */
async function assertRelatedExist(input: {
  studentId: string
  subjectId: string
  teacherId: string
}) {
  const [student, subject, teacher] = await Promise.all([
    prisma.student.findFirst({
      where: { id: input.studentId, deletedAt: null },
      select: { id: true },
    }),
    prisma.subject.findUnique({
      where: { id: input.subjectId },
      select: { id: true },
    }),
    prisma.teacher.findFirst({
      where: { id: input.teacherId, deletedAt: null },
      select: { id: true },
    }),
  ])

  if (!student) throw ApiError.badRequest('studentId does not refer to an existing student')
  if (!subject) throw ApiError.badRequest('subjectId does not refer to an existing subject')
  if (!teacher) throw ApiError.badRequest('teacherId does not refer to an existing teacher')
}

/**
 * Resolves the Teacher row for an authenticated user. Used by the controller
 * to derive `teacherId` from `req.user.sub` — the caller's identity, not
 * client input.
 */
export async function teacherIdForUser(userId: string): Promise<string> {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!teacher) {
    throw ApiError.forbidden('Only teachers can enter grades')
  }
  return teacher.id
}

export const gradesService = {
  /**
   * Resolves the Student row for an authenticated user. Extracted so the
   * controller can look up the caller's studentId directly, rather than
   * fetching a full grade list and reading `items[0].studentId` — which was
   * both wasteful and fragile (a student with zero grades broke it).
   */
  async studentIdForUser(userId: string): Promise<string> {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!student) throw ApiError.notFound('Student profile not found')
    return student.id
  },

  /**
   * Convenience wrapper for the `/me` endpoint: resolves the caller's Student
   * row, then runs the same paginated list as `list()`. Returns the paginated
   * envelope so callers can rely on a single shape.
   */
  async listForUser(userId: string) {
    const studentId = await gradesService.studentIdForUser(userId)
    return gradesService.list({
      studentId,
      page: 1,
      limit: 100,
      sortOrder: 'desc',
    })
  },

  async list(filters: ListGradesQuery) {
    const where = {
      ...(filters.studentId ? { studentId: filters.studentId } : {}),
      ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
      ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      ...(filters.period ? { period: filters.period } : {}),
      ...(filters.periodLabel ? { periodLabel: filters.periodLabel } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        include: gradeInclude,
        orderBy: { [filters.sortBy ?? 'createdAt']: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.grade.count({ where }),
    ])

    return { items, total, page: filters.page, limit: filters.limit }
  },

  async getById(gradeId: string) {
    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: gradeInclude,
    })
    if (!grade) throw ApiError.notFound('Grade not found')
    return grade
  },

  /**
   * Upsert on the (studentId, subjectId, period, periodLabel) unique
   * constraint — re-submitting a grade for the same period corrects it
   * instead of duplicating.
   *
   * `teacherId` is a separate, required parameter rather than part of the
   * caller-supplied body — it comes from the authenticated user's Teacher
   * profile, not from client input.
   */
  async upsert(input: UpsertGradeBody & { teacherId: string }) {
    await assertRelatedExist({
      studentId: input.studentId,
      subjectId: input.subjectId,
      teacherId: input.teacherId,
    })

    const { studentId, subjectId, period, periodLabel, teacherId, ...rest } = input

    return prisma.grade.upsert({
      where: {
        studentId_subjectId_period_periodLabel: {
          studentId,
          subjectId,
          period,
          periodLabel,
        },
      },
      create: {
        studentId,
        subjectId,
        period,
        periodLabel,
        teacherId,
        ...rest,
      },
      update: {
        teacherId,
        ...rest,
      },
      include: gradeInclude,
    })
  },

  async remove(gradeId: string) {
    const existing = await prisma.grade.findUnique({
      where: { id: gradeId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Grade not found')

    await prisma.grade.delete({ where: { id: gradeId } })
  },
}