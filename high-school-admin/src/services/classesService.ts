import { apiClient } from '@/lib/apiClient'

export interface ClassRecord {
  id: string
  name: string
  gradeLevel: string
  section: string
  room: string
  classTeacher: string
  studentCount: number
  maxCapacity: number
  subjectsCount: number
  schedulePeriod?: string
  description?: string
  status?: 'Active' | 'Archived'
  createdAt?: string
  updatedAt?: string
}

export interface CreateClassPayload {
  name: string
  gradeLevel: string
  section: string
  room: string
  classTeacher: string
  maxCapacity: number
  schedulePeriod?: string
  description?: string
}

export interface UpdateClassPayload extends Partial<CreateClassPayload> {
  studentCount?: number
  subjectsCount?: number
  status?: 'Active' | 'Archived'
}

export const classesService = {
  list: async (params?: { gradeLevel?: string; search?: string }): Promise<ClassRecord[]> => {
    const query = new URLSearchParams()
    if (params?.gradeLevel && params.gradeLevel !== 'All') query.append('gradeLevel', params.gradeLevel)
    if (params?.search) query.append('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ClassRecord[]>(`/classes${qs}`)
  },

  getById: async (id: string): Promise<ClassRecord> => {
    return apiClient.get<ClassRecord>(`/classes/${id}`)
  },

  create: async (payload: CreateClassPayload): Promise<ClassRecord> => {
    return apiClient.post<ClassRecord>('/classes', payload)
  },

  update: async (id: string, payload: UpdateClassPayload): Promise<ClassRecord> => {
    return apiClient.patch<ClassRecord>(`/classes/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/classes/${id}`)
  },
}
