import { z } from 'zod'

/**
 * Same rule as auth/users/students/teachers — length only, no composition.
 * The `.default('Password@123')` from the previous version is removed: a
 * default password baked into the source is a known-credential backdoor.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((v) => v.trim().length > 0, 'Password cannot be only whitespace')

const email = z.string().trim().email().toLowerCase().max(254)

/**
 * Roles this endpoint accepts by NAME. Must match the `name` column on the
 * seeded Role rows. If a role is added to prisma/seed.ts, add it here too.
 *
 * NOTE — the previous enum had a `'mazer'` value mapped to `'student'`
 * everywhere in the service. That looks like a debug artifact left in the
 * codebase, not a real role. It's removed here. If it was real, re-add it
 * and add a comment explaining what it does.
 */
const roleName = z.enum(['admin', 'teacher', 'student', 'parent'])

/**
 * Roles that must be created through their own endpoint, not through
 * `POST /users`.
 *
 * The reason: `POST /users` creates a `User` row but not the corresponding
 * `Teacher` or `Student` profile row. The account exists and can log in,
 * but every endpoint that resolves the profile (via `teacherIdForUser` /
 * `studentIdForUser`) returns 403 — a half-created account with no obvious
 * way for the operator to complete it.
 *
 * `POST /teachers` and `POST /students` create the User AND the profile in
 * one transaction. That's what callers should use for these roles.
 *
 * `admin` and `parent` are exempt: admin has no profile, and parent's
 * profile is simple enough that the users module handles it inline.
 */
const PROFILE_ROLES = ['teacher', 'student'] as const

export const createUserSchema = z
  .object({
    email,
    password,
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    phone: z.string().trim().max(40).optional(),
    roleId: z.string().cuid().optional(),
    /** @deprecated Prefer `roleId`. */
    role: roleName.optional(),
  })
  .refine((d) => Boolean(d.roleId || d.role), {
    message: 'role or roleId is required',
    path: ['role'],
  })
  .refine(
    (d) =>
      !d.role ||
      !PROFILE_ROLES.includes(d.role as (typeof PROFILE_ROLES)[number]),
    {
      message:
        'Teacher and student accounts must be created via POST /teachers or POST /students, which create the profile row alongside the user',
      path: ['role'],
    }
  )

/**
 * Update schema. `isActive` and `status` both exist because the current UI
 * sends `status: 'active' | 'inactive'` while other clients send
 * `isActive: boolean` — the service normalizes both to `isActive`.
 *
 * A caller that sends both is rejected: two fields controlling the same
 * thing with different values is a client bug, not something to resolve
 * silently.
 */
export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().trim().max(40).optional(),
    roleId: z.string().cuid().optional(),
    /** @deprecated Prefer `roleId`. */
    role: roleName.optional(),
    isActive: z.boolean().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })
  .refine(
    (d) => d.isActive === undefined || d.status === undefined,
    { message: 'Provide either isActive or status, not both', path: ['status'] }
  )

export const resetUserPasswordSchema = z.object({
  newPassword: password,
})

export const bulkStatusSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(200),
  status: z.enum(['active', 'inactive']),
})

export const listUsersQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  role: roleName.optional(),
  status: z.enum(['active', 'inactive']).optional(),
  classId: z.string().cuid().optional(),
  department: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(['createdAt', 'email', 'firstName', 'lastName', 'lastLoginAt'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateUserBody = z.infer<typeof createUserSchema>
export type UpdateUserBody = z.infer<typeof updateUserSchema>
export type ResetUserPasswordBody = z.infer<typeof resetUserPasswordSchema>
export type BulkStatusBody = z.infer<typeof bulkStatusSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>