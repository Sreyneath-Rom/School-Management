import { apiClient } from '@/lib/apiClient'

export interface AcademicYearRecord {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'Active' | 'Upcoming' | 'Archived'
  termsCount: number
  classesCount: number
  studentsCount: number
  isCurrent: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateAcademicYearPayload {
  name: string
  startDate: string
  endDate: string
  termsCount: number
  description?: string
}

export interface UpdateAcademicYearPayload extends Partial<CreateAcademicYearPayload> {
  status?: 'Active' | 'Upcoming' | 'Archived'
  isCurrent?: boolean
}

export const academicYearService = {
  list: async (): Promise<AcademicYearRecord[]> => {
    return apiClient.get<AcademicYearRecord[]>('/academic-years')
  },

  getById: async (id: string): Promise<AcademicYearRecord> => {
    return apiClient.get<AcademicYearRecord>(`/academic-years/${id}`)
  },

  create: async (payload: CreateAcademicYearPayload): Promise<AcademicYearRecord> => {
    return apiClient.post<AcademicYearRecord>('/academic-years', payload)
  },

  update: async (id: string, payload: UpdateAcademicYearPayload): Promise<AcademicYearRecord> => {
    return apiClient.patch<AcademicYearRecord>(`/academic-years/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/academic-years/${id}`)
  },

  setActive: async (id: string): Promise<AcademicYearRecord> => {
    return apiClient.post<AcademicYearRecord>(`/academic-years/${id}/set-active`, {})
  },
}
