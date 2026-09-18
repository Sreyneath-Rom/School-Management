import { apiClient } from '@/lib/apiClient'

export interface DashboardStats {
  studentCount: number
  teacherCount: number
  classCount: number
  pendingLeaveRequests: number
}

export type AttendanceSummary = Array<{ status: string; _count: number }>

export const dashboardService = {
  getStats: (cohort?: string) => apiClient.get<DashboardStats>(`/dashboard/stats${cohort ? `?cohort=${encodeURIComponent(cohort)}` : ''}`),
  getAttendanceSummary: (from?: string, to?: string) =>
    apiClient.get<AttendanceSummary>(
      `/dashboard/attendance-summary${from || to ? `?from=${encodeURIComponent(from ?? '')}&to=${encodeURIComponent(to ?? '')}` : ''}`
    ),
}
