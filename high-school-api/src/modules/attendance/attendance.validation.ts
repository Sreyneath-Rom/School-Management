import { z } from 'zod'

export const checkInSchema = z.object({
  studentId: z.string().cuid(),
  date: z.coerce.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  note: z.string().optional(),
})

export const checkOutSchema = z.object({
  studentId: z.string().cuid(),
  date: z.coerce.date(),
})
