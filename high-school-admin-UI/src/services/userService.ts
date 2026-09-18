// src/services/userService.ts
import { apiClient } from '@/lib/apiClient'
import type { SystemUser } from '@/types/user'

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  username?: string
  phone?: string
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'mazer'
  status?: 'active' | 'inactive'
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  address?: string
  nationality?: string
  // Role specific
  department?: string
  position?: string
  employeeId?: string
  teacherId?: string
  qualification?: string
  studentId?: string
  grade?: string
  class?: string
  academicYear?: string
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id?: string
}

export interface UserFilterParams {
  search?: string
  role?: string
  status?: string
  grade?: string
  class?: string
  department?: string
  academicYear?: string
}

interface UserListResponse {
  items: SystemUser[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function normalizeUser(record: any): SystemUser {
  const role = (record.role?.name ?? record.role ?? 'student') as SystemUser['role']
  const student = record.student
  const teacher = record.teacher
  const className = student?.class?.name ?? record.class ?? ''
  const common = {
    id: record.id,
    username: record.username ?? record.email,
    email: record.email ?? '',
    status: record.status ?? (record.isActive === false ? 'inactive' : 'active'),
    createdDate: record.createdDate ?? record.createdAt ?? '',
    firstName: record.firstName ?? '', lastName: record.lastName ?? '',
    gender: record.gender ?? 'other', dateOfBirth: record.dateOfBirth ?? '',
    phone: record.phone ?? '', address: record.address ?? '', nationality: record.nationality ?? '',
  }
  if (role === 'teacher') return { ...common, role, teacherId: teacher?.teacherCode ?? record.teacherId ?? '', department: record.department ?? teacher?.subjects?.[0]?.subject?.department ?? 'General', qualification: record.qualification ?? '', hireDate: teacher?.hiredAt ?? '', experienceYears: 0, subjects: teacher?.subjects?.map((item: any) => item.subject?.name).filter(Boolean) ?? [], assignedClasses: teacher?.classesLed?.map((item: any) => item.name) ?? [] } as SystemUser
  if (role === 'admin') return { ...common, role, employeeId: record.employeeId ?? '', department: record.department ?? 'Administration', position: record.position ?? '' } as SystemUser
  return { ...common, role: role === 'mazer' ? 'mazer' : 'student', studentId: student?.studentCode ?? record.studentId ?? '', grade: record.grade ?? '', class: className, academicYear: record.academicYear ?? '', enrollmentDate: student?.enrolledAt ?? '', fatherName: record.fatherName, motherName: record.motherName, guardianName: record.guardianName, parentPhone: record.parentPhone, parentEmail: record.parentEmail, relationship: record.relationship } as SystemUser
}

export const userService = {
  list: (params?: UserFilterParams) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.role && params.role !== 'all') query.append('role', params.role)
    if (params?.status && params.status !== 'all') query.append('status', params.status)
    if (params?.grade && params.grade !== 'all') query.append('grade', params.grade)
    if (params?.class && params.class !== 'all') query.append('class', params.class)
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.academicYear && params.academicYear !== 'all') query.append('academicYear', params.academicYear)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<UserListResponse>(`/users${qs}`).then((response) => response.items.map(normalizeUser))
  },

  getById: async (id: string) => normalizeUser(await apiClient.get<any>(`/users/${id}`)),

  create: async (payload: CreateUserPayload) => normalizeUser(await apiClient.post<any>('/users', payload)),

  update: async (id: string, payload: UpdateUserPayload) => normalizeUser(await apiClient.patch<any>(`/users/${id}`, payload)),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),

  resetPassword: (id: string, newPassword?: string) =>
    apiClient.post<void>(`/users/${id}/reset-password`, {
      newPassword: newPassword || 'Password@123',
    }),

  bulkStatusUpdate: (ids: string[], status: 'active' | 'inactive') =>
    apiClient.post<{ updated: number }>(`/users/bulk-status`, { ids, status }),
}
