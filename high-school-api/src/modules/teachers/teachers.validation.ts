import { z } from 'zod'

/**
 * Same password rule as auth/users/students. Length only; no composition
 * rules. The `.default('Password@123')` from the previous version is
 * removed — see the top of teachers.service.ts for why.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((v) => v.trim().length > 0, 'Password cannot be only whitespace')

const email = z.string().trim().email().toLowerCase().max(254)
const teacherCode = z.string().trim().min(1).max(40)

/**
 * Two mutually-exclusive ways to create a teacher:
 *
 *   1. `userId` provided — link an existing user account to a new Teacher
 *      profile. Used when the user was created via the users module.
 *
 *   2. `firstName` + `lastName` + `email` + `password` provided — create a
 *      User and a Teacher in one transaction. The common "Add Teacher" flow.
 *
 * The superRefine enforces the choice; a call that mixes both paths (e.g.
 * `userId` plus `email`) is rejected.
 */
export const createTeacherSchema = z
  .object({
    userId: z.string().cuid().optional(),
    teacherCode: teacherCode.optional(),
    /**
     * @deprecated Prefer `teacherCode`. The current UI sends `employeeId`
     * for historical reasons; the service merges it into `teacherCode`.
     * Remove this field and the merge logic once the UI stops sending it.
     */
    employeeId: teacherCode.optional(),
    subjectIds: z.array(z.string().cuid()).max(50).default([]),
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    email: email.optional(),
    password: password.optional(),
    phone: z.string().trim().max(40).optional(),
    /**
     * @deprecated Prefer `subjectIds`. The current UI sends subject names,
     * not ids. Resolved and validated by the service; when `subjectIds` is
     * present, `subjectsTaught` is ignored.
     */
    subjectsTaught: z
      .array(z.string().trim().min(1).max(120))
      .max(50)
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasUserId = typeof data.userId === 'string'
    const hasIdentity = Boolean(
      data.firstName && data.lastName && data.email && data.password
    )

    if (hasUserId && hasIdentity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Provide either userId (to link an existing user) OR firstName/lastName/email/password (to create a new one), not both',
        path: ['userId'],
      })
      return
    }

    if (!hasUserId && !hasIdentity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Either userId, or all of firstName, lastName, email, and password, must be provided',
        path: ['userId'],
      })
    }
  })

export const updateTeacherSchema = z
  .object({
    teacherCode: teacherCode.optional(),
    /**
     * @deprecated Prefer `teacherCode`. See the note on the create schema.
     */
    employeeId: teacherCode.optional(),
    subjectIds: z.array(z.string().cuid()).max(50).optional(),
    /** @deprecated Prefer `subjectIds`. */
    subjectsTaught: z
      .array(z.string().trim().min(1).max(120))
      .max(50)
      .optional(),
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    email: email.optional(),
    phone: z.string().trim().max(40).optional(),
    /**
     * Only `active` / `inactive` are meaningful for the user's `isActive`
     * flag. `On Leave` is preserved for UI compatibility but maps to
     * `isActive: true` — a teacher on leave still has a working account.
     */
    status: z
      .enum([
        'Active',
        'On Leave',
        'Inactive',
        'active',
        'inactive',
        'on leave',
      ])
      .optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint.
 *
 * `status` is a closed set — the previous code branched on
 * `status === 'Inactive'` and treated every OTHER string as "active",
 * so `?status=bogus` silently returned only active teachers. Now it's a 400.
 */
export const listTeachersQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  department: z.string().trim().min(1).max(120).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  sortBy: z
    .enum(['createdAt', 'teacherCode', 'firstName', 'lastName'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateTeacherBody = z.infer<typeof createTeacherSchema>
export type UpdateTeacherBody = z.infer<typeof updateTeacherSchema>
export type ListTeachersQuery = z.infer<typeof listTeachersQuerySchema>