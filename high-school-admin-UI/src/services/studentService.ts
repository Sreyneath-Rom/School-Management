// src/services/studentService.ts
import { apiClient } from '@/lib/apiClient'
import type { StudentProfile, StudentProfileView } from '@/types/studentProfile'
import { toStudentProfileView } from '@/types/studentProfile'
import type { Gender } from '@/types/user'

export interface StudentFilterParams {
  search?: string
  classId?: string
  className?: string
  status?: 'active' | 'inactive'
  gender?: Gender
  page?: number
  limit?: number
}

export interface CreateStudentPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  studentCode: string
  dateOfBirth?: string
  gender?: Gender
  classId?: string
  className?: string
}

export interface UpdateStudentPayload {
  studentCode?: string
  dateOfBirth?: string
  gender?: Gender
  classId?: string
  className?: string
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  status?: 'active' | 'inactive'
}

export const studentService = {
  list: (params?: StudentFilterParams) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.classId) query.set('classId', params.classId)
    if (params?.className) query.set('className', params.className)
    if (params?.status) query.set('status', params.status)
    if (params?.gender) query.set('gender', params.gender)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<StudentProfileView[]>(`/students${qs}`)
  },

  getById: async (id: string): Promise<StudentProfileView> => {
    const profile = await apiClient.get<StudentProfile>(`/students/${id}/profile`)
    return toStudentProfileView(profile)
  },

  /**
   * Enroll — creates the User and Student profile in one call. The backend
   * endpoint is POST /students/enroll.
   */
  create: async (payload: CreateStudentPayload): Promise<StudentProfileView> => {
    const profile = await apiClient.post<StudentProfile>('/students/enroll', payload)
    return toStudentProfileView(profile)
  },

  update: async (
    id: string,
    payload: UpdateStudentPayload
  ): Promise<StudentProfileView> => {
    const profile = await apiClient.patch<StudentProfile>(`/students/${id}`, payload)
    return toStudentProfileView(profile)
  },

  delete: (id: string) => apiClient.delete<void>(`/students/${id}`),

  /** Bulk enable/disable via the shared users endpoint. */
  bulkStatus: (ids: string[], status: 'active' | 'inactive') =>
    apiClient.post<{ updated: number }>('/users/bulk-status', { ids, status }),
}