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
    apiClient.post<void>('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', { refreshToken }),
  me: () => apiClient.get<AuthUserPayload>('/auth/me'),
}
