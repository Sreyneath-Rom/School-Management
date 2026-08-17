import { z } from 'zod'

const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'must be a valid date' })

export const attendanceReportQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  from: dateString.optional(),
  to: dateString.optional(),
})

export const gradesReportQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  // Left as a plain string (rather than a fixed enum) since the Prisma
  // `period` field's allowed values live in the schema, not here — keeps
  // this schema from drifting out of sync if the period list changes.
  period: z.string().optional(),
})

export const reportSubjectParamSchema = z.object({
  id: z.string().cuid(),
})