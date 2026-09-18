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
  password?: string
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

function normalizeStudent(record: any): StudentUser {
  const user = record.user ?? record
  const role = (record.role ?? user.role?.name ?? 'student') === 'mazer' ? 'mazer' : 'student'
  return {
    id: record.id ?? user.id,
    username: user.username ?? user.email ?? '', email: user.email ?? '',
    status: user.status ?? (user.isActive === false ? 'inactive' : 'active'),
    createdDate: user.createdDate ?? user.createdAt ?? record.createdAt ?? '',
    firstName: user.firstName ?? '', lastName: user.lastName ?? '', gender: record.gender ?? 'other',
    dateOfBirth: record.dateOfBirth ?? '', phone: user.phone ?? '', address: user.address ?? '', nationality: user.nationality ?? '',
    role, studentId: record.studentCode ?? record.studentId ?? record.id ?? '', grade: record.grade ?? '',
    class: record.class?.name ?? record.className ?? record.class ?? '', academicYear: record.academicYear ?? '',
    enrollmentDate: record.enrolledAt ?? record.enrollmentDate ?? record.createdAt ?? '',
  } as StudentUser
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
      const res = await apiClient.get<any[]>(`/students${qs}`)
      return res.map(normalizeStudent)
    } catch (error) {
      // Only use the legacy fallback when the student endpoint is genuinely absent.
      // Auth, validation, and conflict errors must reach the page unchanged.
      if (!(error instanceof Error) || !('status' in error) || (error as { status?: number }).status !== 404) {
        throw error
      }
      const usersResponse = await apiClient.get<{ items: SystemUser[] }>(`/users${qs}`)
      const users = usersResponse.items
      return users.filter((u) => u.role === 'student' || u.role === 'mazer').map(normalizeStudent)
    }
  },

  getById: async (id: string) => normalizeStudent(await apiClient.get<any>(`/students/${id}`)),

  create: async (payload: CreateStudentPayload) => normalizeStudent(await apiClient.post<any>('/students/enroll', payload)),

  update: async (id: string, payload: UpdateStudentPayload) => normalizeStudent(await apiClient.patch<any>(`/students/${id}`, payload)),

  delete: (id: string) => apiClient.delete<void>(`/students/${id}`),

  bulkStatus: (ids: string[], status: 'active' | 'inactive') =>
    apiClient.post<{ updated: number }>('/users/bulk-status', { ids, status }),
}
