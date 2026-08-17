import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'name must be lowercase-kebab-case (e.g. "vice-principal")'),
  label: z.string().min(2).max(80),
})

export const updateRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().cuid()),
})

// Both fields optional — supports renaming just the label (common case,
// e.g. fixing a typo in the display name) without also having to resend
// name, or vice versa. At least one of the two must be present.
export const updateRoleSchema = z
  .object({
    name: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9-]+$/, 'name must be lowercase-kebab-case (e.g. "vice-principal")')
      .optional(),
    label: z.string().min(2).max(80).optional(),
  })
  .refine((data) => data.name !== undefined || data.label !== undefined, {
    message: 'At least one of name or label must be provided',
  })