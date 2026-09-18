import { z } from 'zod'

/**
 * NOTE — `teacherId` is intentionally absent from both create and update.
 *
 * The previous versions accepted it from the request body, which let any
 * caller with `lessons.create` attribute a lesson to another teacher. Now
 * resolved from `req.user.sub` in the controller (see `teacherIdForUser`),
 * same pattern as announcements/grades/homework.
 *
 * Reassigning a lesson to a different teacher after creation is not a
 * meaningful operation — it's an audit-trail hazard — so it's absent from the
 * update schema too. If an admin needs to transfer lessons between teachers
 * (e.g. a substitute), that should be an explicit operation, not a silent
 * field on PATCH.
 */

/**
 * File metadata that accompanies a lesson's material upload. URL is validated
 * so it must be an absolute URL — relative paths would resolve differently
 * depending on which host serves the API. `fileSizeKb` is bounded so a
 * client can't record an absurd value; the actual upload limit is enforced
 * by the multer middleware in the upload route.
 */
const fileUrl = z.string().url().max(1000)
const fileType = z.string().trim().min(1).max(120)
const fileSizeKb = z.number().int().positive().max(50_000) // 50 MB cap

export const createLessonSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  subjectId: z.string().cuid(),
  classId: z.string().cuid().optional(),
  scheduledAt: z.coerce.date().optional(),
  fileUrl: fileUrl.optional(),
  fileType: fileType.optional(),
  fileSizeKb: fileSizeKb.optional(),
})

export const updateLessonSchema = createLessonSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint. `search` matches title and description
 * case-insensitively, so a teacher can find "quadratic equations" without
 * knowing the exact title.
 */
export const listLessonsQuerySchema = z.object({
  subjectId: z.string().cuid().optional(),
  classId: z.string().cuid().optional(),
  teacherId: z.string().cuid().optional(),
  search: z.string().trim().min(1).max(200).optional(),
  scheduledFrom: z.coerce.date().optional(),
  scheduledTo: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['title', 'createdAt', 'scheduledAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateLessonBody = z.infer<typeof createLessonSchema>
export type UpdateLessonBody = z.infer<typeof updateLessonSchema>
export type ListLessonsQuery = z.infer<typeof listLessonsQuerySchema>