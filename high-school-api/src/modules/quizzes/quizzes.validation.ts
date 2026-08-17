import { z } from 'zod'

const questionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2).optional(),
  correctAnswer: z.string().min(1),
  points: z.number().positive().default(1),
})

export const createQuizSchema = z.object({
  title: z.string().min(1),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  isAutoGrade: z.boolean().default(true),
  timeLimitMin: z.number().int().positive().optional(),
  questions: z.array(questionSchema).min(1),
})

export const submitQuizSchema = z.object({
  studentId: z.string().cuid(),
  answers: z.record(z.string()), // { questionId: answer }
})

// Deliberately excludes `questions` — editing individual questions (adding,
// removing, re-scoring) is a different, riskier operation than editing quiz
// metadata, especially once submissions exist. Add a dedicated endpoint for
// that if/when it's needed rather than overloading this one.
export const updateQuizSchema = z
  .object({
    title: z.string().min(1).optional(),
    subjectId: z.string().cuid().optional(),
    isAutoGrade: z.boolean().optional(),
    timeLimitMin: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })