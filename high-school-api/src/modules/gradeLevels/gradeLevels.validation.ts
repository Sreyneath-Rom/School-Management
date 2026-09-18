import { z } from 'zod'

const gradeLevelFields = z.object({
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().min(1).max(120),
  alias: z.string().trim().max(120).default(''),
  levelOrder: z.number().int().min(1).max(100),
  minPassingScore: z.number().int().min(0).max(100).default(50),
  headCoordinator: z.string().trim().max(120).default(''),
  totalClasses: z.number().int().min(0).default(0),
  enrolledStudents: z.number().int().min(0).default(0),
  maxCapacity: z.number().int().min(0).default(0),
  averageGpa: z.number().min(0).max(4).default(0),
  status: z.enum(['Active', 'Archived']).default('Active'),
  description: z.string().trim().max(2000).default(''),
})

export const createGradeLevelSchema = gradeLevelFields
export const updateGradeLevelSchema = gradeLevelFields.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})
