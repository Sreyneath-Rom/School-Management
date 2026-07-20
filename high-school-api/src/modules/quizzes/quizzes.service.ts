import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const quizzesService = {
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
