import { z } from 'zod'

/**
 * NOTE — neither `teacherId` (create/update) nor `studentId` (submit) is in
 * these schemas. Both come from `req.user.sub`:
 *   - `teacherId` — the authenticated user's Teacher row
 *   - `studentId` — the authenticated user's Student row
 *
 * The previous versions accepted both from the request body, which allowed
 * any caller with `homework.create` to attribute homework to another teacher,
 * and any student to submit homework as a classmate.
 */

export const createHomeworkSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  subjectId: z.string().cuid(),
  classId: z.string().cuid().optional(),
  dueDate: z.coerce.date(),
  maxScore: z.number().int().positive().max(1000).default(100),
  allowLateSubmissions: z.boolean().default(false),
})

export const updateHomeworkSchema = createHomeworkSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export const submitHomeworkSchema = z
  .object({
    content: z.string().trim().max(20_000).optional(),
    fileUrl: z.string().url().max(1000).optional(),
  })
  .refine((d) => d.content || d.fileUrl, {
    message: 'A submission must include either `content` or `fileUrl`',
  })

export const gradeHomeworkSchema = z.object({
  score: z.number().min(0),
  feedback: z.string().trim().max(5000).optional(),
})

export const listHomeworkQuerySchema = z.object({
  subjectId: z.string().cuid().optional(),
  classId: z.string().cuid().optional(),
  teacherId: z.string().cuid().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['dueDate', 'createdAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type CreateHomeworkBody = z.infer<typeof createHomeworkSchema>
export type UpdateHomeworkBody = z.infer<typeof updateHomeworkSchema>
export type SubmitHomeworkBody = z.infer<typeof submitHomeworkSchema>
export type GradeHomeworkBody = z.infer<typeof gradeHomeworkSchema>
export type ListHomeworkQuery = z.infer<typeof listHomeworkQuerySchema>