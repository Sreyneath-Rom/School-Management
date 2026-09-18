import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/charts/AttendanceChart'
import TeacherDashboard from '@/pages/Dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/Dashboard/StudentDashboard'
import { useAuth } from '@/hooks/useAuth'
import { getGreetingForUser } from '@/data/mockUsers'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'
import type { StatCard } from '@/types'

function AdminDashboard() {
  const { user } = useAuth()
  const displayName = user ? getGreetingForUser(user) : null
  const { data: stats, loading, error } = useFetch<DashboardStats>(dashboardService.getStats)
  const cards: StatCard[] | undefined = stats ? [
    { id: 'students', label: 'Total Students', value: String(stats.studentCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'GraduationCap', tint: 'blue' },
    { id: 'teachers', label: 'Total Teachers', value: String(stats.teacherCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'UserRound', tint: 'green' },
    { id: 'classes', label: 'Total Classes', value: String(stats.classCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'Users', tint: 'amber' },
    { id: 'leaves', label: 'Pending Leave Requests', value: String(stats.pendingLeaveRequests), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'ClipboardList', tint: 'red' },
  ] : undefined

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

        <StatsGrid stats={stats} cards={cards} loading={loading} />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <AttendanceChart loading={loading} />
          </div>
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  // Role-tailored dashboards (UC-DASHBOARD-01, UC-DASHBOARD-02, UC-DASHBOARD-03)
  if (user?.role === 'teacher') {
    return <TeacherDashboard />
  }

  if (user?.role === 'student') {
    return <StudentDashboard />
  }

  return <AdminDashboard />
}
