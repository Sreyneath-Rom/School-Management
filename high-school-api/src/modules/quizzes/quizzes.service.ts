import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const quizzesService = {
  async list(filters: { subjectId?: string }) {
    return prisma.quiz.findMany({
      where: { subjectId: filters.subjectId },
      include: { subject: true, _count: { select: { questions: true, submissions: true } } },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(quizId: string) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
    if (!quiz) throw ApiError.notFound('Quiz not found')
    return quiz
  },

  async create(input: {
    title: string
    subjectId: string
    teacherId: string
    isAutoGrade: boolean
    timeLimitMin?: number
    questions: { questionText: string; options?: string[]; correctAnswer: string; points: number }[]
  }) {
    return prisma.quiz.create({
      data: {
        title: input.title,
        subjectId: input.subjectId,
        teacherId: input.teacherId,
        isAutoGrade: input.isAutoGrade,
        timeLimitMin: input.timeLimitMin,
        questions: {
          create: input.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options ?? [],
            correctAnswer: q.correctAnswer,
            points: q.points,
          })),
        },
      },
      include: { questions: true },
    })
  },

  /** Partial update of quiz metadata. Does not touch questions — see updateQuizSchema. */
  async update(
    quizId: string,
    changes: { title?: string; subjectId?: string; isAutoGrade?: boolean; timeLimitMin?: number }
  ) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) throw ApiError.notFound('Quiz not found')

    return prisma.quiz.update({
      where: { id: quizId },
      data: changes,
      include: { questions: true },
    })
  },

  /** Deletes a quiz. Refuses if students have already submitted answers. */
  async remove(quizId: string) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) throw ApiError.notFound('Quiz not found')

    const submissionCount = await prisma.quizSubmission.count({ where: { quizId } })
    if (submissionCount > 0) {
      throw ApiError.conflict(
        `Cannot delete quiz "${quiz.title}": ${submissionCount} submission(s) already exist for it`
      )
    }

    // Adjust the model name below if your schema names the questions
    // relation/table differently — the intent is just "clean up child rows
    // before deleting the quiz" (mirrors roles.service's rolePermission cleanup).
    await prisma.$transaction([
      prisma.quizQuestion.deleteMany({ where: { quizId } }),
      prisma.quiz.delete({ where: { id: quizId } }),
    ])
  },

  async submit(quizId: string, studentId: string, answers: Record<string, string>) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
    if (!quiz) throw ApiError.notFound('Quiz not found')

    let score: number | null = null
    if (quiz.isAutoGrade) {
      score = quiz.questions.reduce((sum: number, q: { id: string; correctAnswer: string; points: number }) => {
        const given = answers[q.id]
        return sum + (given && given.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? q.points : 0)
      }, 0)
    }

    return prisma.quizSubmission.upsert({
      where: { quizId_studentId: { quizId, studentId } },
      create: { quizId, studentId, answers, score: score ?? undefined },
      update: { answers, score: score ?? undefined, submittedAt: new Date() },
    })
  },
}