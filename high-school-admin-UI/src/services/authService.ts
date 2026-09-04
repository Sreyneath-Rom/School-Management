import { apiClient, ApiError } from '@/lib/apiClient'
import type { UserRole } from '@/utils/rolePermissions'
import { mockLogin, mockUsers } from '@/data/mockUsers'

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

      // Fallback to local mock data for client-side demo and offline resilience
      const matched = mockLogin(email, password)
      if (matched) {
        return {
          accessToken: `mock-token-${matched.id}-${Date.now()}`,
          refreshToken: `mock-refresh-${matched.id}-${Date.now()}`,
          user: {
            id: matched.id,
            email: matched.email,
            firstName: matched.firstName,
            lastName: matched.name.replace(matched.firstName, '').trim() || matched.role,
            role: matched.role,
          },
        }
      }
      throw error
    }
  },
  loginAsRole: (role: UserRole): AuthResult => {
    const matched = mockUsers.find((u) => u.role === role) ?? mockUsers[0]
    return {
      accessToken: `mock-token-${matched.id}-${Date.now()}`,
      refreshToken: `mock-refresh-${matched.id}-${Date.now()}`,
      user: {
        id: matched.id,
        email: matched.email,
        firstName: matched.firstName,
        lastName: matched.name.replace(matched.firstName, '').trim() || matched.role,
        role: matched.role,
      },
    }
  },
  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }).catch(() => {}),
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', { refreshToken }),
  me: () => apiClient.get<AuthUserPayload>('/auth/me'),
}

