import { z } from 'zod'

export const createTeacherSchema = z.object({
  userId: z.string().cuid(),
  teacherCode: z.string().min(1),
  subjectIds: z.array(z.string().cuid()).default([]),
})

export const updateTeacherSchema = z.object({
  teacherCode: z.string().min(1).optional(),
  subjectIds: z.array(z.string().cuid()).optional(),
})
