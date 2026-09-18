import { apiClient } from '@/lib/apiClient'

export interface TermRecord {
  id: string
  name: string
  academicYearId: string
  academicYear: { id: string; name: string }
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  examCount: number
  weightPercentage: number
  description?: string | null
}

export interface TermPayload {
  name: string
  academicYearId: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: TermRecord['status']
  examCount?: number
  weightPercentage: number
  description?: string
}

export const termService = {
  list: (academicYearId: string) => apiClient.get<TermRecord[]>(`/terms?academicYearId=${encodeURIComponent(academicYearId)}`),
  getById: (id: string) => apiClient.get<TermRecord>(`/terms/${id}`),
  create: (payload: TermPayload) => apiClient.post<TermRecord>('/terms', payload),
  update: (id: string, payload: Partial<TermPayload>) => apiClient.patch<TermRecord>(`/terms/${id}`, payload),
  setActive: (id: string) => apiClient.post<TermRecord>(`/terms/${id}/active`),
  delete: (id: string) => apiClient.delete<void>(`/terms/${id}`),
}
