import { z } from 'zod'

export const createClassSchema = z.object({
  name: z.string().min(1),
  gradeLevel: z.number().int().positive(),
  homeroomTeacherId: z.string().cuid().optional(),
})

export const updateClassSchema = createClassSchema.partial()
