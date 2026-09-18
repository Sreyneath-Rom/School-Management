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
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface AcademicYearPayload {
  name: string
  startDate: string
  endDate: string
  status: AcademicYearRecord['status']
  termsCount: number
  classesCount?: number
  studentsCount?: number
  description?: string
}

export const academicYearService = {
  list: () => apiClient.get<AcademicYearRecord[]>('/academic-years'),
  getById: (id: string) => apiClient.get<AcademicYearRecord>(`/academic-years/${id}`),
  create: (payload: AcademicYearPayload) => apiClient.post<AcademicYearRecord>('/academic-years', payload),
  update: (id: string, payload: Partial<AcademicYearPayload>) => apiClient.patch<AcademicYearRecord>(`/academic-years/${id}`, payload),
  setCurrent: (id: string) => apiClient.post<AcademicYearRecord>(`/academic-years/${id}/current`),
  delete: (id: string) => apiClient.delete<void>(`/academic-years/${id}`),
}
