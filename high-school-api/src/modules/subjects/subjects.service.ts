import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const subjectsService = {
  async list() {
    return prisma.subject.findMany({ orderBy: { name: 'asc' } })
  },

  async getById(id: string) {
    const subject = await prisma.subject.findUnique({ where: { id } })
    if (!subject) throw ApiError.notFound('Subject not found')
    return subject
  },

  async create(input: { name: string; code: string; description?: string }) {
    const existing = await prisma.subject.findUnique({ where: { code: input.code } })
    if (existing) throw ApiError.conflict(`Subject code "${input.code}" already exists`)

    return prisma.subject.create({ data: input })
  },

  async update(id: string, input: Partial<{ name: string; code: string; description: string }>) {
    await subjectsService.getById(id) // 404s if missing

    if (input.code) {
      const existing = await prisma.subject.findUnique({ where: { code: input.code } })
      if (existing && existing.id !== id) {
        throw ApiError.conflict(`Subject code "${input.code}" already exists`)
      }
    }

    return prisma.subject.update({ where: { id }, data: input })
  },

  async remove(id: string) {
    await subjectsService.getById(id) // 404s if missing

    // Refuse to delete a subject that's still actively assigned to a
    // teacher — a hard delete otherwise either orphans teacherSubject
    // rows or fails on an FK constraint depending on your schema's
    // cascade settings. Add similar guards here for any other tables
    // that reference subjectId (e.g. schedules/lessons) if you have them.
    const assignedTeacherCount = await prisma.teacherSubject.count({ where: { subjectId: id } })
    if (assignedTeacherCount > 0) {
      throw ApiError.conflict(
        `Cannot delete subject: ${assignedTeacherCount} teacher(s) are still assigned to it`
      )
    }

    await prisma.subject.delete({ where: { id } })
  },
}