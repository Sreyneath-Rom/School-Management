import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/charts/AttendanceChart'
import EnrollmentDonut from '@/components/charts/EnrollmentDonut'
import UpcomingEvents from '@/features/dashboard/UpcomingEvents'
import RecentActivities from '@/features/dashboard/RecentActivities'
import RecentLeaveRequests from '@/features/dashboard/RecentLeaveRequests'
import Announcements from '@/features/dashboard/Announcements'
import { useAuth } from '@/hooks/useAuth'
import { getGreetingForUser } from '@/data/mockUsers'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

export default function Dashboard() {
  const { user } = useAuth()
  const displayName = user ? getGreetingForUser(user) : null
  const { data: stats, loading, error } = useFetch<DashboardStats>(dashboardService.getStats)

  return (
    <>
      <PageHeading
        title="Dashboard Overview"
        subtitle={`Welcome Back${displayName ? `, ${displayName}` : ''}. Here's what's happening today.`}
      />

      <div className="mt-6 space-y-6">
        {loading && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-stone-600">Loading dashboard metrics...</div>
        )}

        {error && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            Unable to load dashboard metrics. Please refresh the page.
          </div>
        )}

        <StatsGrid stats={stats} />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <AttendanceChart />
          <EnrollmentDonut />
          <UpcomingEvents />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <RecentActivities />
          <RecentLeaveRequests />
          <Announcements />
        </div>
      </div>
    </>
  )
}
