import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateQuizBody,
  ListQuizzesQuery,
  SubmitQuizBody,
  UpdateQuizBody,
} from './quizzes.validation'

/**
 * Role-aware projection of a quiz question.
 *
 * Students MUST NOT see `correctAnswer` — with it, the quiz is trivially
 * defeatable by reading the GET response. The projection is defined here as
 * a named constant rather than inlined in each query, so a future addition
 * to a query can't accidentally use the teacher projection for a student
 * read.
 */
const STUDENT_QUESTION_SELECT = {
  id: true,
  questionText: true,
  options: true,
  points: true,
  // correctAnswer intentionally omitted
} as const

const TEACHER_QUESTION_SELECT = {
  ...STUDENT_QUESTION_SELECT,
  correctAnswer: true,
} as const

/**
 * Who counts as staff for the purpose of seeing answer keys. Kept as a small
 * predicate so the rule lives in one place — if a "reviewer" role is added
 * later that should also see answers, this is the only line to change.
 */
function isStaff(roleName: string): boolean {
  return roleName === 'admin' || roleName === 'teacher'
}

/**
 * Resolves the Teacher row for an authenticated user. Used by the controller
 * to derive `teacherId` from `req.user.sub` — never from client input.
 */
export async function teacherIdForUser(userId: string): Promise<string> {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!teacher) {
    throw ApiError.forbidden('Only teachers can create or edit quizzes')
  }
  return teacher.id
}

/**
 * Resolves the Student row for an authenticated user. Used by the controller
 * to derive `studentId` from `req.user.sub`.
 */
export async function studentIdForUser(userId: string): Promise<string> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!student) {
    throw ApiError.forbidden('Only students can submit quizzes')
  }
  return student.id
}

/**
 * Normalizes a submission answer for comparison. Case-insensitive and
 * whitespace-trimmed so "Paris", "paris", and " Paris " all match "Paris".
 *
 * This is deliberately permissive for free-response. For multiple-choice
 * where `options` are exact strings the client rendered, it's forgiving of
 * accidental casing on the wire. If a quiz needs exact-match semantics, it
 * should carry a `matchMode` field — not shoehorned into this helper.
 */
