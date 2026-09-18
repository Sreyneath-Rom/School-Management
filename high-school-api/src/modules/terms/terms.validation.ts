import { z } from 'zod'

const termFields = z.object({
  name: z.string().trim().min(1).max(120),
  academicYearId: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  gradingDeadline: z.coerce.date(),
  status: z.enum(['Active', 'Completed', 'Upcoming']).default('Upcoming'),
  examCount: z.number().int().min(0).default(0),
  weightPercentage: z.number().int().min(1).max(100),
  description: z.string().trim().max(2000).optional(),
})

export const createTermSchema = termFields.refine((data) => data.startDate < data.endDate, {
  message: 'startDate must be earlier than endDate',
  path: ['endDate'],
})
export const updateTermSchema = termFields.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})
