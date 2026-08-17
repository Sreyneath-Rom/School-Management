import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type { PaginationQuery } from '@/utils/pagination'
import { toSkipTake, buildPaginationMeta } from '@/utils/pagination'

const studentInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, isActive: true } },
  class: true,
}

export const studentsService = {
  async list(pagination: PaginationQuery, classId?: string) {
    // Only add classId to the filter when it's actually provided — an
    // explicit `classId: undefined` is harmless with Prisma (it's treated
    // as "no filter"), but being explicit here avoids relying on that.
    const where = { deletedAt: null, ...(classId ? { classId } : {}) }
    const [items, total] = await Promise.all([
      prisma.student.findMany({ where, include: studentInclude, ...toSkipTake(pagination) }),
      prisma.student.count({ where }),
    ])
    return { items, meta: buildPaginationMeta(total, pagination) }
  },

  async getById(id: string) {
    const student = await prisma.student.findFirst({ where: { id, deletedAt: null }, include: studentInclude })
    if (!student) throw ApiError.notFound('Student not found')
    return student
  },

  /** Full profile: student + attendance summary + recent grades — what the "Student Profile" page needs. */
  async getProfile(id: string) {
    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: { ...studentInclude, parents: { include: { parent: { include: { user: true } } } } },
    })
    if (!student) throw ApiError.notFound('Student not found')

    const [attendanceCounts, recentGrades] = await Promise.all([
      prisma.attendance.groupBy({ by: ['status'], where: { studentId: student.id }, _count: true }),
      prisma.grade.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { subject: true },
      }),
    ])

    return { ...student, attendanceSummary: attendanceCounts, recentGrades }
  },

  async create(input: { userId: string; studentCode: string; dateOfBirth?: Date; gender?: string; classId?: string }) {
    const user = await prisma.user.findFirst({ where: { id: input.userId, deletedAt: null } })
    if (!user) throw ApiError.badRequest('userId does not refer to an existing user')

    // Assumes Student.userId is unique (one student record per user) —
    // adjust to findFirst if your schema doesn't enforce that constraint.
    const existingStudent = await prisma.student.findUnique({ where: { userId: input.userId } })
    if (existingStudent) {
      throw existingStudent.deletedAt
        ? ApiError.conflict('This user has a soft-deleted student record; restore it instead of creating a new one')
        : ApiError.conflict('This user is already linked to a student record')
    }

    if (input.classId) {
      const cls = await prisma.class.findUnique({ where: { id: input.classId } })
      if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
    }

    return prisma.student.create({ data: input, include: studentInclude })
  },

  async update(id: string, input: Partial<{ studentCode: string; dateOfBirth: Date; gender: string; classId: string }>) {
    await studentsService.getById(id) // 404s if missing/soft-deleted

    if (input.classId) {
      const cls = await prisma.class.findUnique({ where: { id: input.classId } })
      if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
    }

    return prisma.student.update({ where: { id }, data: input, include: studentInclude })
  },

  /** Soft delete — preserves attendance/grade history, same convention as users/teachers. */
  async remove(id: string) {
    await studentsService.getById(id) // 404s if missing/already soft-deleted
    await prisma.student.update({ where: { id }, data: { deletedAt: new Date() } })
  },
}