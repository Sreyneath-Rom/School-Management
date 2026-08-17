import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

const classInclude = {
  homeroomTeacher: { include: { user: { select: { firstName: true, lastName: true } } } },
}

export const classesService = {
  async list(filters: { gradeLevel?: number }) {
    return prisma.class.findMany({
      where: { deletedAt: null, gradeLevel: filters.gradeLevel },
      include: classInclude,
      orderBy: { name: 'asc' },
    })
  },

  async getById(classId: string) {
    const cls = await prisma.class.findFirst({ where: { id: classId, deletedAt: null }, include: classInclude })
    if (!cls) throw ApiError.notFound('Class not found')
    return cls
  },

  async create(input: { name: string; gradeLevel: number; homeroomTeacherId?: string }) {
    return prisma.class.create({ data: input, include: classInclude })
  },

  async update(
    classId: string,
    changes: Partial<{ name: string; gradeLevel: number; homeroomTeacherId: string }>
  ) {
    const cls = await prisma.class.findFirst({ where: { id: classId, deletedAt: null } })
    if (!cls) throw ApiError.notFound('Class not found')

    return prisma.class.update({ where: { id: classId }, data: changes, include: classInclude })
  },

  // Soft delete — sets deletedAt instead of removing the row, since historical
  // records (attendance, grades, homework, etc.) reference classId and would
  // otherwise be orphaned or need cascading deletes.
  async remove(classId: string) {
    const cls = await prisma.class.findFirst({ where: { id: classId, deletedAt: null } })
    if (!cls) throw ApiError.notFound('Class not found')

    await prisma.class.update({ where: { id: classId }, data: { deletedAt: new Date() } })
  },
}