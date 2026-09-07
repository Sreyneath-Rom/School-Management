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

export const updateAttendanceSchema = z
  .object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
    checkIn: z.coerce.date().nullable().optional(),
    checkOut: z.coerce.date().nullable().optional(),
    note: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
