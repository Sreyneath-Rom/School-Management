import { z } from 'zod'

export const createLeaveRequestSchema = z.object({
  studentId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().min(1),
})

export const reviewLeaveRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})
