// school.validation.ts
import { z } from 'zod'

// `.nullable()` matters on both schemas: the frontend sends explicit
// `null` (not omission) to clear an optional field, e.g. removing a
// phone number. Without it, that `null` fails validation with a 400.
const nullableOptional = <T extends z.ZodTypeAny>(schema: T) => schema.nullable().optional()

export const createSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  logoUrl: nullableOptional(z.string().url()),
  address: nullableOptional(z.string()),
  phone: nullableOptional(z.string()),
  email: nullableOptional(z.string().email('Invalid email address')),
  academicYear: z.string().min(1, 'Academic year is required'),
  settings: z.record(z.unknown()).optional(),
})

export const updateSchoolSchema = z
  .object({
    name: z.string().min(1).optional(),
    logoUrl: nullableOptional(z.string().url()),
    address: nullableOptional(z.string()),
    phone: nullableOptional(z.string()),
    email: nullableOptional(z.string().email('Invalid email address')),
    academicYear: z.string().min(1).optional(),
    settings: z.record(z.unknown()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })