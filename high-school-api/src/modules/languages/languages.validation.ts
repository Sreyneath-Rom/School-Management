import { z } from 'zod'

export const createLanguageSchema = z.object({
  code: z
    .string()
    .regex(/^[a-z]{2,5}$/i, 'code must be 2-5 letters')
    .transform((v) => v.toLowerCase()),
  name: z.string().min(1),
})

export const updateLanguageSchema = z.object({
  name: z.string().min(1),
})