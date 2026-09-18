import { z } from 'zod'

const status = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'])

/**
 * Normalizes any accepted date input to UTC midnight. Storing a date with a
 * time component would break the `studentId_date` unique constraint in
 * subtle ways — two records for "the same day" become possible if a client
 * sometimes sends `"2026-09-18"` and sometimes `"2026-09-18T08:30:00Z"`.
 *
 * Rule: on the wire, a "date" means the calendar day in UTC. If the school
 * operates in a fixed non-UTC timezone, that conversion belongs at the
 * boundary — do not store local time here.
 */
const dateOnly = z.coerce.date().transform((d) => {
  const normalized = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  )
  return normalized
})

// ---------------------------------------------------------------------------
// Body schemas
// ---------------------------------------------------------------------------

export const checkInSchema = z.object({
  studentId: z.string().cuid(),
  date: dateOnly,
  status,
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  note: z.string().trim().max(500).optional(),
})

export const checkOutSchema = z.object({
  studentId: z.string().cuid(),
  date: dateOnly,
  checkOut: z.coerce.date().optional(),
})

export const bulkMarkSchema = z.object({
  date: dateOnly,
  records: z
    .array(
      z.object({
        studentId: z.string().cuid(),
        status,
        checkIn: z.coerce.date().optional(),
        checkOut: z.coerce.date().optional(),
        note: z.string().trim().max(500).optional(),
      })
    )
    .min(1)
    .max(500), // guards against a runaway bulk write in one request
})

export const updateAttendanceSchema = z
  .object({
    status: status.optional(),
    checkIn: z.coerce.date().nullable().optional(),
    checkOut: z.coerce.date().nullable().optional(),
    note: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

// ---------------------------------------------------------------------------
// Query schemas
// ---------------------------------------------------------------------------

export const listAttendanceQuerySchema = z
  .object({
    studentId: z.string().cuid().optional(),
    classId: z.string().cuid().optional(),
    date: dateOnly.optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
  })
  .refine((q) => !(q.date && (q.from || q.to)), {
    message: 'Use either `date` or `from`/`to`, not both',
    path: ['date'],
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be on or before `to`',
    path: ['to'],
  })

export const statsQuerySchema = z.object({
  date: dateOnly.optional(),
  classId: z.string().cuid().optional(),
})

export type CheckInBody = z.infer<typeof checkInSchema>
export type CheckOutBody = z.infer<typeof checkOutSchema>
export type BulkMarkBody = z.infer<typeof bulkMarkSchema>
export type UpdateAttendanceBody = z.infer<typeof updateAttendanceSchema>
export type ListAttendanceQuery = z.infer<typeof listAttendanceQuerySchema>
export type StatsQuery = z.infer<typeof statsQuerySchema>