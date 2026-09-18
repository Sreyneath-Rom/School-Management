import { apiClient } from '@/lib/apiClient'

export interface TeacherRecord {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  name?: string
  title?: string
  avatarUrl?: string
  email: string
  phone: string
  department: string
  position?: string
  qualifications: string
  specialization: string
  weeklyTeachingHours: number
  assignedClasses: string[]
  subjectsTaught: string[]
  performanceRating: number
  joiningDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
  createdAt?: string
  updatedAt?: string
}

export interface TeacherFilterParams {
  search?: string
  department?: string
  status?: string
}

export interface CreateTeacherPayload {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position?: string
  qualifications: string
  specialization: string
  weeklyTeachingHours: number
  assignedClasses: string[]
  subjectsTaught: string[]
  status?: 'Active' | 'On Leave' | 'Inactive'
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  id?: string
}

function normalizeTeacher(record: any): TeacherRecord {
  const subjects = Array.isArray(record.subjects) ? record.subjects : []
  const subjectRecords = subjects.map((entry: any) => entry.subject ?? entry).filter(Boolean)
  const department = record.department ?? subjectRecords[0]?.department ?? 'General'

  return {
    id: record.id,
    employeeId: record.employeeId ?? record.teacherCode ?? record.id,
    firstName: record.firstName ?? record.user?.firstName ?? '',
    lastName: record.lastName ?? record.user?.lastName ?? '',
    name: record.name ?? [record.user?.firstName, record.user?.lastName].filter(Boolean).join(' '),
    title: record.title ?? '',
    avatarUrl: record.avatarUrl ?? record.user?.avatarUrl ?? undefined,
    email: record.email ?? record.user?.email ?? '',
    phone: record.phone ?? '',
    department,
    position: record.position ?? '',
    qualifications: record.qualifications ?? '',
    specialization: record.specialization ?? subjectRecords.map((subject: any) => subject.name).join(', '),
    weeklyTeachingHours: record.weeklyTeachingHours ?? 0,
    assignedClasses: record.assignedClasses ?? record.classesLed?.map((item: any) => item.name) ?? [],
    subjectsTaught: record.subjectsTaught ?? subjectRecords.map((subject: any) => subject.name),
    performanceRating: record.performanceRating ?? 0,
    joiningDate: record.joiningDate ?? record.hiredAt ?? record.createdAt ?? '',
    status: record.status ?? (record.user?.isActive === false ? 'Inactive' : 'Active'),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

export const teacherService = {
  list: async (params?: TeacherFilterParams): Promise<TeacherRecord[]> => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.department && params.department !== 'all') query.append('department', params.department)
    if (params?.status && params.status !== 'all') query.append('status', params.status)

    const qs = query.toString() ? `?${query.toString()}` : ''
    const records = await apiClient.get<any[]>(`/teachers${qs}`)
    return records.map(normalizeTeacher)
  },

  getById: async (id: string) => normalizeTeacher(await apiClient.get<any>(`/teachers/${id}`)),

  create: async (payload: CreateTeacherPayload) => normalizeTeacher(await apiClient.post<any>('/teachers', payload)),

  update: async (id: string, payload: UpdateTeacherPayload) =>
    normalizeTeacher(await apiClient.patch<any>(`/teachers/${id}`, payload)),

  delete: (id: string) => apiClient.delete<void>(`/teachers/${id}`),
}
