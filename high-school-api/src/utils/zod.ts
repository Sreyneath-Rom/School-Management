import { z } from 'zod'

/**
 * Standard PATCH body schema. Wraps a base object, marks all fields
 * optional, and rejects an empty/undefined-only payload.
 */
export function patchSchema<T extends z.ZodObject<z.ZodRawShape>>(base: T) {
  return base
    .partial()
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
      message: 'At least one field must be provided',
    })
}