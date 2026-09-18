// src/services/termService.ts
import { apiClient } from '@/lib/apiClient'

export interface TermRecord {
  id: string
  name: string
  academicYearId: string
  academicYear: { id: string; name: string; isCurrent?: boolean }
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  weightPercentage: number
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface TermPayload {
  name: string
  academicYearId: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: TermRecord['status']
  weightPercentage: number
  description?: string
}

export interface ListTermsQuery {
  academicYearId?: string
  status?: TermRecord['status']
}

export const termService = {
  list: (params?: ListTermsQuery) => {
    const query = new URLSearchParams()
    if (params?.academicYearId) query.set('academicYearId', params.academicYearId)
    if (params?.status) query.set('status', params.status)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<TermRecord[]>(`/terms${qs}`)
  },

  getById: (id: string) => apiClient.get<TermRecord>(`/terms/${id}`),

  create: (payload: TermPayload) =>
    apiClient.post<TermRecord>('/terms', payload),

  update: (id: string, payload: Partial<TermPayload>) =>
    apiClient.patch<TermRecord>(`/terms/${id}`, payload),

  setActive: (id: string) =>
    apiClient.post<TermRecord>(`/terms/${id}/active`),

  delete: (id: string) => apiClient.delete<void>(`/terms/${id}`),
}