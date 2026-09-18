import { apiClient } from '@/lib/apiClient'

export type GradeLevelStatus = 'Active' | 'Archived'

export interface GradeLevelRecord {
  id: string
  code: string
  name: string
  alias: string
  levelOrder: number
  minPassingScore: number
  headCoordinator: string
  totalClasses: number
  enrolledStudents: number
  maxCapacity: number
  averageGpa: number
  status: GradeLevelStatus
  description: string
  createdAt?: string
  updatedAt?: string
}

export type GradeLevelPayload = Omit<GradeLevelRecord, 'id' | 'createdAt' | 'updatedAt'>

export const gradeLevelService = {
  list: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.status && params.status !== 'All') query.set('status', params.status)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<GradeLevelRecord[]>(`/grade-levels${qs}`)
  },
  getById: (id: string) => apiClient.get<GradeLevelRecord>(`/grade-levels/${id}`),
  create: (payload: GradeLevelPayload) => apiClient.post<GradeLevelRecord>('/grade-levels', payload),
  update: (id: string, payload: Partial<GradeLevelPayload>) => apiClient.patch<GradeLevelRecord>(`/grade-levels/${id}`, payload),
  delete: (id: string) => apiClient.delete<void>(`/grade-levels/${id}`),
}
