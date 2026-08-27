// src/services/subjectService.ts
import { apiClient } from '@/lib/apiClient'

export interface SubjectTeacher {
  id: string
  name: string
  label: string
  color: string
}

export interface SubjectItem {
  id: string
  name: string
  code: string
  department: string
  category: 'Core' | 'Elective' | 'AP / Advanced'
  credits: number
  weeklyHours: number
  gradeLevel: string
  description?: string
  color?: string
  teachers: SubjectTeacher[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateSubjectPayload {
  name: string
  code: string
  department: string
  category: 'Core' | 'Elective' | 'AP / Advanced'
  credits?: number
  weeklyHours?: number
  gradeLevel?: string
  description?: string
  teachers?: string[]
}

export interface UpdateSubjectPayload extends Partial<CreateSubjectPayload> {
  id?: string
}

export const subjectService = {
  list: (params?: { department?: string; category?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.department && params.department !== 'All') query.append('department', params.department)
    if (params?.category && params.category !== 'All') query.append('category', params.category)
    if (params?.search) query.append('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<SubjectItem[]>(`/subjects${qs}`)
  },

  getById: (id: string) => apiClient.get<SubjectItem>(`/subjects/${id}`),

  create: (payload: CreateSubjectPayload) => apiClient.post<SubjectItem>('/subjects', payload),

  update: (id: string, payload: UpdateSubjectPayload) => apiClient.patch<SubjectItem>(`/subjects/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/subjects/${id}`),
}
