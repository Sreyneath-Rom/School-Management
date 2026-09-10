import { z } from 'zod'

export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  department: z.string().min(1).default('General'),
  category: z.enum(['Core', 'Elective', 'AP / Advanced']).default('Core'),
  description: z.string().optional(),
})

export const updateSubjectSchema = createSubjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })