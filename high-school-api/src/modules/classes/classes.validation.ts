import { z } from 'zod'

const name = z.string().trim().min(1).max(120)
const gradeLevel = z.number().int().min(0).max(20)

/**
 * `homeroomTeacherId` is nullable so a client can explicitly clear the
 * homeroom teacher on an update (send `null`). Omitting the field entirely
 * means "no change" — a distinction worth preserving in the API.
 */
export const createClassSchema = z.object({
  name,
  gradeLevel,
  homeroomTeacherId: z.string().cuid().nullable().optional(),
  capacity: z.number().int().positive().max(200).optional(),
})

export const updateClassSchema = createClassSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint. Uses `z.coerce` for numbers because
 * query strings always arrive as strings — without coercion, `?gradeLevel=10`
 * would fail validation with "expected number, received string".
 */
export const listClassesQuerySchema = z.object({
  gradeLevel: z.coerce.number().int().min(0).max(20).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  homeroomTeacherId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(['name', 'gradeLevel', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type CreateClassBody = z.infer<typeof createClassSchema>
export type UpdateClassBody = z.infer<typeof updateClassSchema>
export type ListClassesQuery = z.infer<typeof listClassesQuerySchema>