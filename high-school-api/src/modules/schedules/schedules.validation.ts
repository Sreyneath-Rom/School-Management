import { z } from 'zod'

// Regex-only HH:MM (e.g. `\d{2}:\d{2}`) accepts nonsense like "99:99" —
// this bounds hours to 00-23 and minutes to 00-59.
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'must be a valid 24-hour time (HH:MM)')

const baseScheduleSchema = z.object({
  classId: z.string().cuid(),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: timeSchema,
  endTime: timeSchema,
  room: z.string().optional(),
})

export const createScheduleSchema = baseScheduleSchema.refine((data) => data.startTime < data.endTime, {
  message: 'startTime must be before endTime',
  path: ['endTime'],
})

export const updateScheduleSchema = baseScheduleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
  .refine((data) => !(data.startTime && data.endTime) || data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  })