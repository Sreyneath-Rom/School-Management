// src/services/gradeLevelService.ts
import { apiClient } from '@/lib/apiClient'

export type GradeLevelStatus = 'Active' | 'Archived'

export interface GradeLevelRecord {
  id: string
  code: string
  name: string
  alias?: string
  levelOrder: number
  minPassingScore: number
  headCoordinator?: string
  maxCapacity: number
  status: GradeLevelStatus
  description?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Create/update payload. `totalClasses`, `enrolledStudents`, and
 * `averageGpa` are omitted because the backend derives them from the
 * related tables and rejects them if sent (they're not in the schema).
 */
export interface GradeLevelPayload {
  code: string
  name: string
  alias?: string
  levelOrder: number
  minPassingScore?: number
  headCoordinator?: string
  maxCapacity?: number
  status?: GradeLevelStatus
  description?: string
}

export interface ListGradeLevelsQuery {
  search?: string
  status?: GradeLevelStatus
  page?: number
  limit?: number
  sortBy?: 'levelOrder' | 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export const gradeLevelService = {
  list: (params?: ListGradeLevelsQuery) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.status) query.set('status', params.status)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<GradeLevelRecord[]>(`/grade-levels${qs}`)
  },

  getById: (id: string) =>
    apiClient.get<GradeLevelRecord>(`/grade-levels/${id}`),

  create: (payload: GradeLevelPayload) =>
    apiClient.post<GradeLevelRecord>('/grade-levels', payload),

  update: (id: string, payload: Partial<GradeLevelPayload>) =>
    apiClient.patch<GradeLevelRecord>(`/grade-levels/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/grade-levels/${id}`),
}