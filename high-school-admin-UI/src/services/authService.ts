// src/services/authService.ts
import { apiClient, ApiError } from '@/lib/apiClient'
import type { UserRole } from '@/utils/rolePermissions'

export interface AuthUserPayload {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status?: string
  permissionKeys?: string[]
}

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: AuthUserPayload
}

export const authService = {
  login: async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<AuthResult>('/auth/login', {
        identifier,
        email: identifier,
        password,
      })
      // Normalize role to lowercase
      if (response && response.user) {
        response.user.role = (String(response.user.role || '').toLowerCase()) as UserRole
      }
      return response
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      // If network unreachable or unexpected error
      throw new ApiError(503, 'Unable to connect to authentication server. Please check your connection and try again.', error)
    }
  },

  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }).catch(() => {}),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken },
    ),

  me: async (): Promise<AuthUserPayload> => {
    const user = await apiClient.get<AuthUserPayload>('/auth/me')
    if (user && user.role) {
      user.role = (String(user.role).toLowerCase()) as UserRole
    }
    return user
  },

  forgotPassword: (identifier: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { identifier }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { token, newPassword }),

  /**
   * Dev helper — quick login by role using seeded demo accounts.
   * Provides immediate synchronous session credentials for demo and offline use.
   */
  loginAs: async (role: UserRole): Promise<AuthResult> => {
    const emails: Record<string, string> = {
      admin: 'admin@example.com',
      teacher: 'teacher@example.com',
      student: 'student@example.com',
      parent: 'parent@example.com',
    }
    return authService.login(emails[role] ?? emails.admin, 'password')
  },
}