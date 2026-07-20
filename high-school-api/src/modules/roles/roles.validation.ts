import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'name must be lowercase-kebab-case (e.g. "vice-principal")'),
  label: z.string().min(2).max(80),
})

export const updateRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().cuid()),
})
