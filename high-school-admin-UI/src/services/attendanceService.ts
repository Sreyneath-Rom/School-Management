// src/services/attendanceService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  AttendanceListRow,
  AttendanceStats,
  AttendanceStatus,
  BulkMarkPayload,
  CheckInPayload,
  UpdateAttendancePayload,
} from '@/types/attendance'

export type {
  AttendanceListRow as AttendanceRecord,
  AttendanceStats,
  AttendanceStatus,
  BulkMarkPayload,
}

export interface AttendanceFilterParams {
  date?: string
  studentId?: string
  classId?: string
  from?: string
  to?: string
}

export const attendanceService = {
  list: (params?: AttendanceFilterParams) => {
    const query = new URLSearchParams()
    if (params?.date) query.set('date', params.date)
    if (params?.studentId) query.set('studentId', params.studentId)
    if (params?.classId) query.set('classId', params.classId)
    if (params?.from) query.set('from', params.from)
    if (params?.to) query.set('to', params.to)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<AttendanceListRow[]>(`/attendance${qs}`)
  },

  getStats: (date?: string) => {
    const qs = date ? `?date=${encodeURIComponent(date)}` : ''
    return apiClient.get<AttendanceStats>(`/attendance/stats${qs}`)
  },

  checkIn: (payload: CheckInPayload) =>
    apiClient.post<AttendanceListRow>('/attendance/check-in', payload),

  bulkMark: (payload: BulkMarkPayload) =>
    apiClient.post<{ count: number; records: AttendanceListRow[] }>(
      '/attendance/bulk',
      payload
    ),

  checkOut: (studentId: string, date: string, checkOut?: string) =>
    apiClient.post<AttendanceListRow>('/attendance/check-out', {
      studentId,
      date,
      checkOut,
    }),

  update: (id: string, payload: UpdateAttendancePayload) =>
    apiClient.patch<AttendanceListRow>(`/attendance/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/attendance/${id}`),
}