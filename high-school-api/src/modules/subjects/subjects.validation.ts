import { z } from 'zod'

export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  department: z.string().min(1).default('General'),
  category: z.enum(['Core', 'Elective', 'AP / Advanced']).default('Core'),
  credits: z.number().int().min(0).max(100).default(3),
  weeklyHours: z.number().int().min(0).max(168).default(4),
  gradeLevel: z.string().min(1).default('Grade 10'),
  teachers: z.array(z.string().trim().min(1)).max(100).default([]),
  description: z.string().optional(),
})

export const updateSubjectSchema = createSubjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })