// src/services/userService.ts
import { apiClient } from '@/lib/apiClient'
import type { SystemUser } from '@/types/user'

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  username?: string
  phone?: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
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
    return apiClient.get<SystemUser[]>(`/users${qs}`)
  },

  getById: (id: string) => apiClient.get<SystemUser>(`/users/${id}`),

  create: (payload: CreateUserPayload) => apiClient.post<SystemUser>('/users', payload),

  update: (id: string, payload: UpdateUserPayload) => apiClient.patch<SystemUser>(`/users/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),

  resetPassword: (id: string, newPassword?: string) =>
    apiClient.post<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
      newPassword: newPassword || 'Password@123',
    }),

  bulkStatusUpdate: (ids: string[], status: 'active' | 'inactive') =>
    apiClient.post<{ updated: number }>(`/users/bulk-status`, { ids, status }),
}
