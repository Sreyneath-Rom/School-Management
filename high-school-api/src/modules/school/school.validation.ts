import { z } from 'zod'
import type { Prisma } from '@/generated/prisma/client'

const nullableOptional = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullable().optional()

const name = z.string().trim().min(1, 'School name is required').max(200)
const academicYear = z.string().trim().min(1, 'Academic year is required').max(32)
const address = z.string().trim().max(1000)
const phone = z.string().trim().max(40)
const email = z.string().trim().email('Invalid email address').max(254)
const logoUrl = z.string().url().max(1000)

/**
 * `settings` is a free-form JSON blob for deployment-specific config.
 *
 * The `.transform` at the end narrows the type from `Record<string, unknown>`
 * to `Prisma.InputJsonValue`, which is what Prisma's generated types require
 * for a `Json` column. `unknown` can hold functions, `Symbol`, and
 * `undefined` — none of which are valid JSON — so the narrowing is real, not
 * cosmetic. The cast is safe because `JSON.stringify` on the value already
 * succeeded (the `.refine` below forced it).
 *
 * Placing the transform here means the service receives the Prisma-compatible
 * type directly, and no cast is needed at the `prisma.school.create` call site.
 */
const settings = z
  .record(z.unknown())
  .refine(
    (v) => JSON.stringify(v).length <= 32 * 1024,
    'settings exceeds the 32 KB limit'
  )
  .transform((v) => v as Prisma.InputJsonValue)
  .optional()

export const createSchoolSchema = z.object({
  name,
  logoUrl: nullableOptional(logoUrl),
  address: nullableOptional(address),
  phone: nullableOptional(phone),
  email: nullableOptional(email),
  academicYear,
  settings,
})

export const updateSchoolSchema = z
  .object({
    name: name.optional(),
    logoUrl: nullableOptional(logoUrl),
    address: nullableOptional(address),
    phone: nullableOptional(phone),
    email: nullableOptional(email),
    academicYear: academicYear.optional(),
    settings,
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Setup schema for `PATCH /school/setup`. The route is create-or-update, so
 * the schema accepts the union:
 *
 *   - When a school exists, `updateSchoolSchema` (all optional) applies —
 *     the service takes the update branch.
 *   - When no school exists, `createSchoolSchema` (name + academicYear
 *     required) applies — the service takes the create branch.
 *
 * The schema can't know which branch will run (that depends on DB state), so
 * it accepts the wider shape and the service enforces the narrower one at
 * the create call. That's the check that produces error 4 in your report,
 * and it now runs as a clear 400 instead of a compile error.
 */
export const setupSchoolSchema = updateSchoolSchema

export type CreateSchoolBody = z.infer<typeof createSchoolSchema>
export type UpdateSchoolBody = z.infer<typeof updateSchoolSchema>
export type SetupSchoolBody = z.infer<typeof setupSchoolSchema>