import { z } from 'zod'

export const checkInSchema = z.object({
  studentId: z.string(),
  date: z.coerce.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  note: z.string().optional(),
})

export const checkOutSchema = z.object({
  studentId: z.string(),
  date: z.coerce.date(),
  checkOut: z.coerce.date().optional(),
})

export const bulkMarkSchema = z.object({
  date: z.coerce.date(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      checkIn: z.coerce.date().optional(),
      checkOut: z.coerce.date().optional(),
      note: z.string().optional(),
    })
  ),
})
