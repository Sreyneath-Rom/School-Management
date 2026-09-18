import { z } from 'zod'

/**
 * Same password rule used by auth and users modules. Length is the only
 * constraint that matters — composition rules are counterproductive.
 *
 * NOTE — the previous schema had `.default('Password@123')` on this field.
 * A default password baked into the source is a known-credential backdoor:
 * any enrolled student whose password was never explicitly set has an
 * account that any reader of this repository can log into. The field is now
 * REQUIRED with no default.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((v) => v.trim().length > 0, 'Password cannot be only whitespace')

const email = z.string().trim().email().toLowerCase().max(254)

const studentCode = z.string().trim().min(1).max(40)

/**
 * Gender is a closed set. The previous schema accepted any string, so
 * `?gender=M` and `?gender=male` were different filters, and a typo'd
 * filter silently returned nothing. Adjust the allowed values to match the
 * domain if needed.
 */
const gender = z.enum(['male', 'female', 'other'])

// ---------------------------------------------------------------------------
// Body schemas
// ---------------------------------------------------------------------------

/**
 * Links an EXISTING user account to a new Student profile. Used when a
 * user is created through the users module and then enrolled. The user must
 * already exist.
 *
 * For creating both at once (the common "Enroll Student" flow), use
 * `enrollStudentSchema` below.
 */
export const createStudentSchema = z.object({
  userId: z.string().cuid(),
  studentCode,
  dateOfBirth: z.coerce.date().optional(),
  gender: gender.optional(),
  classId: z.string().cuid().optional(),
})

/**
 * Creates a User AND a Student profile in one transaction. This is the
 * "Enroll Student" flow used by the admin UI.
 *
 * Note: `className` and `class` are both accepted so a caller can pass the
 * human-readable class name from a dropdown without first resolving it to an
 * id. The service resolves and validates; only one of the two should be set
 * if both are provided — the service prefers `classId` if present.
 */
export const enrollStudentSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional(),
  studentCode,
  dateOfBirth: z.coerce.date().optional(),
  gender: gender.optional(),
  classId: z.string().cuid().optional(),
  /** @deprecated Prefer `classId`. Kept for backward compatibility with the current UI. */
  className: z.string().trim().min(1).max(120).optional(),
})

/**
 * Update schema. Every field optional; the `.refine` rejects empty bodies.
 *
 * Note: `classId` and `className`/`class` are the same target through
 * different identifiers — the service resolves whichever is present.
 */
export const updateStudentSchema = z
  .object({
    studentCode: studentCode.optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: gender.optional(),
    classId: z.string().cuid().optional(),
    /** @deprecated Prefer `classId`. */
    className: z.string().trim().min(1).max(120).optional(),
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().trim().max(40).optional(),
    email: email.optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

// ---------------------------------------------------------------------------
// Query schema
// ---------------------------------------------------------------------------

export const listStudentsQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  /**
   * `className` filter — the current UI sends a class name from a dropdown.
   * Kept as an alias for `classId` at the query layer for compatibility.
   */
  className: z.string().trim().min(1).max(120).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  gender: gender.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'studentCode', 'firstName', 'lastName']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateStudentBody = z.infer<typeof createStudentSchema>
export type EnrollStudentBody = z.infer<typeof enrollStudentSchema>
export type UpdateStudentBody = z.infer<typeof updateStudentSchema>
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>