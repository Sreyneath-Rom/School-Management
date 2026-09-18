import { z } from 'zod'

const status = z.enum(['Active', 'Upcoming', 'Archived'])

const academicYearFields = z.object({
  name: z.string().trim().min(1).max(50),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: status.default('Upcoming'),
  termsCount: z.number().int().min(1).max(12).default(3),
  classesCount: z.number().int().min(0).default(0),
  studentsCount: z.number().int().min(0).default(0),
  description: z.string().trim().max(2000).optional(),
})

export const createAcademicYearSchema = academicYearFields.refine((data) => data.startDate < data.endDate, {
  message: 'startDate must be earlier than endDate',
  path: ['endDate'],
})

export const updateAcademicYearSchema = academicYearFields.partial().refine(
  (data: Record<string, unknown>) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' },
)
