import { z } from 'zod'

const status = z.enum(['Active', 'Completed', 'Upcoming'])

const termFields = z.object({
  name: z.string().trim().min(1).max(120),
  academicYearId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  gradingDeadline: z.coerce.date(),
  status: status.default('Upcoming'),
  weightPercentage: z.number().int().min(1).max(100),
  description: z.string().trim().max(2000).optional(),
  /**
   * NOTE — `examCount` is deliberately absent.
   *
   * Like `totalClasses` / `enrolledStudents` on AcademicYear, this is a
   * derived quantity. It's whatever the count of `Exam` rows pointing at
   * this term is. Accepting it as client input lets a caller PATCH
   * `examCount: 0` on a term with exams and defeat the delete guard.
   *
   * The eventual fix is to drop the column and project `_count.exams` on
   * read; until then, it's read-only at the API boundary.
   */
})

/**
 * Validates the ordering invariants the current `validateDates` helper
 * doesn't check:
 *
 *   1. startDate < endDate              — the term's own duration
 *   2. startDate <= gradingDeadline     — you can't grade before the term starts
 *   3. gradingDeadline <= endDate       — grades close when the term ends
 *
 * Rule 3 is a judgment call. Some schools allow a short grace period after
 * the term ends for grade submission, in which case a grading deadline
 * *after* the term's endDate is correct — but not weeks after. If your
 * domain allows the grace period, change the check to
 * `gradingDeadline <= endDate + 14 days` or similar. As written, the
 * deadline must fall inside the term.
 */
export const createTermSchema = termFields
  .refine((d) => d.startDate < d.endDate, {
    message: 'startDate must be earlier than endDate',
    path: ['endDate'],
  })
  .refine((d) => d.gradingDeadline >= d.startDate, {
    message: 'gradingDeadline cannot be before startDate',
    path: ['gradingDeadline'],
  })
  .refine((d) => d.gradingDeadline <= d.endDate, {
    message: 'gradingDeadline cannot be after endDate',
    path: ['gradingDeadline'],
  })

/**
 * Update schema. The `.partial()` on the raw `termFields` object means the
 * defaults above do NOT fire — a PATCH that changes only `name` doesn't
 * reset `status` to `'Upcoming'`.
 *
 * The ordering invariants are checked in the service against the merged
 * (existing + changes) row, because the schema only sees the changes and
 * can't tell whether a `startDate` change conflicts with a stored
 * `endDate`.
 */
export const updateTermSchema = termFields
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export const listTermsQuerySchema = z.object({
  academicYearId: z.string().cuid().optional(),
  status: status.optional(),
})

export type CreateTermBody = z.infer<typeof createTermSchema>
export type UpdateTermBody = z.infer<typeof updateTermSchema>
export type ListTermsQuery = z.infer<typeof listTermsQuerySchema>