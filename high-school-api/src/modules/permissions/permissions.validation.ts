    import { z } from 'zod'

// Mirrors the existing convention documented in permissions.routes.ts:
// keys are stored as "<module>.<action>" (e.g. "grades.edit").
const keySchema = z
  .string()
  .regex(/^[a-z0-9-]+\.[a-z0-9-]+$/, 'key must be in the form "<module>.<action>" (e.g. "grades.edit")')

export const createPermissionSchema = z.object({
  key: keySchema,
})

export const updatePermissionSchema = z.object({
  key: keySchema,
})