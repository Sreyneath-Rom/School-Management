import { z } from 'zod'

/**
 * NOTE — `teacherId` is absent from create.
 *
 * The previous version accepted it from the request body, letting any caller
 * with `quizzes.create` attribute a quiz to another teacher. Same bug class
 * as announcements `authorId`, grades `teacherId`, homework `teacherId`,
 * lessons `teacherId`. Now resolved from `req.user.sub`.
 */
const questionSchema = z.object({
  questionText: z.string().trim().min(1).max(2000),
  /**
   * Multiple-choice quizzes send `options` (2+ strings); free-response
   * quizzes omit it. Both are valid — the `correctAnswer` is compared as a
   * string either way.
   */
  options: z.array(z.string().trim().min(1).max(500)).min(2).max(20).optional(),
  correctAnswer: z.string().trim().min(1).max(500),
  points: z.number().positive().max(1000).default(1),
})

export const createQuizSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subjectId: z.string().cuid(),
  isAutoGrade: z.boolean().default(true),
  timeLimitMin: z.number().int().positive().max(300).optional(),
  questions: z.array(questionSchema).min(1).max(200),
})

/**
 * Metadata-only update. Deliberately excludes `questions` — editing a
 * question after students have submitted produces scores that were computed
 * against a different quiz. A dedicated endpoint (`POST /:id/questions` or
 * similar) should handle question changes with explicit invalidation of
 * existing submissions. Until that exists, the safe path is: delete the
 * quiz, create a new one.
 */
export const updateQuizSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    subjectId: z.string().cuid().optional(),
    isAutoGrade: z.boolean().optional(),
    timeLimitMin: z.number().int().positive().max(300).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Submit schema. `studentId` is absent — resolved from `req.user.sub`.
 *
 * `answers` is a map of `{ [questionId]: answerString }`. Keys are the
 * question ids the client received from `GET /quizzes/:id`. The service
 * iterates the quiz's own questions when scoring, so extra keys are ignored
 * and missing keys count as blank.
 */
export const submitQuizSchema = z.object({
  answers: z.record(z.string().cuid(), z.string().max(500)),
})

export const listQuizzesQuerySchema = z.object({
  subjectId: z.string().cuid().optional(),
  teacherId: z.string().cuid().optional(),
  search: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['title', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateQuizBody = z.infer<typeof createQuizSchema>
export type UpdateQuizBody = z.infer<typeof updateQuizSchema>
export type SubmitQuizBody = z.infer<typeof submitQuizSchema>
export type ListQuizzesQuery = z.infer<typeof listQuizzesQuerySchema>