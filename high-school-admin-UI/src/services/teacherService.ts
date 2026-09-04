import { apiClient } from '@/lib/apiClient'

export interface TeacherRecord {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  name?: string
  title?: string
  avatarUrl?: string
  email: string
  phone: string
  department: string
  position?: string
  qualifications: string
  specialization: string
  weeklyTeachingHours: number
  assignedClasses: string[]
  subjectsTaught: string[]
  performanceRating: number
  joiningDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
  createdAt?: string
  updatedAt?: string
}

export interface TeacherFilterParams {
  search?: string
  department?: string
  status?: string
}

export interface CreateTeacherPayload {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position?: string
  qualifications: string
  specialization: string
  weeklyTeachingHours: number
  assignedClasses: string[]
  subjectsTaught: string[]
  status?: 'Active' | 'On Leave' | 'Inactive'
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  id?: string
}

export const teacherService = {
  list: async (params?: TeacherFilterParams): Promise<TeacherRecord[]> => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.status && params.status !== 'all') query.append('status', params.status)

    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<TeacherRecord[]>(`/teachers${qs}`)
  },

  getById: (id: string) => apiClient.get<TeacherRecord>(`/teachers/${id}`),

  create: (payload: CreateTeacherPayload) => apiClient.post<TeacherRecord>('/teachers', payload),

  update: (id: string, payload: UpdateTeacherPayload) =>
    apiClient.patch<TeacherRecord>(`/teachers/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/teachers/${id}`),
}
