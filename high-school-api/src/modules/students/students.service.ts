import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { hashPassword } from '@/utils/password'
import { toSkipTake, buildPaginationMeta } from '@/utils/pagination'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateStudentBody,
  EnrollStudentBody,
  ListStudentsQuery,
  UpdateStudentBody,
} from './students.validation'

type Tx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const RETRY_LIMIT = 3
const RETRY_BASE_MS = 25

async function runSerializable<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < RETRY_LIMIT; attempt++) {
    try {
      return await prisma.$transaction(fn, { isolationLevel: 'Serializable' })
    } catch (err) {
      if ((err as { code?: string } | null)?.code !== 'P2034') throw err
      lastError = err
      await new Promise((r) => setTimeout(r, RETRY_BASE_MS * 2 ** attempt))
    }
  }
  throw lastError
}

const studentInclude = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      phone: true,
      isActive: true,
    },
  },
  class: { select: { id: true, name: true, gradeLevel: true } },
} as const

async function resolveClassId(input: {
  classId?: string
  className?: string
}): Promise<string | undefined> {
  if (input.classId) {
    const cls = await prisma.class.findFirst({
      where: { id: input.classId, deletedAt: null },
      select: { id: true },
    })
    if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
    return cls.id
  }

  if (input.className) {
    const cls = await prisma.class.findFirst({
      where: { name: input.className, deletedAt: null },
      select: { id: true },
    })
    if (!cls) throw ApiError.badRequest(`No class named "${input.className}" exists`)
    return cls.id
  }

  return undefined
}

