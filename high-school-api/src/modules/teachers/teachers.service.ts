import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { hashPassword } from '@/utils/password'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateTeacherBody,
  ListTeachersQuery,
  UpdateTeacherBody,
} from './teachers.validation'

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

const teacherListInclude = {
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
  _count: { select: { subjects: true, classesLed: true } },
} as const

const teacherDetailInclude = {
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
  subjects: {
    select: {
      subject: {
        select: { id: true, name: true, code: true, department: true },
      },
    },
  },
  classesLed: {
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      _count: { select: { students: true } },
    },
  },
} as const

async function assertSubjectsExist(subjectIds: string[]): Promise<void> {
  if (subjectIds.length === 0) return
  const validCount = await prisma.subject.count({
    where: { id: { in: subjectIds }, deletedAt: null },
  })
  if (validCount !== subjectIds.length) {
    throw ApiError.badRequest(
      'One or more subjectIds do not refer to existing subjects'
    )
  }
}

async function resolveSubjectIds(subjectNames: string[]): Promise<string[]> {
  if (subjectNames.length === 0) return []

  const subjects = await prisma.subject.findMany({
    where: {
      deletedAt: null,
      OR: subjectNames.map((name) => ({
        name: { equals: name, mode: 'insensitive' as const },
      })),
    },
    select: { id: true, name: true },
  })

  if (subjects.length !== subjectNames.length) {
    const found = new Set(subjects.map((s) => s.name.toLowerCase()))
    const missing = subjectNames.filter((n) => !found.has(n.toLowerCase()))
    throw ApiError.badRequest('Some subject names do not exist', { missing })
  }

  const byName = new Map(subjects.map((s) => [s.name.toLowerCase(), s.id]))
  return subjectNames.map((n) => byName.get(n.toLowerCase())!)
}

async function resolveSubjectIdsFromInput(input: {
  subjectIds?: string[]
  subjectsTaught?: string[]
}): Promise<string[] | undefined> {
  if (input.subjectIds !== undefined) return input.subjectIds
  if (input.subjectsTaught !== undefined) {
    return resolveSubjectIds(input.subjectsTaught)
  }
  return undefined
}

function generateTeacherCode(): string {
  const suffix = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
  return `TCH-${suffix}`
}

