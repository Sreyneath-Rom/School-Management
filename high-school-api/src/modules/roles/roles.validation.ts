import { z } from 'zod'

/**
 * Built-in roles created by the seed. Their names are load-bearing — they
 * are matched by `requireRole('admin')` and `requireRole('admin', 'teacher')`
 * checks throughout the codebase, and the RBAC seed grants them fixed
 * permission sets.
 *
 * Kept as a shared constant so the service doesn't repeat the list at four
 * call sites. If a new built-in role is added to seed.ts, add it here too.
 */
export const SYSTEM_ROLE_NAMES = ['admin', 'teacher', 'student', 'parent'] as const
export type SystemRoleName = (typeof SYSTEM_ROLE_NAMES)[number]

const roleName = z
  .string()
  .trim()
  .min(2)
  .max(50)
  .regex(
    /^[a-z][a-z0-9-]*$/,
    'name must be lowercase-kebab-case starting with a letter (e.g. "vice-principal")'
  )

const roleLabel = z.string().trim().min(2).max(80)

export const createRoleSchema = z.object({
  name: roleName,
  label: roleLabel,
})

/**
 * Update schema. `name` and `label` are both optional so a caller can change
 * just the display label (the common case — fixing a typo) without resending
 * `name`. The service refuses to rename any built-in role.
 */
export const updateRoleSchema = z
  .object({
    name: roleName.optional(),
    label: roleLabel.optional(),
  })
  .refine((d) => d.name !== undefined || d.label !== undefined, {
    message: 'At least one of name or label must be provided',
  })

/**
 * Full replace of a role's permission set. The empty array is allowed —
 * clearing every permission from a custom role is a legitimate operation.
 *
 * Ids are deduped at the schema layer so the service receives a clean set.
 * Without this, `createMany` on a schema with a `@@unique([roleId, permissionId])`
 * constraint would fail with P2002 when a client sends the same id twice;
 * without that constraint, it would silently create duplicate rows.
 */
export const updateRolePermissionsSchema = z.object({
  permissionIds: z
    .array(z.string().cuid())
    .max(500)
    .transform((ids) => [...new Set(ids)]),
})

export type CreateRoleBody = z.infer<typeof createRoleSchema>
export type UpdateRoleBody = z.infer<typeof updateRoleSchema>
export type UpdateRolePermissionsBody = z.infer<
  typeof updateRolePermissionsSchema
>