export const studentsService = {
  async list(query: ListStudentsQuery) {
    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(query.classId ? { classId: query.classId } : {}),
      ...(query.className ? { class: { name: query.className } } : {}),
      ...(query.gender ? { gender: query.gender } : {}),
      ...(query.status ? { user: { isActive: query.status === 'active' } } : {}),
      ...(query.search
        ? {
            OR: [
              { studentCode: { contains: query.search, mode: 'insensitive' } },
              { user: { firstName: { contains: query.search, mode: 'insensitive' } } },
              { user: { lastName: { contains: query.search, mode: 'insensitive' } } },
              { user: { email: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'createdAt'
    const orderBy: Prisma.StudentOrderByWithRelationInput[] =
      primarySort === 'firstName' || primarySort === 'lastName'
        ? [{ user: { [primarySort]: query.sortOrder } }, { id: 'asc' }]
        : [{ [primarySort]: query.sortOrder }, { id: 'asc' }]

    const [items, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: studentInclude,
        orderBy,
        ...toSkipTake(query),
      }),
      prisma.student.count({ where }),
    ])

    return { items, meta: buildPaginationMeta(total, query) }
  },

  async getById(id: string) {
    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: studentInclude,
    })
    if (!student) throw ApiError.notFound('Student not found')
    return student
  },

  async getProfile(id: string) {
    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...studentInclude,
        parents: {
          include: {
            parent: {
              select: {
                id: true,
                user: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
            },
          },
        },
      },
    })
    if (!student) throw ApiError.notFound('Student not found')

    const [attendanceCounts, recentGrades] = await Promise.all([
      prisma.attendance.groupBy({
        by: ['status'],
        where: { studentId: student.id },
        _count: { _all: true },
      }),
      prisma.grade.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { subject: { select: { id: true, name: true, code: true } } },
      }),
    ])

    const counts: Record<string, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    }
    for (const row of attendanceCounts) counts[row.status] = row._count._all

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
    const attendanceRate =
      total > 0
        ? Number((((counts.PRESENT + counts.LATE) / total) * 100).toFixed(1))
        : 0

    return {
      ...student,
      attendanceSummary: {
        total,
        present: counts.PRESENT,
        absent: counts.ABSENT,
        late: counts.LATE,
        excused: counts.EXCUSED,
        attendanceRate,
      },
      recentGrades,
    }
  },

  async create(input: CreateStudentBody) {
    const user = await prisma.user.findFirst({
      where: { id: input.userId, deletedAt: null },
      select: { id: true },
    })
    if (!user) throw ApiError.badRequest('userId does not refer to an existing user')

    const existing = await prisma.student.findUnique({
      where: { userId: input.userId },
      select: { id: true, deletedAt: true },
    })
    if (existing) {
      throw existing.deletedAt
        ? ApiError.conflict(
            'This user has a soft-deleted student record. Restore it instead of creating a new one.'
          )
        : ApiError.conflict('This user is already linked to a student record')
    }

    const classId = await resolveClassId({ classId: input.classId })

    return prisma.student.create({
      data: {
        userId: input.userId,
        studentCode: input.studentCode,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        classId,
      },
      include: studentInclude,
    })
  },

  async enroll(input: EnrollStudentBody) {
    const role = await prisma.role.findUnique({
      where: { name: 'student' },
      select: { id: true },
    })
    if (!role) {
      throw ApiError.internal('The "student" role is not configured')
    }

    const classId = await resolveClassId({
      classId: input.classId,
      className: input.className,
    })

    const passwordHash = await hashPassword(input.password)

    return runSerializable(async (tx) => {
      const [existingUser, existingStudent] = await Promise.all([
        tx.user.findUnique({
          where: { email: input.email },
          select: { id: true },
        }),
        tx.student.findUnique({
          where: { studentCode: input.studentCode },
          select: { id: true, deletedAt: true },
        }),
      ])

      if (existingUser) {
        throw ApiError.conflict('A user with this email already exists')
      }
      if (existingStudent) {
        throw existingStudent.deletedAt
          ? ApiError.conflict(
              'This student ID belongs to a soft-deleted record. Restore it instead of reusing it.'
            )
          : ApiError.conflict('A student with this student ID already exists')
      }

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
          studentCode: input.studentCode,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          classId,
        },
        include: studentInclude,
      })
    })
  },

  async update(id: string, changes: UpdateStudentBody) {
    const current = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    })
    if (!current) throw ApiError.notFound('Student not found')

    const classId = await resolveClassId({
      classId: changes.classId,
      className: changes.className,
    })

    const studentData: Prisma.StudentUpdateInput = {
      ...(changes.studentCode !== undefined ? { studentCode: changes.studentCode } : {}),
      ...(changes.dateOfBirth !== undefined ? { dateOfBirth: changes.dateOfBirth } : {}),
      ...(changes.gender !== undefined ? { gender: changes.gender } : {}),
      ...(classId !== undefined ? { class: { connect: { id: classId } } } : {}),
    }

    const userData: Prisma.UserUpdateInput = {
      ...(changes.firstName !== undefined ? { firstName: changes.firstName } : {}),
      ...(changes.lastName !== undefined ? { lastName: changes.lastName } : {}),
      ...(changes.phone !== undefined ? { phone: changes.phone } : {}),
      ...(changes.email !== undefined ? { email: changes.email } : {}),
      ...(changes.status !== undefined
        ? { isActive: changes.status === 'active' }
        : {}),
    }

    return prisma.$transaction(async (tx) => {
      if (Object.keys(studentData).length > 0) {
        await tx.student.update({ where: { id }, data: studentData })
      }
      if (Object.keys(userData).length > 0) {
        await tx.user.update({ where: { id: current.userId }, data: userData })
      }
      return tx.student.findUniqueOrThrow({ where: { id }, include: studentInclude })
    })
  },

  async remove(id: string) {
    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    })
    if (!student) throw ApiError.notFound('Student not found')

    const now = new Date()

    await prisma.$transaction([
      prisma.student.update({
        where: { id },
        data: { deletedAt: now },
      }),
      prisma.user.update({
        where: { id: student.userId },
        data: { deletedAt: now, isActive: false },
      }),
    ])
  },
}