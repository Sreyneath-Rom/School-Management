import { z } from 'zod'

export const upsertSchoolSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  academicYear: z.string().min(1),
  settings: z.record(z.unknown()).optional(),
})
