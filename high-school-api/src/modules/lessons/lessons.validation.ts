import { z } from 'zod'

export const createLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subjectId: z.string().cuid(),
  teacherId: z.string().cuid(),
  fileUrl: z.string().url().optional(),
  fileType: z.string().optional(),
  fileSizeKb: z.number().int().positive().optional(),
})

export const updateLessonSchema = createLessonSchema.partial()
