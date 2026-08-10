export type AttendanceStats = {
  presentToday: number
  absentToday: number
  lateToday: number
  attendanceRate: number
  pendingExcuses: number
  perfectAttendanceCount: number
}

// Mirrors `dashboardService`'s `getAttendanceSummary` — a status breakdown
// with Prisma-style `_count` grouping, consumed by `AttendanceRateTrend`
// the same way `AttendanceChart` consumes `AttendanceSummary`.
export type AttendanceStatusBreakdown = Array<{ status: string; _count: number }>

export const attendanceService = {
  // Replace with a real API call, e.g. `apiClient.get('/attendance/stats')`.
  async getStats(): Promise<AttendanceStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          presentToday: 842,
          absentToday: 37,
          lateToday: 14,
          attendanceRate: 95.2,
          pendingExcuses: 6,
          perfectAttendanceCount: 128,
        })
      }, 400)
    })
  },

  // Replace with a real API call, e.g. `apiClient.get('/attendance/status-breakdown')`.
  async getStatusBreakdown(): Promise<AttendanceStatusBreakdown> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { status: 'Present', _count: 842 },
          { status: 'Absent', _count: 37 },
          { status: 'Late', _count: 14 },
        ])
      }, 400)
    })
  },
}