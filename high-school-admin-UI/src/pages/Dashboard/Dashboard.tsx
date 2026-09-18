import { useCallback, useEffect, useState } from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/charts/AttendanceChart'
import DashboardHeroBanner from '@/features/dashboard/DashboardHeroBanner'
import DashboardQuickActions from '@/features/dashboard/DashboardQuickActions'
import AcademicPulseWidget from '@/features/dashboard/AcademicPulseWidget'
import LiveAttendanceBreakdown from '@/features/dashboard/LiveAttendanceBreakdown'
import TeacherDashboard from '@/pages/Dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/Dashboard/StudentDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'
import type { StatCard } from '@/types'

function AdminDashboard() {
  const [selectedCohort, setSelectedCohort] = useState('All Grades')
  const fetchDashboardStats = useCallback(
    () => dashboardService.getStats(selectedCohort),
    [selectedCohort],
  )
  const { data: stats, loading, error, refetch } = useFetch<DashboardStats>(fetchDashboardStats)

  useEffect(() => {
    void refetch()
  }, [selectedCohort, refetch])

  const handleExportSummary = () => {
    // Generates browser print / pdf save dialog for administrative reporting
    window.print()
  }

  const cards: StatCard[] | undefined = stats
    ? [
        { id: 'students', label: 'Total Students', value: String(stats.studentCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'GraduationCap', tint: 'blue' },
        { id: 'teachers', label: 'Total Teachers', value: String(stats.teacherCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'Users', tint: 'emerald' },
        { id: 'classes', label: 'Total Classes', value: String(stats.classCount), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'BookOpen', tint: 'purple' },
        { id: 'leave-requests', label: 'Pending Leave Requests', value: String(stats.pendingLeaveRequests), delta: '', deltaDirection: 'neutral', deltaLabel: 'From database', icon: 'FileText', tint: 'orange' },
      ]
    : undefined

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
      <StatsGrid stats={stats} cards={cards} loading={loading} showHeader={true} />

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
