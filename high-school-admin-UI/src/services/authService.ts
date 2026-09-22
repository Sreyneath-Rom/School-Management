// src/services/authService.ts
import { apiClient, ApiError } from '@/lib/apiClient'
import type { CurrentUser, UserRole } from '@/types/user'

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: CurrentUser
}

export const authService = {
  /**
   * The backend accepts `{ email, password }`. The UI historically took an
   * "identifier" that could be an email or username — the backend doesn't
   * have usernames, so we pass it through as `email`.
   */
  login: async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<AuthResult>('/auth/login', {
        email: identifier,
        password,
      })
      if (response?.user?.role) {
        response.user.role = String(response.user.role).toLowerCase() as UserRole
      }
      return response
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(
        503,
        'Unable to connect to authentication server. Please check your connection and try again.',
        error
      )
    }
  },

  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }).catch(() => {}),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken }
    ),

  me: async (): Promise<CurrentUser> => {
    const user = await apiClient.get<CurrentUser>('/auth/me')
    if (user?.role) {
      user.role = String(user.role).toLowerCase() as UserRole
    }
    return user
  },

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<void>('/auth/reset-password', { token, newPassword }),

  /** Dev helper — quick login by role using the seeded demo accounts. */
    loginAs: async (role: UserRole): Promise<AuthResult> => {
    if (import.meta.env.PROD) {
      throw new Error('loginAs is dev-only and disabled in production builds.')
    }
    const emails: Record<UserRole, string> = {
      admin: 'admin@example.com',
      teacher: 'teacher@example.com',
      student: 'student@example.com',
      parent: 'parent@example.com',
      mazer: 'admin@example.com',
    }
    return authService.login(emails[role] ?? emails.admin, 'password')
  },
}