import { z } from 'zod'

const status = z.enum(['Active', 'Upcoming', 'Archived'])

/**
 * Fields the client controls on create. `isCurrent` is intentionally absent —
 * it's derived from `status` by the service, not set directly. A client that
 * could set `isCurrent: true` on two rows would break the "exactly one current
 * year" invariant the rest of the app relies on.
 *
 * `termsCount` / `classesCount` / `studentsCount` are accepted here because
 * they're currently persisted columns. See the note in the service — these
 * should almost certainly be computed from `_count` instead, at which point
 * they should be removed from this schema.
 */
const academicYearFields = z.object({
  name: z.string().trim().min(1).max(50),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: status.default('Upcoming'),
  termsCount: z.number().int().min(1).max(12).default(3),
  classesCount: z.number().int().min(0).default(0),
  studentsCount: z.number().int().min(0).default(0),
  description: z.string().trim().max(2000).optional(),
})

export const createAcademicYearSchema = academicYearFields.refine(
  (data) => data.startDate < data.endDate,
  { message: 'startDate must be earlier than endDate', path: ['endDate'] }
)

/**
 * `.partial()` wraps every field in ZodOptional, which short-circuits on
 * `undefined` and skips the inner ZodDefault — so the defaults above do NOT
 * fire on PATCH. Verified against Zod 3.x behavior.
 */
export const updateAcademicYearSchema = academicYearFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type CreateAcademicYearBody = z.infer<typeof createAcademicYearSchema>
export type UpdateAcademicYearBody = z.infer<typeof updateAcademicYearSchema>