import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { hashPassword } from '@/utils/password'

const teacherInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true } },
  subjects: { include: { subject: true } },
  classesLed: true,
}

// Same reasoning as the permissionIds/roleId checks in roles.service and
// users.service: without this, an invalid subjectId reaches Prisma as a
// raw FK constraint violation instead of a clean 400.
async function assertSubjectsExist(subjectIds: string[]) {
  if (subjectIds.length === 0) return
  const validCount = await prisma.subject.count({ where: { id: { in: subjectIds } } })
  if (validCount !== subjectIds.length) {
    throw ApiError.badRequest('One or more subjectIds are invalid')
  }
}

export const teachersService = {
  async list(filters: { search?: string; department?: string; status?: string } = {}) {
    const search = filters.search?.trim()
    return prisma.teacher.findMany({
      where: {
        deletedAt: null,
        ...(filters.status === 'Inactive' ? { user: { isActive: false } } : {}),
        ...(filters.status && filters.status !== 'Inactive' ? { user: { isActive: true } } : {}),
        ...(filters.department ? { subjects: { some: { subject: { department: filters.department } } } } : {}),
        ...(search ? {
          OR: [
            { teacherCode: { contains: search, mode: 'insensitive' as const } },
            { user: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { user: { lastName: { contains: search, mode: 'insensitive' as const } } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
          ],
        } : {}),
      },
      include: teacherInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    const teacher = await prisma.teacher.findFirst({ where: { id, deletedAt: null }, include: teacherInclude })
    if (!teacher) throw ApiError.notFound('Teacher not found')
    return teacher
  },

  async create(input: { userId?: string; teacherCode?: string; subjectIds: string[]; employeeId?: string; firstName?: string; lastName?: string; email?: string; password: string; phone?: string; subjectsTaught?: string[] }) {
    let userId = input.userId
    if (!userId) {
      const role = await prisma.role.findUnique({ where: { name: 'teacher' } })
      if (!role || !input.email || !input.firstName || !input.lastName) throw ApiError.badRequest('Teacher identity is incomplete')
      const existing = await prisma.user.findUnique({ where: { email: input.email } })
      if (existing) throw ApiError.conflict('A user with this email already exists')
      const user = await prisma.user.create({
        data: { email: input.email, passwordHash: await hashPassword(input.password), firstName: input.firstName, lastName: input.lastName, phone: input.phone, roleId: role.id },
      })
      userId = user.id
    }

    const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } })
    if (!user) throw ApiError.badRequest('userId does not refer to an existing user')

    // Assumes Teacher.userId is unique (one teacher record per user) —
    // adjust if your schema allows a different relationship shape.
    const existingTeacher = await prisma.teacher.findUnique({ where: { userId } })
    if (existingTeacher) {
      throw existingTeacher.deletedAt
        ? ApiError.conflict('This user has a soft-deleted teacher record; restore it instead of creating a new one')
        : ApiError.conflict('This user is already linked to a teacher record')
    }

    const subjectIds: string[] = input.subjectIds.length > 0 ? input.subjectIds : await resolveSubjectIds(input.subjectsTaught)
    await assertSubjectsExist(subjectIds)

    return prisma.teacher.create({
      data: {
        userId,
        teacherCode: input.teacherCode || input.employeeId || `TCH-${Date.now()}`,
        subjects: { create: subjectIds.map((subjectId) => ({ subjectId })) },
      },
      include: teacherInclude,
    })
  },

  async update(id: string, input: Partial<{
    teacherCode: string
    employeeId: string
    subjectIds: string[]
    subjectsTaught: string[]
    firstName: string
    lastName: string
    email: string
    phone: string
    status: 'Active' | 'On Leave' | 'Inactive' | 'active' | 'inactive'
  }>) {
    const teacher = await teachersService.getById(id) // 404s if missing/soft-deleted

    const subjectIds: string[] | undefined = input.subjectIds ?? (input.subjectsTaught ? await resolveSubjectIds(input.subjectsTaught) : undefined)
    if (subjectIds) {
      if (input.subjectsTaught && subjectIds.length !== input.subjectsTaught.length) {
        throw ApiError.badRequest('One or more subjectsTaught values do not exist')
      }
      await assertSubjectsExist(subjectIds)
    }

    const { employeeId, subjectsTaught: _subjectsTaught, subjectIds: _subjectIds, firstName, lastName, email, phone, status, ...rest } = input
    const userChanges = {
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(email ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(status ? { isActive: status.toLowerCase() !== 'inactive' } : {}),
    }

    // Wrapped in a transaction so a bad subjectId (or any failure mid-way)
    // can't leave the teacher with its old subject links deleted and no
    // new ones in place.
    return prisma.$transaction(async (tx: any) => {
      if (subjectIds) {
        await tx.teacherSubject.deleteMany({ where: { teacherId: id } })
        if (subjectIds.length > 0) {
          await tx.teacherSubject.createMany({
            data: subjectIds.map((subjectId) => ({ teacherId: id, subjectId })),
          })
        }
      }
      const teacherChanges = { ...rest, ...(employeeId ? { teacherCode: employeeId } : {}) }
      if (Object.keys(teacherChanges).length > 0) {
        await tx.teacher.update({ where: { id }, data: teacherChanges })
      }
      if (Object.keys(userChanges).length > 0) {
        await tx.user.update({ where: { id: teacher.user.id }, data: userChanges })
      }
      return tx.teacher.findUniqueOrThrow({ where: { id }, include: teacherInclude })
    })
  },

  /** Soft delete — mirrors users.service; preserves history (classes led, grades, etc). */
  async remove(id: string) {
    await teachersService.getById(id) // 404s if missing/already soft-deleted
    await prisma.teacher.update({ where: { id }, data: { deletedAt: new Date() } })
  },
}

async function resolveSubjectIds(subjectNames?: string[]) {
  if (!subjectNames?.length) return []
  const subjects = await prisma.subject.findMany({ where: { OR: subjectNames.map((name) => ({ name })) }, select: { id: true } })
  return subjects.map((subject: { id: string }) => subject.id)
}