import { z } from 'zod'

/**
 * Normalizes to UTC midnight, same rule as the attendance and dashboard
 * modules. A report over "September 2026" should mean the same range
 * regardless of whether the client sent `"2026-09-01"` or
 * `"2026-09-01T14:30:00Z"`.
 */
const dateOnly = z.coerce.date().transform((d) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
)

/**
 * The `period` enum must match the one in grades.validation.ts and the
 * Prisma schema. The old version accepted any string and cast it to `never`
 * before handing it to Prisma — a typo like `?period=weekly` produced a
 * filter against a value that doesn't exist, returning an empty array. No
 * way to tell "student has no monthly grades" from "you typed it wrong".
 */
const period = z.enum(['MONTHLY', 'SEMESTER', 'ANNUAL'])

/**
 * Pagination shape for a report row set. Default 100 rows is deliberately
 * higher than the usual 20 — a report over a class of 30 students for one
 * month is ~900 attendance rows, and forcing the client to paginate 45 times
 * makes the endpoint useless. Capped at 500 to keep a single response from
 * becoming a memory problem.
 */
const paginationFields = {
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(100),
}

export const attendanceReportQuerySchema = z
  .object({
    classId: z.string().cuid().optional(),
    studentId: z.string().cuid().optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
    ...paginationFields,
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be on or before `to`',
    path: ['to'],
  })

export const gradesReportQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  studentId: z.string().cuid().optional(),
  period: period.optional(),
  periodLabel: z.string().trim().min(1).max(64).optional(),
  ...paginationFields,
})

export const reportSubjectParamSchema = z.object({
  id: z.string().cuid(),
})

export type AttendanceReportQuery = z.infer<typeof attendanceReportQuerySchema>
export type GradesReportQuery = z.infer<typeof gradesReportQuerySchema>