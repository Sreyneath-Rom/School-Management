import { apiClient, ApiError } from '@/lib/apiClient'
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
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      return await apiClient.post<AuthResult>('/auth/login', { email, password })
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(503, 'Unable to connect to the authentication server.', error)
    }
  },
  loginAsRole: async (role: UserRole): Promise<AuthResult> => {
    const emails: Record<string, string> = { admin: 'admin@example.com', teacher: 'teacher@example.com', student: 'student@example.com', parent: 'parent@example.com' }
    return authService.login(emails[role] ?? emails.student, 'password')
  },
  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }).catch(() => {}),
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', { refreshToken }),
  me: () => apiClient.get<AuthUserPayload>('/auth/me'),
}

