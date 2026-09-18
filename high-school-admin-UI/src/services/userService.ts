// src/services/userService.ts
import { apiClient } from '@/lib/apiClient'
import type { CurrentUser, UserRole } from '@/types/user'

/**
 * A single user row as returned by `GET /users`. Matches the
 * `publicUserSelect` projection in the backend's `users.service.ts`.
 *
 * `student` and `teacher` are always present as keys — one is non-null
 * based on the user's role, the other is null.
 */
export interface UserRecord {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  role: { id: string; name: UserRole }
  student: {
    studentCode: string
    dateOfBirth: string | null
    gender: string | null
    enrolledAt: string
    class: { id: string; name: string } | null
  } | null
  teacher: {
    teacherCode: string
    hiredAt: string
    subjects: Array<{ subject: { name: string; department: string } }>
    classesLed: Array<{ name: string }>
  } | null
}

export interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  roleId?: string
  /**
   * Only admin and parent can be created via this endpoint. Teacher and
   * student accounts need their own profile rows and must be created
   * through `POST /teachers` or `POST /students/enroll`.
   */
  role?: 'admin' | 'parent'
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  phone?: string
  roleId?: string
  role?: UserRole
  isActive?: boolean
  status?: 'active' | 'inactive'
}

export interface UserFilterParams {
  search?: string
  role?: UserRole
  status?: 'active' | 'inactive'
  classId?: string
  department?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'email' | 'firstName' | 'lastName' | 'lastLoginAt'
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  items: UserRecord[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const userService = {
  list: (params?: UserFilterParams) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.role) query.set('role', params.role)
    if (params?.status) query.set('status', params.status)
    if (params?.classId) query.set('classId', params.classId)
    if (params?.department) query.set('department', params.department)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<UserListResponse>(`/users${qs}`)
  },

  getById: (id: string) => apiClient.get<UserRecord>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    apiClient.post<UserRecord>('/users', payload),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<UserRecord>(`/users/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),

  /**
   * Admin-triggered password reset. The caller must supply the new
   * password — the backend refuses a missing `newPassword`.
   */
  resetPassword: (id: string, newPassword: string) =>
    apiClient.post<void>(`/users/${id}/reset-password`, { newPassword }),

  bulkStatusUpdate: (ids: string[], status: 'active' | 'inactive') =>
    apiClient.post<{ updated: number }>('/users/bulk-status', { ids, status }),
}

export type { CurrentUser }