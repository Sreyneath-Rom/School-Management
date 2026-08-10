import PageHeading from '@/components/common/PageHeading'
import AttendanceStatsGrid from '@/features/attendance/AttendanceStatsGrid'
import AttendanceRateTrend from '@/features/attendance/AttendanceRateTrend'
import AttendanceByGrade from '@/features/attendance/AttendanceByGrade'
import TodayAbsentees from '@/features/attendance/TodayAbsentees'
import RecentCheckIns from '@/features/attendance/RecentCheckIns'
import PendingExcuseRequests from '@/features/attendance/PendingExcuseRequests'
import AttendanceAlerts from '@/features/attendance/AttendanceAlerts'
import { useFetch } from '@/hooks/useFetch'
import { attendanceService, type AttendanceStats } from '@/services/attendanceService'

export default function Attendance() {
  const { data: stats, loading, error } = useFetch<AttendanceStats>(attendanceService.getStats)

  return (
    <>
      <PageHeading
        title="Attendance Overview"
        subtitle="Track daily check-ins, absences, and attendance trends across the school."
      />

      <div className="mt-6 space-y-6">
        {loading && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-stone-600">Loading attendance metrics...</div>
        )}

        {error && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            Unable to load attendance metrics. Please refresh the page.
          </div>
        )}

        <AttendanceStatsGrid stats={stats} />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <AttendanceRateTrend />
          <AttendanceByGrade />
          <TodayAbsentees />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <RecentCheckIns />
          <PendingExcuseRequests />
          <AttendanceAlerts />
        </div>
      </div>
    </>
  )
}