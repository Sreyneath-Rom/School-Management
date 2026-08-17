import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

const lessonInclude = { subject: true }

export const lessonsService = {
  async list(filters: { subjectId?: string; teacherId?: string }) {
    return prisma.lesson.findMany({
      where: { subjectId: filters.subjectId, teacherId: filters.teacherId },
      include: lessonInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: lessonInclude })
    if (!lesson) throw ApiError.notFound('Lesson not found')
    return lesson
  },

  async create(input: {
    title: string
    description?: string
    subjectId: string
    teacherId: string
    fileUrl?: string
    fileType?: string
    fileSizeKb?: number
  }) {
    return prisma.lesson.create({ data: input, include: lessonInclude })
  },

  async update(
    lessonId: string,
    changes: Partial<{
      title: string
      description: string
      subjectId: string
      teacherId: string
      fileUrl: string
      fileType: string
      fileSizeKb: number
    }>
  ) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) throw ApiError.notFound('Lesson not found')

    return prisma.lesson.update({ where: { id: lessonId }, data: changes, include: lessonInclude })
  },

  async remove(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) throw ApiError.notFound('Lesson not found')

    await prisma.lesson.delete({ where: { id: lessonId } })
  },
}