// src/services/dashboardService.ts
import { apiClient } from '@/lib/apiClient'
import type { AttendanceStats } from '@/types/attendance'

export interface DashboardStats {
  cohort?: string
  studentCount: number
  teacherCount: number
  classCount: number
  pendingLeaveRequests: number
}

export type Cohort = 'all' | 'lower-secondary' | 'upper-secondary'

export const dashboardService = {
  getStats: (cohort?: Cohort) =>
    apiClient.get<DashboardStats>(
      `/dashboard/stats${cohort ? `?cohort=${encodeURIComponent(cohort)}` : ''}`
    ),

  getAttendanceSummary: (from?: string, to?: string) => {
    const query = new URLSearchParams()
    if (from) query.set('from', from)
    if (to) query.set('to', to)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<AttendanceStats>(`/dashboard/attendance-summary${qs}`)
  },
}