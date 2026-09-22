// src/services/scheduleService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateSchedulePayload,
  ListSchedulesQuery,
  Schedule,
  UpdateSchedulePayload,
  DayOfWeek,
} from '@/types/schedule'

export type ScheduleSlot = Schedule
export type { CreateSchedulePayload, UpdateSchedulePayload, DayOfWeek }

export const scheduleService = {
  list: (params?: ListSchedulesQuery) => {
    const query = new URLSearchParams()
    if (params?.classId) query.set('classId', params.classId)
    if (params?.teacherId) query.set('teacherId', params.teacherId)
    if (params?.subjectId) query.set('subjectId', params.subjectId)
    if (params?.room) query.set('room', params.room)
    if (params?.dayOfWeek !== undefined)
      query.set('dayOfWeek', String(params.dayOfWeek))
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<ScheduleSlot[]>(`/schedules${qs}`)
  },

  getById: (id: string) => apiClient.get<ScheduleSlot>(`/schedules/${id}`),

  create: (payload: CreateSchedulePayload) =>
    apiClient.post<ScheduleSlot>('/schedules', payload),

  update: (id: string, payload: UpdateSchedulePayload) =>
    apiClient.patch<ScheduleSlot>(`/schedules/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/schedules/${id}`),
}