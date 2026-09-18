import { z } from 'zod'

/**
 * Normalizes any accepted date input to UTC midnight. Same rule as attendance
 * and dashboard — a "date" means the calendar day in UTC, not a moment in
 * time. Without this, a leave request for `2026-09-18T08:30Z` and one for
 * `2026-09-18` would be different dates.
 */
const dateOnly = z.coerce.date().transform((d) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
)

const status = z.enum(['PENDING', 'APPROVED', 'REJECTED'])
const reviewStatus = z.enum(['APPROVED', 'REJECTED'])

/**
 * Create schema does NOT accept `studentId`.
 *
 * The caller's identity determines whose request this is:
 *   - A student files their own (id resolved from `req.user.sub`).
 *   - A teacher/parent files on behalf of a student and supplies
 *     `studentId` in `createLeaveRequestForStudentSchema` below.
 *
 * Two separate schemas make the trust boundary explicit — the route doesn't
 * have to guess which path a caller is on, and Zod can't accidentally let
 * a student smuggle in a different `studentId`.
 */
export const createLeaveRequestSchema = z
  .object({
    startDate: dateOnly,
    endDate: dateOnly,
    reason: z.string().trim().min(1).max(1000),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  })

/**
 * Same shape plus a required `studentId`. Used when a staff member or parent
 * files on behalf of a student.
 *
 * NOTE — parent-child relationship is not verified here. The schema assumes
 * the current `Student` model has no parent link, which matches the seed
 * data. If a `Parent` relation exists, add an ownership check in the
 * controller: `student.guardianId === req.user.sub`. Without that check, a
 * parent could file leave requests for any student.
 */
export const createLeaveRequestForStudentSchema = createLeaveRequestSchema
  .innerType()
  .extend({
    studentId: z.string().cuid(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  })

/**
 * Update schema. Only the fields a student can revise on their own pending
 * request. `status` and `studentId` are intentionally absent — status changes
 * go through `/review`, and reassigning a request to a different student is
 * not a meaningful operation.
 *
 * The date-order refinement is re-applied in the service against the existing
 * row, because a PATCH that changes only `startDate` needs to be checked
 * against the stored `endDate`.
 */
export const updateLeaveRequestSchema = z
  .object({
    startDate: dateOnly.optional(),
    endDate: dateOnly.optional(),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export const reviewLeaveRequestSchema = z.object({
  status: reviewStatus,
  note: z.string().trim().max(1000).optional(),
})

export const listLeaveRequestsQuerySchema = z
  .object({
    studentId: z.string().cuid().optional(),
    status: status.optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
    sortBy: z.enum(['createdAt', 'startDate', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be on or before `to`',
    path: ['to'],
  })

export type CreateLeaveRequestBody = z.infer<typeof createLeaveRequestSchema>
export type CreateLeaveRequestForStudentBody = z.infer<
  typeof createLeaveRequestForStudentSchema
>
export type UpdateLeaveRequestBody = z.infer<typeof updateLeaveRequestSchema>
export type ReviewLeaveRequestBody = z.infer<typeof reviewLeaveRequestSchema>
export type ListLeaveRequestsQuery = z.infer<
  typeof listLeaveRequestsQuerySchema
>