import { apiClient } from '@/lib/apiClient'
import type { StudentUser, SystemUser } from '@/types/user'

export interface StudentFilterParams {
  search?: string
  grade?: string
  class?: string
  status?: string
  gender?: string
  academicYear?: string
}

export interface CreateStudentPayload {
  firstName: string
  lastName: string
  email?: string
  username?: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  phone?: string
  address?: string
  nationality?: string
  studentId: string
  grade: string
  class: string
  academicYear?: string
  enrollmentDate?: string
  status?: 'active' | 'inactive'
  role?: 'student' | 'mazer'
  fatherName?: string
  motherName?: string
  guardianName?: string
  parentPhone?: string
  parentEmail?: string
  relationship?: 'father' | 'mother' | 'guardian' | 'other'
  gpa?: number
  attendanceRate?: number
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {
  id?: string
}

export const studentService = {
  list: async (params?: StudentFilterParams): Promise<StudentUser[]> => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.grade && params.grade !== 'all') query.append('grade', params.grade)
    if (params?.class && params.class !== 'all') query.append('class', params.class)
    if (params?.status && params.status !== 'all') query.append('status', params.status)
    if (params?.gender && params.gender !== 'all') query.append('gender', params.gender)
    if (params?.academicYear && params.academicYear !== 'all') query.append('academicYear', params.academicYear)

    const qs = query.toString() ? `?${query.toString()}` : ''
    try {
      const res = await apiClient.get<StudentUser[]>(`/students${qs}`)
      return res
    } catch {
      // Fallback to /users endpoint if /students not mounted
      const users = await apiClient.get<SystemUser[]>(`/users${qs}`)
      return users.filter((u): u is StudentUser => u.role === 'student' || u.role === 'mazer')
    }
  },

  getById: (id: string) => apiClient.get<StudentUser>(`/students/${id}`),

  create: (payload: CreateStudentPayload) => apiClient.post<StudentUser>('/students', payload),

  update: (id: string, payload: UpdateStudentPayload) => apiClient.patch<StudentUser>(`/students/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/students/${id}`),

}
