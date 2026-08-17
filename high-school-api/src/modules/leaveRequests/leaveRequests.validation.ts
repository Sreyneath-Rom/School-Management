import { z } from 'zod'

export const createLeaveRequestSchema = z.object({
  studentId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().min(1),
})

export const updateLeaveRequestSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    reason: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const reviewLeaveRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})