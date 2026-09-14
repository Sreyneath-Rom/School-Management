// src/services/authService.ts
import { apiClient } from '@/lib/apiClient'
import type { UserRole } from '@/utils/rolePermissions'

export interface AuthUserPayload {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: AuthUserPayload
}

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResult>('/auth/login', { email, password }),

  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }).catch(() => {}),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken },
    ),

    me: () => apiClient.get<AuthUserPayload>('/auth/me'),

  /**
   * Dev helper — quick login by role using the seeded demo accounts.
   * Backend must have admin@example.com / teacher@example.com etc. seeded.
   * Real production login should go through the credentials form.
   */
  loginAs: (role: UserRole) => {
    const creds: Record<string, { email: string; password: string }> = {
      admin:   { email: 'admin@example.com',   password: 'password' },
      teacher: { email: 'teacher@example.com', password: 'password' },
      student: { email: 'student@example.com', password: 'password' },
      parent:  { email: 'parent@example.com',  password: 'password' },
    }
    const c = creds[role] ?? creds.admin
    return apiClient.post<AuthResult>('/auth/login', { email: c.email, password: c.password })
  },

}