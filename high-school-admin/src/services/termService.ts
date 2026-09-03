import { apiClient } from '@/lib/apiClient'

export interface TermRecord {
  id: string
  name: string
  academicYearId?: string
  academicYear: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  examCount: number
  weightPercentage: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateTermPayload {
  name: string
  academicYear: string
  academicYearId?: string
  startDate: string
  endDate: string
  gradingDeadline: string
  weightPercentage: number
  description?: string
}

export interface UpdateTermPayload extends Partial<CreateTermPayload> {
  status?: 'Active' | 'Completed' | 'Upcoming'
  examCount?: number
}

export const termService = {
  list: async (academicYear?: string): Promise<TermRecord[]> => {
    const qs = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : ''
    return apiClient.get<TermRecord[]>(`/terms${qs}`)
  },

  getById: async (id: string): Promise<TermRecord> => {
    return apiClient.get<TermRecord>(`/terms/${id}`)
  },

  create: async (payload: CreateTermPayload): Promise<TermRecord> => {
    return apiClient.post<TermRecord>('/terms', payload)
  },

  update: async (id: string, payload: UpdateTermPayload): Promise<TermRecord> => {
    return apiClient.patch<TermRecord>(`/terms/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/terms/${id}`)
  },

  setActive: async (id: string): Promise<TermRecord> => {
    return apiClient.post<TermRecord>(`/terms/${id}/set-active`, {})
  },
}
