import { z } from 'zod'

/**
 * Permission keys follow the `<module>.<action>` convention documented in
 * prisma/seed.ts and enforced by `requirePermission(moduleKey, action)` in
 * src/middleware/role.middleware.ts.
 *
 * The regex is deliberately strict:
 *   - lowercase only — the seed builds keys from lowercase module/action
 *     names, and `requirePermission` compares strings exactly. A key with
 *     any uppercase letter would never match a check.
 *   - module/action may contain hyphens but not dots — splitting on the
 *     first dot is how the service derives `moduleId`/`action`, so a key
 *     with more than one dot would produce an ambiguous split.
 */
const key = z
  .string()
  .trim()
  .regex(
    /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/,
    'key must be in the form "<module>.<action>" using lowercase letters, digits, and hyphens (e.g. "grades.edit")'
  )
  .max(120)

export const createPermissionSchema = z.object({
  key,
  description: z.string().trim().max(500).optional(),
})

/**
 * Update schema deliberately excludes `key`.
 *
 * Renaming a permission is technically safe at the DB level (role assignments
 * point at the row id, not the key), but it breaks code: `requirePermission`
 * builds the required string at call time and checks
 * `req.user.permissionKeys.includes(required)`. Rename `grades.edit` to
 * `grade.edit` and every grade-editing check fails — silently, with no log
 * line, until someone notices teachers lost access.
 *
 * To change a key: delete the old permission (after unassigning it from
 * every role) and create the new one. Both steps are visible operations that
 * force the operator to think about the consequence.
 */
export const updatePermissionSchema = z
  .object({
    description: z.string().trim().max(500).nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export type CreatePermissionBody = z.infer<typeof createPermissionSchema>
export type UpdatePermissionBody = z.infer<typeof updatePermissionSchema>