export const teachersService = {
  async list(query: ListTeachersQuery) {
    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(query.status === 'inactive' ? { user: { isActive: false } } : {}),
      ...(query.status === 'active' ? { user: { isActive: true } } : {}),
      ...(query.department
        ? { subjects: { some: { subject: { department: query.department } } } }
        : {}),
      ...(query.search
        ? {
            OR: [
              { teacherCode: { contains: query.search, mode: 'insensitive' } },
              {
                user: {
                  firstName: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                user: {
                  lastName: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                user: {
                  email: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'createdAt'
    const orderBy: Prisma.TeacherOrderByWithRelationInput[] =
      primarySort === 'firstName' || primarySort === 'lastName'
        ? [{ user: { [primarySort]: query.sortOrder } }, { id: 'asc' }]
        : [{ [primarySort]: query.sortOrder }, { id: 'asc' }]

    const [items, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: teacherListInclude,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.teacher.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async getById(id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      include: teacherDetailInclude,
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')
    return teacher
  },

  async getByUserId(userId: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId, deletedAt: null },
      include: teacherDetailInclude,
    })
    if (!teacher) throw ApiError.notFound('Teacher profile not found')
    return teacher
  },

  async create(input: CreateTeacherBody) {
    const subjectIds = await resolveSubjectIdsFromInput(input)
    const finalSubjectIds = subjectIds ?? []
    await assertSubjectsExist(finalSubjectIds)

    const teacherCode =
      input.teacherCode ?? input.employeeId ?? generateTeacherCode()

    const passwordHash = input.password
      ? await hashPassword(input.password)
      : null

    return runSerializable(async (tx) => {
      const codeCollision = await tx.teacher.findUnique({
        where: { teacherCode },
        select: { id: true },
      })
      if (codeCollision) {
        throw ApiError.conflict(
          `A teacher with code "${teacherCode}" already exists`
        )
      }

      let userId: string

      if (input.userId) {
        const user = await tx.user.findFirst({
          where: { id: input.userId, deletedAt: null },
          select: { id: true },
        })
        if (!user) {
          throw ApiError.badRequest('userId does not refer to an existing user')
        }
        userId = user.id
      } else {
        const existing = await tx.user.findUnique({
          where: { email: input.email! },
          select: { id: true },
        })
        if (existing) {
          throw ApiError.conflict('A user with this email already exists')
        }

        const role = await tx.role.findUnique({
          where: { name: 'teacher' },
          select: { id: true },
        })
        if (!role) {
          throw ApiError.internal('The "teacher" role is not configured')
        }

        const user = await tx.user.create({
          data: {
            email: input.email!,
            passwordHash: passwordHash!,
            firstName: input.firstName!,
            lastName: input.lastName!,
            phone: input.phone,
            roleId: role.id,
          },
        })
        userId = user.id
      }

      const existingTeacher = await tx.teacher.findUnique({
        where: { userId },
        select: { id: true, deletedAt: true },
      })
      if (existingTeacher) {
        throw existingTeacher.deletedAt
          ? ApiError.conflict(
              'This user has a soft-deleted teacher record. Restore it instead of creating a new one.'
            )
          : ApiError.conflict('This user is already linked to a teacher record')
      }

      return tx.teacher.create({
        data: {
          userId,
          teacherCode,
          subjects: {
            create: finalSubjectIds.map((subjectId) => ({ subjectId })),
          },
        },
        include: teacherDetailInclude,
      })
    })
  },

  async update(id: string, changes: UpdateTeacherBody) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true, teacherCode: true },
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')

    const subjectIds = await resolveSubjectIdsFromInput(changes)
    if (subjectIds) {
      await assertSubjectsExist(subjectIds)
    }

    const nextTeacherCode = changes.teacherCode ?? changes.employeeId

    if (
      nextTeacherCode !== undefined &&
      nextTeacherCode !== teacher.teacherCode
    ) {
      const collision = await prisma.teacher.findUnique({
        where: { teacherCode: nextTeacherCode },
        select: { id: true },
      })
      if (collision && collision.id !== id) {
        throw ApiError.conflict(
          `A teacher with code "${nextTeacherCode}" already exists`
        )
      }
    }

    const {
      teacherCode: _canonicalTeacherCode,
      employeeId: _deprecatedEmployeeId,
      subjectsTaught: _deprecatedSubjectsTaught,
      subjectIds: _deprecatedSubjectIds,
      firstName,
      lastName,
      email,
      phone,
      status,
    } = changes

    const isInactive =
      status !== undefined && status.toLowerCase().trim() === 'inactive'

    const userChanges: Prisma.UserUpdateInput = {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(status !== undefined ? { isActive: !isInactive } : {}),
    }

    const teacherChanges: Prisma.TeacherUpdateInput = {
      ...(nextTeacherCode !== undefined
        ? { teacherCode: nextTeacherCode }
        : {}),
    }

    return prisma.$transaction(async (tx) => {
      if (Object.keys(teacherChanges).length > 0) {
        await tx.teacher.update({ where: { id }, data: teacherChanges })
      }
      if (Object.keys(userChanges).length > 0) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: userChanges,
        })
      }
      if (subjectIds) {
        await tx.teacherSubject.deleteMany({ where: { teacherId: id } })
        if (subjectIds.length > 0) {
          await tx.teacherSubject.createMany({
            data: subjectIds.map((subjectId) => ({ teacherId: id, subjectId })),
          })
        }
      }
      return tx.teacher.findUniqueOrThrow({
        where: { id },
        include: teacherDetailInclude,
      })
    })
  },

  async remove(id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')

    const now = new Date()

    await prisma.$transaction([
      prisma.teacher.update({
        where: { id },
        data: { deletedAt: now },
      }),
      prisma.user.update({
        where: { id: teacher.userId },
        data: { deletedAt: now, isActive: false },
      }),
    ])
  },
}