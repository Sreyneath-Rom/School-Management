import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

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
  async list() {
    return prisma.teacher.findMany({ where: { deletedAt: null }, include: teacherInclude })
  },

  async getById(id: string) {
    const teacher = await prisma.teacher.findFirst({ where: { id, deletedAt: null }, include: teacherInclude })
    if (!teacher) throw ApiError.notFound('Teacher not found')
    return teacher
  },

  async create(input: { userId: string; teacherCode: string; subjectIds: string[] }) {
    const user = await prisma.user.findFirst({ where: { id: input.userId, deletedAt: null } })
    if (!user) throw ApiError.badRequest('userId does not refer to an existing user')

    // Assumes Teacher.userId is unique (one teacher record per user) —
    // adjust if your schema allows a different relationship shape.
    const existingTeacher = await prisma.teacher.findUnique({ where: { userId: input.userId } })
    if (existingTeacher) {
      throw existingTeacher.deletedAt
        ? ApiError.conflict('This user has a soft-deleted teacher record; restore it instead of creating a new one')
        : ApiError.conflict('This user is already linked to a teacher record')
    }

    await assertSubjectsExist(input.subjectIds)

    return prisma.teacher.create({
      data: {
        userId: input.userId,
        teacherCode: input.teacherCode,
        subjects: { create: input.subjectIds.map((subjectId) => ({ subjectId })) },
      },
      include: teacherInclude,
    })
  },

  async update(id: string, input: Partial<{ teacherCode: string; subjectIds: string[] }>) {
    await teachersService.getById(id) // 404s if missing/soft-deleted

    const { subjectIds, ...rest } = input
    if (subjectIds) {
      await assertSubjectsExist(subjectIds)
    }

    // Wrapped in a transaction so a bad subjectId (or any failure mid-way)
    // can't leave the teacher with its old subject links deleted and no
    // new ones in place.
    return prisma.$transaction(async (tx) => {
      if (subjectIds) {
        await tx.teacherSubject.deleteMany({ where: { teacherId: id } })
        if (subjectIds.length > 0) {
          await tx.teacherSubject.createMany({
            data: subjectIds.map((subjectId) => ({ teacherId: id, subjectId })),
          })
        }
      }
      if (Object.keys(rest).length > 0) {
        await tx.teacher.update({ where: { id }, data: rest })
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