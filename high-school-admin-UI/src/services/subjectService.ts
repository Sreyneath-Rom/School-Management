// src/services/subjectService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateSubjectPayload,
  ListSubjectsQuery,
  Subject,
  UpdateSubjectPayload,
} from '@/types/subject'

export type SubjectItem = Subject
export type SubjectTeacher = Subject['teachers'][number]
export type { CreateSubjectPayload, UpdateSubjectPayload }

export const subjectService = {
  list: (params?: ListSubjectsQuery) => {
    const query = new URLSearchParams()
    if (params?.department) query.set('department', params.department)
    if (params?.category) query.set('category', params.category)
    if (params?.search) query.set('search', params.search)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<SubjectItem[]>(`/subjects${qs}`)
  },

  getById: (id: string) => apiClient.get<SubjectItem>(`/subjects/${id}`),

  create: (payload: CreateSubjectPayload) =>
    apiClient.post<SubjectItem>('/subjects', payload),

  update: (id: string, payload: UpdateSubjectPayload) =>
    apiClient.patch<SubjectItem>(`/subjects/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/subjects/${id}`),
}