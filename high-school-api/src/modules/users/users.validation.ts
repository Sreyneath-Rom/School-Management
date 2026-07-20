import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  roleId: z.string().cuid(),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  roleId: z.string().cuid().optional(),
  isActive: z.boolean().optional(),
})

export const resetUserPasswordSchema = z.object({
  newPassword: z.string().min(8),
})
