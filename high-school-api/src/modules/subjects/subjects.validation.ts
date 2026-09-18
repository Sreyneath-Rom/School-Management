import { z } from 'zod'

const category = z.enum(['Core', 'Elective', 'AP / Advanced'])
const department = z.string().trim().min(1).max(120)

const subjectFields = z.object({
  name: z.string().trim().min(1).max(200),
  code: z.string().trim().min(1).max(32),
  department: department.default('General'),
  category: category.default('Core'),
  credits: z.number().int().min(0).max(100).default(3),
  weeklyHours: z.number().int().min(0).max(168).default(4),
  gradeLevel: z.string().trim().min(1).max(80).default('Grade 10'),
  /**
   * `teachers` is a string array of teacher NAMES, not ids — the schema
   * stores them on the Subject row as `teacherNames`. See the note at the
   * bottom of subjects.service.ts for why this is fragile and what the
   * migration path looks like.
   *
   * The values are capped at 100 names of 120 chars each: a reasonable
   * upper bound on how many teachers can be attached to one subject.
   */
  teachers: z
    .array(z.string().trim().min(1).max(120))
    .max(100)
    .default([]),
  description: z.string().trim().max(5000).optional(),
})

export const createSubjectSchema = subjectFields

/**
 * `.partial()` wraps each field in ZodOptional, which short-circuits on
 * `undefined` and skips the inner ZodDefault — so the defaults above do NOT
 * fire on PATCH. That's the intended behavior; a PATCH that sends only
 * `name` shouldn't reset `category` to `'Core'`.
 */
export const updateSubjectSchema = subjectFields
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint.
 *
 *   - `category` is an enum: the old code cast any string to the model,
 *     so `?category=core` (lowercase) silently returned zero results —
 *     indistinguishable from "no subjects in that category".
 *   - `department` is a free-form string (departments are school-defined).
 *   - `search` matches name/code/description case-insensitively.
 */
export const listSubjectsQuerySchema = z.object({
  department: department.optional(),
  category: category.optional(),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  sortBy: z.enum(['name', 'code', 'department', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type CreateSubjectBody = z.infer<typeof createSubjectSchema>
export type UpdateSubjectBody = z.infer<typeof updateSubjectSchema>
export type ListSubjectsQuery = z.infer<typeof listSubjectsQuerySchema>