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
        {error && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            Unable to load attendance metrics. Please refresh the page.
          </div>
        )}

        <AttendanceStatsGrid stats={stats} loading={loading} />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <AttendanceRateTrend />
          </div>
          <div className="col-span-1">
            <AttendanceByGrade />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <TodayAbsentees />
          <RecentCheckIns />
          <div className="md:col-span-2 xl:col-span-1">
            <PendingExcuseRequests />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1">
          <AttendanceAlerts />
        </div>
      </div>
    </>
  )
}