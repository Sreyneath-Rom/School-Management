// src/services/scheduleService.ts
import { apiClient } from '@/lib/apiClient'

export interface ScheduleSlot {
  id: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  dayOfWeek: number // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat
  startTime: string // "08:00"
  endTime: string // "09:30"
  room: string
  colorTheme?: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo'
  conflict?: boolean
  conflictReason?: string
}

export interface CreateSchedulePayload {
  classId: string
  className?: string
  subjectId: string
  subjectName?: string
  teacherId: string
  teacherName?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room?: string
  colorTheme?: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo'
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  id?: string
}

export const scheduleService = {
  list: (params?: { classId?: string; teacherId?: string; dayOfWeek?: number }) => {
    const query = new URLSearchParams()
    if (params?.classId) query.append('classId', params.classId)
    if (params?.teacherId) query.append('teacherId', params.teacherId)
    if (params?.dayOfWeek !== undefined) query.append('dayOfWeek', String(params.dayOfWeek))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ScheduleSlot[]>(`/schedules${qs}`)
  },

  getById: (id: string) => apiClient.get<ScheduleSlot>(`/schedules/${id}`),

  create: (payload: CreateSchedulePayload) => apiClient.post<ScheduleSlot>('/schedules', payload),

  update: (id: string, payload: UpdateSchedulePayload) =>
    apiClient.patch<ScheduleSlot>(`/schedules/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/schedules/${id}`),
}
