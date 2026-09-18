// src/services/classService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  ClassRecord,
  CreateClassPayload,
  ListClassesQuery,
  UpdateClassPayload,
} from '@/types/class'

export type { ClassRecord, CreateClassPayload, UpdateClassPayload }

export const classService = {
  list: (params?: ListClassesQuery) => {
    const query = new URLSearchParams()
    if (params?.gradeLevel !== undefined)
      query.set('gradeLevel', String(params.gradeLevel))
    if (params?.search) query.set('search', params.search)
    if (params?.homeroomTeacherId) query.set('homeroomTeacherId', params.homeroomTeacherId)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ClassRecord[]>(`/classes${qs}`)
  },

  getById: (id: string) => apiClient.get<ClassRecord>(`/classes/${id}`),

  create: (payload: CreateClassPayload) =>
    apiClient.post<ClassRecord>('/classes', payload),

  update: (id: string, payload: UpdateClassPayload) =>
    apiClient.patch<ClassRecord>(`/classes/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/classes/${id}`),
}