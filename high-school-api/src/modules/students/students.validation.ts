import { z } from 'zod'

export const createStudentSchema = z.object({
  userId: z.string().cuid(),
  studentCode: z.string().min(1),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
  classId: z.string().cuid().optional(),
})

export const enrollStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).default('Password@123'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  studentCode: z.string().min(1).optional(),
  studentId: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
  className: z.string().min(1).optional(),
  class: z.string().min(1).optional(),
}).refine((data) => Boolean(data.studentCode || data.studentId), {
  message: 'studentCode or studentId is required',
  path: ['studentCode'],
})

export const updateStudentSchema = z.object({
  studentCode: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
  classId: z.string().cuid().optional(),
  class: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(['active', 'inactive']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })