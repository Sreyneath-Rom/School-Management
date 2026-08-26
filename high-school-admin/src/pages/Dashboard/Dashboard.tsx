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
        {error && (
          <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            Unable to load dashboard metrics. Please refresh the page.
          </div>
        )}

        <StatsGrid stats={stats} loading={loading} />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <AttendanceChart loading={loading} />
          </div>
          <div className="col-span-1">
            <EnrollmentDonut loading={loading} />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <UpcomingEvents loading={loading} />
          <RecentActivities loading={loading} />
          <div className="md:col-span-2 xl:col-span-1">
            <Announcements loading={loading} />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1">
          <RecentLeaveRequests loading={loading} />
        </div>
      </div>
    </>
  )
}
