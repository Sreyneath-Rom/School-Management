import { apiClient } from '@/lib/apiClient'

export interface TeacherRecord {
  id: string
  teacherId: string // e.g. "TCH-1001" or "FAC-SCI-01"
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position?: string
  qualification: string
  specialization?: string
  experienceYears?: number
  hireDate: string
  weeklyTeachingHours?: number
  status: 'active' | 'on_leave' | 'inactive'
  subjects: string[]
  assignedClasses: string[]
  avatarUrl?: string
  performanceRating?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateTeacherPayload {
  teacherId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  qualification: string
  specialization?: string
  hireDate: string
  weeklyTeachingHours?: number
  subjects: string[]
  assignedClasses: string[]
  status?: 'active' | 'on_leave' | 'inactive'
  position?: string
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  performanceRating?: number
}

interface ApiTeacher {
  id: string
  teacherCode: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatarUrl?: string | null
  }
  subjects?: Array<{ subject?: { name?: string } }>
  classesLed?: Array<{ name?: string; id?: string }>
}

const normalizeTeacher = (teacher: ApiTeacher): TeacherRecord => ({
  id: teacher.id,
  teacherId: teacher.teacherCode,
  firstName: teacher.user?.firstName ?? '',
  lastName: teacher.user?.lastName ?? '',
  email: teacher.user?.email ?? '',
  phone: '',
  department: '',
  qualification: '',
  hireDate: '',
  status: 'active',
  subjects: (teacher.subjects ?? []).map((item) => item.subject?.name ?? '').filter(Boolean),
  assignedClasses: (teacher.classesLed ?? []).map((item) => item.name ?? item.id ?? '').filter(Boolean),
  avatarUrl: teacher.user?.avatarUrl ?? undefined,
})

export const teacherService = {
  list: async (params?: { department?: string; search?: string; status?: string }): Promise<TeacherRecord[]> => {
    const query = new URLSearchParams()
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.status && params.status !== 'all') query.append('status', params.status)
    if (params?.search) query.append('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ApiTeacher[]>(`/teachers${qs}`).then((teachers) => teachers.map(normalizeTeacher))
  },

  getById: async (id: string): Promise<TeacherRecord> => {
    return apiClient.get<ApiTeacher>(`/teachers/${id}`).then(normalizeTeacher)
  },

  create: async (payload: CreateTeacherPayload): Promise<TeacherRecord> => {
    return apiClient.post<TeacherRecord>('/teachers', payload)
  },

  update: async (id: string, payload: UpdateTeacherPayload): Promise<TeacherRecord> => {
    return apiClient.patch<TeacherRecord>(`/teachers/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/teachers/${id}`)
  },
}
