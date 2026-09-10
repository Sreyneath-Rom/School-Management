import { apiClient } from '@/lib/apiClient'

export interface ClassRecord {
  id: string
  name: string
  gradeLevel: number
  homeroomTeacherId?: string | null
  homeroomTeacher?: {
    user?: { firstName?: string; lastName?: string }
  } | null
  studentCount?: number
  maxCapacity?: number
  subjectsCount?: number
  schedulePeriod?: string
  status?: 'Active' | 'Archived'
}

export interface CreateClassPayload {
  name: string
  gradeLevel: number
  homeroomTeacherId?: string
}

export const classService = {
  list: (params?: { gradeLevel?: number }) => {
    const query = new URLSearchParams()
    if (params?.gradeLevel !== undefined) query.set('gradeLevel', String(params.gradeLevel))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ClassRecord[]>(`/classes${qs}`)
  },

  getById: (id: string) => apiClient.get<ClassRecord>(`/classes/${id}`),
  create: (payload: CreateClassPayload) => apiClient.post<ClassRecord>('/classes', payload),
  update: (id: string, payload: Partial<CreateClassPayload>) =>
    apiClient.patch<ClassRecord>(`/classes/${id}`, payload),
  delete: (id: string) => apiClient.delete<void>(`/classes/${id}`),
}
