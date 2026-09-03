// src/services/userService.ts
import { apiClient } from '@/lib/apiClient'
import type { SystemUser } from '@/types/user'

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  roleId: string
  username?: string
  phone?: string
  role: 'admin' | 'teacher' | 'student' | 'mazer'
  status?: 'active' | 'inactive'
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  address?: string
  nationality?: string
  // Role specific
  department?: string
  position?: string
  employeeId?: string
  teacherId?: string
  qualification?: string
  studentId?: string
  grade?: string
  class?: string
  academicYear?: string
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id?: string
}

export interface UserFilterParams {
  search?: string
  role?: string
  status?: string
  grade?: string
  class?: string
  department?: string
  academicYear?: string
}

interface ApiUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  isActive?: boolean
  status?: 'active' | 'inactive'
  createdAt?: string
  createdDate?: string
  role: { id: string; name: string } | string
}

const normalizeUser = (user: ApiUser): SystemUser => ({
  ...user,
  username: user.email,
  status: user.isActive === undefined ? user.status ?? 'active' : user.isActive ? 'active' : 'inactive',
  createdDate: user.createdAt ?? user.createdDate ?? new Date().toISOString(),
  gender: 'other',
  dateOfBirth: '',
  phone: user.phone ?? '',
  address: '',
  nationality: '',
  role: (typeof user.role === 'string' ? user.role : user.role.name) as SystemUser['role'],
} as SystemUser)

export const userService = {
  list: (params?: UserFilterParams) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.role && params.role !== 'all') query.append('role', params.role)
    if (params?.status && params.status !== 'all') query.append('status', params.status)
    if (params?.grade && params.grade !== 'all') query.append('grade', params.grade)
    if (params?.class && params.class !== 'all') query.append('class', params.class)
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.academicYear && params.academicYear !== 'all') query.append('academicYear', params.academicYear)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ApiUser[]>(`/users${qs}`).then((users) => users.map(normalizeUser))
  },

  getById: (id: string) => apiClient.get<ApiUser>(`/users/${id}`).then(normalizeUser),

  create: (payload: CreateUserPayload) =>
    apiClient.post<ApiUser>('/users', {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      roleId: payload.roleId,
    }).then(normalizeUser),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<ApiUser>(`/users/${id}`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      roleId: payload.roleId,
      isActive: payload.status ? payload.status === 'active' : undefined,
    }).then(normalizeUser),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),

  resetPassword: (id: string, newPassword?: string): Promise<void> =>
    apiClient.post<void>(`/users/${id}/reset-password`, {
      newPassword: newPassword || 'Password@123',
    }),
}
