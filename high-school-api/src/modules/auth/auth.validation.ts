import { z } from 'zod'

/**
 * Shared password rule. 8 characters minimum, 128 maximum (bcrypt truncates
 * silently past 72 bytes — the upper bound exists so a client gets a clear
 * 400 instead of a password that only partially hashes).
 *
 * Complexity classes (upper/lower/digit/symbol) are deliberately NOT enforced.
 * The research on password composition rules is unambiguous that they push
 * users toward predictable patterns ("Password1!") without measurably
 * improving entropy. Length is what matters.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((v) => v.trim().length > 0, 'Password cannot be only whitespace')

/**
 * Emails are lowercased on the wire so the lookup can be a plain unique
 * query. The seed and login flow both rely on this.
 */
const email = z.string().email().toLowerCase().max(254)

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(128),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).max(2048),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: password,
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'New password must differ from the current password',
    path: ['newPassword'],
  })

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1).max(256),
  newPassword: password,
})

export type LoginBody = z.infer<typeof loginSchema>
export type RefreshBody = z.infer<typeof refreshSchema>
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>