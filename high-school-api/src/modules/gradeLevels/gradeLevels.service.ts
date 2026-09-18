import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const gradeLevelsService = {
  async list(filters: { search?: string; status?: string } = {}) {
    const search = filters.search?.trim()
    return prisma.gradeLevel.findMany({
      where: {
        ...(filters.status && filters.status !== 'All' ? { status: filters.status } : {}),
        ...(search ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { alias: { contains: search, mode: 'insensitive' } },
            { headCoordinator: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: { levelOrder: 'asc' },
    })
  },

  async getById(id: string) {
    const level = await prisma.gradeLevel.findUnique({ where: { id } })
    if (!level) throw ApiError.notFound('Grade level not found')
    return level
  },

  async create(input: Record<string, unknown>) {
    const code = String(input.code)
    const name = String(input.name)
    const [existingCode, existingName] = await Promise.all([
      prisma.gradeLevel.findUnique({ where: { code } }),
      prisma.gradeLevel.findUnique({ where: { name } }),
    ])
    if (existingCode) throw ApiError.conflict(`Grade level code "${code}" already exists`)
    if (existingName) throw ApiError.conflict(`Grade level "${name}" already exists`)
    return prisma.gradeLevel.create({ data: input as never })
  },

  async update(id: string, input: Record<string, unknown>) {
    await gradeLevelsService.getById(id)
    if (input.code) {
      const existing = await prisma.gradeLevel.findUnique({ where: { code: String(input.code) } })
      if (existing && existing.id !== id) throw ApiError.conflict(`Grade level code "${input.code}" already exists`)
    }
    if (input.name) {
      const existing = await prisma.gradeLevel.findUnique({ where: { name: String(input.name) } })
      if (existing && existing.id !== id) throw ApiError.conflict(`Grade level "${input.name}" already exists`)
    }
    return prisma.gradeLevel.update({ where: { id }, data: input as never })
  },

  async remove(id: string) {
    const level = await gradeLevelsService.getById(id)
    if (level.totalClasses > 0 || level.enrolledStudents > 0) {
      throw ApiError.conflict('Cannot delete a grade level containing classes or enrolled students')
    }
    await prisma.gradeLevel.delete({ where: { id } })
  },
}
