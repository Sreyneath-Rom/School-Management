import { z } from 'zod'

export const createStudentSchema = z.object({
  userId: z.string().cuid(),
  studentCode: z.string().min(1),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
  classId: z.string().cuid().optional(),
})

export const updateStudentSchema = createStudentSchema.partial().omit({ userId: true })
