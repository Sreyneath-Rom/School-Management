import { useState } from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/charts/AttendanceChart'
import EnrollmentDonut from '@/components/charts/EnrollmentDonut'
import UpcomingEvents from '@/features/dashboard/UpcomingEvents'
import RecentActivities from '@/features/dashboard/RecentActivities'
import RecentLeaveRequests from '@/features/dashboard/RecentLeaveRequests'
import Announcements from '@/features/dashboard/Announcements'
import DashboardHeroBanner from '@/features/dashboard/DashboardHeroBanner'
import DashboardQuickActions from '@/features/dashboard/DashboardQuickActions'
import AcademicPulseWidget from '@/features/dashboard/AcademicPulseWidget'
import LiveAttendanceBreakdown from '@/features/dashboard/LiveAttendanceBreakdown'
import PendingApprovalsWidget from '@/features/dashboard/PendingApprovalsWidget'
import TeacherDashboard from '@/pages/Dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/Dashboard/StudentDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

function AdminDashboard() {
  const { data: stats, loading, error } = useFetch<DashboardStats>(dashboardService.getStats)
  const [selectedCohort, setSelectedCohort] = useState('All Grades')

  const handleExportSummary = () => {
    // Generates browser print / pdf save dialog for administrative reporting
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* 1. Executive Hero Header with academic status, date, cohort filter, and export */}
      <DashboardHeroBanner
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
        onExportSummary={handleExportSummary}
      />

      {/* 2. Fast Actions shortcuts grid */}
      <DashboardQuickActions />

      {/* 3. Error Alert if API metrics fail */}
      {error && (
        <div className="rounded-2xl p-4 text-xs font-semibold text-error bg-surface border border-surface">
          Unable to synchronize real-time dashboard metrics from server. Displaying cached benchmarks.
        </div>
      )}

      {/* 4. High-Level Core Institutional KPIs */}
      <StatsGrid stats={stats} loading={loading} showHeader={true} />

      {/* 5. Academic Performance & Daily Attendance Diagnostics */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AcademicPulseWidget />
        <LiveAttendanceBreakdown />
      </div>

      {/* 6. Primary Attendance Trend & Enrollment Demographics */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-2">
          <AttendanceChart loading={loading} />
        </div>
        <div className="col-span-1">
          <EnrollmentDonut loading={loading} />
        </div>
      </div>

      {/* 7. Action Items, Approvals & Operations Center */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PendingApprovalsWidget />
        <RecentLeaveRequests loading={loading} />
      </div>

      {/* 8. Campus Life, Calendar & Administrative Notice Feed */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <UpcomingEvents loading={loading} />
        <RecentActivities loading={loading} />
        <div className="md:col-span-2 xl:col-span-1">
          <Announcements loading={loading} />
        </div>
      </div>
    </div>
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