function normalizeAnswer(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

export const quizzesService = {
  async list(filters: ListQuizzesQuery, viewerRoleName: string) {
    const where = {
      ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
      ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      ...(filters.search
        ? { title: { contains: filters.search, mode: 'insensitive' as const } }
        : {}),
    }

    const [items, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        select: {
          id: true,
          title: true,
          subjectId: true,
          teacherId: true,
          isAutoGrade: true,
          timeLimitMin: true,
          createdAt: true,
          subject: { select: { id: true, name: true, code: true } },
          _count: { select: { questions: true, submissions: true } },
        },
        orderBy: { [filters.sortBy ?? 'createdAt']: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.quiz.count({ where }),
    ])

    // The list projection intentionally does NOT include questions — the
    // answer-key question doesn't arise here. A client that wants questions
    // calls GET /:id, which is role-aware below.
    void viewerRoleName
    return { items, total, page: filters.page, limit: filters.limit }
  },

  /**
   * Returns the quiz with a role-aware question projection.
   *
   *   - Staff (admin, teacher): questions include `correctAnswer`.
   *   - Students: questions OMIT `correctAnswer`.
   *
   * This is the fix for the previously documented "strip correctAnswer
   * before shipping to production" — the projection happens at the query
   * layer now, so there's no path where the answer leaves the process for a
   * student caller.
   */
  async getById(quizId: string, viewerRoleName: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        subjectId: true,
        teacherId: true,
        isAutoGrade: true,
        timeLimitMin: true,
        createdAt: true,
        subject: { select: { id: true, name: true, code: true } },
        questions: {
          select: isStaff(viewerRoleName)
            ? TEACHER_QUESTION_SELECT
            : STUDENT_QUESTION_SELECT,
        },
      },
    })

    if (!quiz) throw ApiError.notFound('Quiz not found')
    return quiz
  },

  /**
   * `teacherId` is a separate, required parameter — resolved from the
   * authenticated user by the controller.
   */
  async create(input: CreateQuizBody & { teacherId: string }) {
    const subject = await prisma.subject.findUnique({
      where: { id: input.subjectId },
      select: { id: true },
    })
    if (!subject) {
      throw ApiError.badRequest('subjectId does not refer to an existing subject')
    }

    const { teacherId, questions, ...meta } = input

    return prisma.quiz.create({
      data: {
        ...meta,
        teacherId,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options ?? [],
            correctAnswer: q.correctAnswer,
            points: q.points,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        subjectId: true,
        teacherId: true,
        isAutoGrade: true,
        timeLimitMin: true,
        createdAt: true,
        questions: { select: TEACHER_QUESTION_SELECT },
      },
    })
  },

  /**
   * Ownership check: a teacher may only edit their own quizzes. Admins may
   * edit any (pass `isAdmin: true`).
   *
   * If `subjectId` is being changed, it's validated against a real Subject
   * first, so a typo'd id gives a 400 rather than a P2003 at write time.
   */
  async update(
    quizId: string,
    changes: UpdateQuizBody,
    actor: { teacherId: string; isAdmin: boolean }
  ) {
    const existing = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, teacherId: true },
    })
    if (!existing) throw ApiError.notFound('Quiz not found')

    if (!actor.isAdmin && existing.teacherId !== actor.teacherId) {
      throw ApiError.forbidden('You can only edit your own quizzes')
    }

    if (changes.subjectId !== undefined) {
      const subject = await prisma.subject.findUnique({
        where: { id: changes.subjectId },
        select: { id: true },
      })
      if (!subject) {
        throw ApiError.badRequest(
          'subjectId does not refer to an existing subject'
        )
      }
    }

    return prisma.quiz.update({
      where: { id: quizId },
      data: changes,
      select: {
        id: true,
        title: true,
        subjectId: true,
        teacherId: true,
        isAutoGrade: true,
        timeLimitMin: true,
        questions: { select: TEACHER_QUESTION_SELECT },
      },
    })
  },

  async remove(
    quizId: string,
    actor: { teacherId: string; isAdmin: boolean }
  ) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, title: true, teacherId: true },
    })
    if (!quiz) throw ApiError.notFound('Quiz not found')

    if (!actor.isAdmin && quiz.teacherId !== actor.teacherId) {
      throw ApiError.forbidden('You can only delete your own quizzes')
    }

    const submissionCount = await prisma.quizSubmission.count({
      where: { quizId },
    })
    if (submissionCount > 0) {
      throw ApiError.conflict(
        `Cannot delete quiz "${quiz.title}": ${submissionCount} submission(s) already exist for it`
      )
    }

    // Explicit child cleanup, independent of the FK's onDelete setting. See
    // the same pattern in languages.service.ts.
    await prisma.$transaction([
      prisma.quizQuestion.deleteMany({ where: { quizId } }),
      prisma.quiz.delete({ where: { id: quizId } }),
    ])
  },

  /**
   * Submits answers for a quiz.
   *
   * `studentId` is a separate parameter resolved from the authenticated user
   * — the previous version accepted it from the request body, which let any
   * student submit as a classmate.
   *
   * One-shot: a second submission for the same (quizId, studentId) is
   * refused with 409. The previous version used `upsert`, so a student could
   * resubmit until the auto-grader produced the score they wanted. If the
   * school wants to allow resubmission, that's a policy decision that should
   * be modeled explicitly (`Quiz.allowResubmission` + a `QuizSubmission.attempt`
   * counter), not by accident.
   */
  async submit(quizId: string, studentId: string, input: SubmitQuizBody) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        isAutoGrade: true,
        questions: {
          select: { id: true, correctAnswer: true, points: true },
        },
      },
    })
    if (!quiz) throw ApiError.notFound('Quiz not found')

    const existing = await prisma.quizSubmission.findUnique({
      where: { quizId_studentId: { quizId, studentId } },
      select: { id: true, submittedAt: true },
    })
    if (existing) {
      throw ApiError.conflict('You have already submitted this quiz')
    }

    // Auto-grade only when the quiz is marked for it. Otherwise the score
    // stays null and a teacher grades it manually.
    const score = quiz.isAutoGrade
      ? quiz.questions.reduce((sum, q) => {
          const given = normalizeAnswer(input.answers[q.id])
          const expected = normalizeAnswer(q.correctAnswer)
          return sum + (given && given === expected ? q.points : 0)
        }, 0)
      : null

    return prisma.quizSubmission.create({
      data: {
        quizId,
        studentId,
        answers: input.answers,
        score,
        submittedAt: new Date(),
      },
      select: {
        id: true,
        quizId: true,
        studentId: true,
        score: true,
        submittedAt: true,
      },
    })
  },
}