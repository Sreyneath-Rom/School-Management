import { z } from 'zod'

export const createHomeworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  dueDate: z.coerce.date(),
  maxScore: z.number().positive().default(100),
})

export const updateHomeworkSchema = createHomeworkSchema.partial()

export const submitHomeworkSchema = z.object({
  studentId: z.string().cuid(),
  fileUrl: z.string().url().optional(),
})

export const gradeHomeworkSchema = z.object({
  score: z.number().min(0),
  feedback: z.string().optional(),
})
