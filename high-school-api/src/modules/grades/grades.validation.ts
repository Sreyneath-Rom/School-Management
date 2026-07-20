import { z } from 'zod'

export const upsertGradeSchema = z.object({
  studentId: z.string().cuid(),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  period: z.enum(['MONTHLY', 'SEMESTER', 'ANNUAL']),
  periodLabel: z.string().min(1),
  score: z.number().min(0),
  maxScore: z.number().positive().default(100),
  comment: z.string().optional(),
})
