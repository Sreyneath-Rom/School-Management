import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const homeworkService = {
  async list(filters: { subjectId?: string }) {
    return prisma.homework.findMany({
      where: { subjectId: filters.subjectId },
      include: { subject: true, _count: { select: { submissions: true } } },
      orderBy: { dueDate: 'asc' },
    })
  },

  async getById(homeworkId: string) {
    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { subject: true, submissions: true },
    })
    if (!homework) throw ApiError.notFound('Homework not found')
    return homework
  },

  async create(input: {
    title: string
    description?: string
    subjectId: string
    teacherId: string
    dueDate: Date
    maxScore: number
  }) {
    return prisma.homework.create({ data: input })
  },

  async update(
    homeworkId: string,
    changes: Partial<{
      title: string
      description: string
      subjectId: string
      teacherId: string
      dueDate: Date
      maxScore: number
    }>
  ) {
    const homework = await prisma.homework.findUnique({ where: { id: homeworkId } })
    if (!homework) throw ApiError.notFound('Homework not found')

    return prisma.homework.update({ where: { id: homeworkId }, data: changes })
  },

  async remove(homeworkId: string) {
    const homework = await prisma.homework.findUnique({ where: { id: homeworkId } })
    if (!homework) throw ApiError.notFound('Homework not found')

    await prisma.homework.delete({ where: { id: homeworkId } })
  },

  async submit(homeworkId: string, studentId: string, fileUrl: string | undefined) {
    const homework = await prisma.homework.findUnique({ where: { id: homeworkId } })
    if (!homework) throw ApiError.notFound('Homework not found')
    if (new Date() > homework.dueDate) throw ApiError.badRequest('Submission deadline has passed')

    return prisma.homeworkSubmission.upsert({
      where: { homeworkId_studentId: { homeworkId, studentId } },
      create: { homeworkId, studentId, fileUrl },
      update: { fileUrl, submittedAt: new Date() },
    })
  },

  async grade(submissionId: string, score: number, feedback: string | undefined) {
    return prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: { score, feedback, gradedAt: new Date() },
    })
  },
}