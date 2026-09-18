import { z } from 'zod'

/**
 * Normalizes any accepted date input to UTC midnight. Same rule as the
 * attendance module — the `date` field means the calendar day in UTC.
 */
const dateOnly = z.coerce.date().transform((d) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
)

/** 24-hour "HH:mm". Rejects "9:00" and "09:00:00" — both are common client bugs. */
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:mm')

const examStatus = z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])

// ---------------------------------------------------------------------------
// Query schemas
// ---------------------------------------------------------------------------

export const listExamsQuerySchema = z.object({
  academicYearId: z.string().cuid().optional(),
  termId: z.string().cuid().optional(),
  status: examStatus.optional(),
  search: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['title', 'startDate', 'endDate', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const listSchedulesQuerySchema = z
  .object({
    examId: z.string().cuid().optional(),
    subjectId: z.string().cuid().optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be on or before `to`',
    path: ['to'],
  })

export const listMarksQuerySchema = z.object({
  examId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
  studentId: z.string().cuid().optional(),
  scheduleId: z.string().cuid().optional(),
})

export const listReportCardsQuerySchema = z.object({
  studentId: z.string().cuid().optional(),
  academicYearId: z.string().cuid().optional(),
  termId: z.string().cuid().optional(),
})

// ---------------------------------------------------------------------------
// Body schemas
// ---------------------------------------------------------------------------

export const createExamSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    academicYearId: z.string().cuid(),
    termId: z.string().cuid().optional(),
    startDate: dateOnly,
    endDate: dateOnly,
    status: examStatus.default('UPCOMING'),
    /**
     * Classes the exam covers. Stored as a join table in the eventual schema
     * (`ExamClass { examId, classId }`), not as a JSON column — a class can
     * be renamed and the exam should still reference it.
     */
    classIds: z.array(z.string().cuid()).default([]),
  })
  .refine((d) => d.startDate <= d.endDate, {
    message: 'startDate must be on or before endDate',
    path: ['endDate'],
  })

/**
 * `.innerType()` unwraps the outer `.refine()` so we can call `.partial()` on
 * the object. Without it, `.partial()` doesn't exist on `ZodEffects`.
 *
 * The defaults in `createExamSchema` do NOT fire here — `.partial()` wraps
 * every field in ZodOptional, which short-circuits on `undefined`. Correct:
 * a PATCH that only sets `title` shouldn't also reset `status` to UPCOMING.
 */
export const updateExamSchema = createExamSchema
  .innerType()
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export const createScheduleSchema = z
  .object({
    examId: z.string().cuid(),
    subjectId: z.string().cuid(),
    date: dateOnly,
    startTime: timeString,
    endTime: timeString,
    room: z.string().trim().max(120).optional(),
    maxMarks: z.number().int().positive().max(1000).default(100),
    passingMarks: z.number().int().min(0).max(1000).default(50),
    supervisor: z.string().trim().max(120).optional(),
  })
  .refine((d) => d.startTime < d.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  })
  .refine((d) => d.passingMarks <= d.maxMarks, {
    message: 'passingMarks cannot exceed maxMarks',
    path: ['passingMarks'],
  })

export const batchMarkSchema = z.object({
  examId: z.string().cuid(),
  entries: z
    .array(
      z.object({
        studentId: z.string().cuid(),
        subjectId: z.string().cuid(),
        marksObtained: z.number().min(0),
        maxMarks: z.number().int().positive().max(1000).default(100),
        grade: z.string().trim().max(8).optional(),
        remarks: z.string().trim().max(500).optional(),
      })
    )
    .min(1)
    .max(500),
})

export const generateReportCardSchema = z.object({
  studentId: z.string().cuid(),
  academicYearId: z.string().cuid(),
  termId: z.string().cuid().optional(),
})

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type ListExamsQuery = z.infer<typeof listExamsQuerySchema>
export type ListSchedulesQuery = z.infer<typeof listSchedulesQuerySchema>
export type ListMarksQuery = z.infer<typeof listMarksQuerySchema>
export type ListReportCardsQuery = z.infer<typeof listReportCardsQuerySchema>
export type CreateExamBody = z.infer<typeof createExamSchema>
export type UpdateExamBody = z.infer<typeof updateExamSchema>
export type CreateScheduleBody = z.infer<typeof createScheduleSchema>
export type BatchMarkBody = z.infer<typeof batchMarkSchema>
export type GenerateReportCardBody = z.infer<typeof generateReportCardSchema>