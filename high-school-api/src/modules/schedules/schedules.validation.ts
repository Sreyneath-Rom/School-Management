import { z } from 'zod'

/**
 * HH:MM with hours bounded 00-23 and minutes 00-59. A looser regex like
 * `^\d{2}:\d{2}$` accepts "99:99" and "25:00", which then sort and compare
 * incorrectly against real times.
 */
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'must be a valid 24-hour time (HH:MM)')

const scheduleFields = z.object({
  classId: z.string().cuid(),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: timeSchema,
  endTime: timeSchema,
  /**
   * Room is stored as a plain string in the current schema (not an FK), so
   * this only validates shape. If your schema stores a `roomId`, switch to
   * `z.string().cuid()` and add the FK check in `assertReferencesExist`.
   */
  room: z.string().trim().max(120).optional(),
})

export const createScheduleSchema = scheduleFields.refine(
  (data) => data.startTime < data.endTime,
  { message: 'startTime must be before endTime', path: ['endTime'] }
)

/**
 * `.partial()` wraps every field in ZodOptional, which short-circuits on
 * `undefined`. The order-time refinement still needs to run against the
 * merged (existing + changes) pair — that check lives in the service,
 * because the schema only sees the changes, not the stored row.
 *
 * The refinement below is a cheap pre-check: if the caller sends both times
 * in one request, they must be ordered. The service re-checks after merging.
 */
export const updateScheduleSchema = scheduleFields
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })
  .refine(
    (d) => !(d.startTime && d.endTime) || d.startTime < d.endTime,
    { message: 'startTime must be before endTime', path: ['endTime'] }
  )

export const listSchedulesQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  teacherId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  room: z.string().trim().min(1).max(120).optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(100),
})

export type CreateScheduleBody = z.infer<typeof createScheduleSchema>
export type UpdateScheduleBody = z.infer<typeof updateScheduleSchema>
export type ListSchedulesQuery = z.infer<typeof listSchedulesQuerySchema>