import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { hashPassword } from '@/utils/password'
import type { PaginationQuery } from '@/utils/pagination'
import { toSkipTake, buildPaginationMeta } from '@/utils/pagination'

const studentInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, isActive: true } },
  class: true,
}

export const studentsService = {
  async list(pagination: PaginationQuery, filters: { classId?: string; className?: string; search?: string; status?: string; gender?: string } = {}) {
    const search = filters.search?.trim()
    const where = {
      deletedAt: null,
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(filters.className ? { class: { name: filters.className } } : {}),
      ...(filters.gender ? { gender: filters.gender } : {}),
      ...(filters.status === 'active' ? { user: { isActive: true } } : {}),
      ...(filters.status === 'inactive' ? { user: { isActive: false } } : {}),
      ...(search ? {
        OR: [
          { studentCode: { contains: search, mode: 'insensitive' as const } },
          { user: { firstName: { contains: search, mode: 'insensitive' as const } } },
          { user: { lastName: { contains: search, mode: 'insensitive' as const } } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
        ],
      } : {}),
    }
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

  async enroll(input: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    studentCode: string
    dateOfBirth?: Date
    gender?: string
    className?: string
    class?: string
    studentId?: string
  }) {
    const role = await prisma.role.findUnique({ where: { name: 'student' } })
    if (!role) throw ApiError.badRequest('Student role is not configured')

    const studentCode = input.studentCode || input.studentId!
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } })
    if (existingUser) throw ApiError.conflict('A user with this email already exists')

    const existingStudent = await prisma.student.findUnique({ where: { studentCode } })
    if (existingStudent) {
      throw existingStudent.deletedAt
        ? ApiError.conflict('This student ID belongs to a soft-deleted student record; restore it instead of reusing it')
        : ApiError.conflict('A student with this student ID already exists')
    }

    const className = input.className || input.class
    const classRecord = className
      ? await prisma.class.findFirst({ where: { name: className, deletedAt: null } })
      : null
    if (className && !classRecord) throw ApiError.badRequest('Selected class does not exist')

    const passwordHash = await hashPassword(input.password)

    return prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          roleId: role.id,
        },
      })
      return tx.student.create({
        data: {
          userId: user.id,
          studentCode,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          classId: classRecord?.id,
        },
        include: studentInclude,
      })
    })
  },

  async update(id: string, input: Partial<{ studentCode: string; dateOfBirth: Date; gender: string; classId: string; class: string; firstName: string; lastName: string; phone: string; email: string; status: 'active' | 'inactive' }>) {
    const student = await studentsService.getById(id)

    const classId = input.classId ?? (input.class ? (await prisma.class.findFirst({ where: { name: input.class, deletedAt: null } }))?.id : undefined)
    if (input.class && !classId) throw ApiError.badRequest('Selected class does not exist')

    if (classId) {
      const cls = await prisma.class.findUnique({ where: { id: classId } })
      if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
    }

    const { class: _class, firstName, lastName, phone, email, status, ...studentData } = input
    const updated = await prisma.$transaction(async (tx: any) => {
      await tx.student.update({ where: { id }, data: { ...studentData, ...(classId ? { classId } : {}) } })
      if (firstName || lastName || phone !== undefined || email || status) {
        await tx.user.update({ where: { id: student.user.id }, data: {
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(phone !== undefined ? { phone } : {}),
          ...(email ? { email } : {}),
          ...(status ? { isActive: status === 'active' } : {}),
        } })
      }
      return tx.student.findUniqueOrThrow({ where: { id }, include: studentInclude })
    })
    return updated
  },

  /** Soft delete — preserves attendance/grade history, same convention as users/teachers. */
  async remove(id: string) {
    await studentsService.getById(id) // 404s if missing/already soft-deleted
    await prisma.student.update({ where: { id }, data: { deletedAt: new Date() } })
  },
}