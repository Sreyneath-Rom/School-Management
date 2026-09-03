import { apiClient } from '@/lib/apiClient'

export interface GradeLevelRecord {
  id: string
  name: string // e.g. "Grade 10"
  numericLevel: number // 10
  division: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'High School'
  minAge: number
  maxAge: number
  requiredCredits: number
  description?: string
  classesCount: number
  studentsCount: number
  status: 'Active' | 'Archived'
  createdAt?: string
  updatedAt?: string
}

export interface CreateGradeLevelPayload {
  name: string
  numericLevel: number
  division: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'High School'
  minAge: number
  maxAge: number
  requiredCredits: number
  description?: string
}

export interface UpdateGradeLevelPayload extends Partial<CreateGradeLevelPayload> {
  status?: 'Active' | 'Archived'
}

export const gradeLevelService = {
  list: async (): Promise<GradeLevelRecord[]> => {
    return apiClient.get<GradeLevelRecord[]>('/grade-levels')
  },

  getById: async (id: string): Promise<GradeLevelRecord> => {
    return apiClient.get<GradeLevelRecord>(`/grade-levels/${id}`)
  },

  create: async (payload: CreateGradeLevelPayload): Promise<GradeLevelRecord> => {
    return apiClient.post<GradeLevelRecord>('/grade-levels', payload)
  },

  update: async (id: string, payload: UpdateGradeLevelPayload): Promise<GradeLevelRecord> => {
    return apiClient.patch<GradeLevelRecord>(`/grade-levels/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/grade-levels/${id}`)
  },
}
