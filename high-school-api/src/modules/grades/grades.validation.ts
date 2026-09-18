import { z } from 'zod'

const period = z.enum(['MONTHLY', 'SEMESTER', 'ANNUAL'])
type Period = z.infer<typeof period>

/**
 * NOTE — `teacherId` is intentionally absent.
 *
 * The previous version accepted `teacherId` from the request body, which
 * allowed any caller holding `grades.edit` to attribute a grade to another
 * teacher. The teacher is set from `req.user.sub` in the controller, resolved
 * to a Teacher row, and passed to the service as a separate parameter.
 */

export const upsertGradeSchema = z
  .object({
    studentId: z.string().cuid(),
    subjectId: z.string().cuid(),
    period,
    periodLabel: z.string().trim().min(1).max(64),
    score: z.number().min(0),
    maxScore: z.number().positive().max(1000).default(100),
    comment: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.score <= d.maxScore, {
    message: 'score cannot exceed maxScore',
    path: ['score'],
  })

/**
 * Query schema for the list endpoint. `period` is validated as an enum so a
 * typo like `?period=semester` (lowercase) returns a 400 instead of silently
 * matching nothing. The old code passed it to Prisma with an `as never` cast —
 * an unrecognized string became a filter against a value that doesn't exist,
 * returning an empty array indistinguishable from "student has no grades".
 */
export const listGradesQuerySchema = z.object({
  studentId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  teacherId: z.string().cuid().optional(),
  period: period.optional(),
  periodLabel: z.string().trim().min(1).max(64).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(['createdAt', 'score', 'periodLabel']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type UpsertGradeBody = z.infer<typeof upsertGradeSchema>
export type ListGradesQuery = z.infer<typeof listGradesQuerySchema>