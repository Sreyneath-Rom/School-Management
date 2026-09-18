import { z } from 'zod'

export const createTeacherSchema = z.object({
  userId: z.string().cuid().optional(),
  teacherCode: z.string().min(1).optional(),
  subjectIds: z.array(z.string().cuid()).default([]),
  employeeId: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).default('Password@123'),
  phone: z.string().optional(),
  subjectsTaught: z.array(z.string()).optional(),
}).refine((data) => Boolean(data.userId || (data.firstName && data.lastName && data.email)), {
  message: 'userId or teacher identity fields are required',
  path: ['userId'],
})

export const updateTeacherSchema = z.object({
  teacherCode: z.string().min(1).optional(),
  employeeId: z.string().min(1).optional(),
  subjectIds: z.array(z.string().cuid()).optional(),
  subjectsTaught: z.array(z.string()).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(['Active', 'On Leave', 'Inactive', 'active', 'inactive']).optional(),
})
