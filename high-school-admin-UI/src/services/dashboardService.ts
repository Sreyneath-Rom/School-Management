import { apiClient } from '@/lib/apiClient'

export interface DashboardStats {
  studentCount: number
  teacherCount: number
  classCount: number
  pendingLeaveRequests: number
}

export type AttendanceSummary = Array<{ status: string; _count: number }>

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
  getAttendanceSummary: (from?: string, to?: string) =>
    apiClient.get<AttendanceSummary>(
      `/dashboard/attendance-summary${from || to ? `?from=${encodeURIComponent(from ?? '')}&to=${encodeURIComponent(to ?? '')}` : ''}`
    ),
}
