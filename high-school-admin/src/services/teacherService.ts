import { apiClient } from '@/lib/apiClient'

export interface TeacherRecord {
  id: string
  teacherId: string // e.g. "TCH-1001" or "FAC-SCI-01"
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position?: string
  qualification: string
  specialization?: string
  experienceYears?: number
  hireDate: string
  weeklyTeachingHours?: number
  status: 'active' | 'on_leave' | 'inactive'
  subjects: string[]
  assignedClasses: string[]
  avatarUrl?: string
  performanceRating?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateTeacherPayload {
  teacherId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  qualification: string
  specialization?: string
  hireDate: string
  weeklyTeachingHours?: number
  subjects: string[]
  assignedClasses: string[]
  status?: 'active' | 'on_leave' | 'inactive'
  position?: string
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  performanceRating?: number
}

export const teacherService = {
  list: async (params?: { department?: string; search?: string; status?: string }): Promise<TeacherRecord[]> => {
    const query = new URLSearchParams()
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.status && params.status !== 'all') query.append('status', params.status)
    if (params?.search) query.append('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<TeacherRecord[]>(`/teachers${qs}`)
  },

  getById: async (id: string): Promise<TeacherRecord> => {
    return apiClient.get<TeacherRecord>(`/teachers/${id}`)
  },

  create: async (payload: CreateTeacherPayload): Promise<TeacherRecord> => {
    return apiClient.post<TeacherRecord>('/teachers', payload)
  },

  update: async (id: string, payload: UpdateTeacherPayload): Promise<TeacherRecord> => {
    return apiClient.patch<TeacherRecord>(`/teachers/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/teachers/${id}`)
  },
}
