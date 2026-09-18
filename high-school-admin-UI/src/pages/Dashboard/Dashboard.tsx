// src/pages/Dashboard/Dashboard.tsx
import { useState } from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/dashboard/AttendanceChart'
import EnrollmentDonut from '@/components/dashboard/EnrollmentDonut'
import DashboardHeroBanner from '@/features/dashboard/DashboardHeroBanner'
import DashboardQuickActions from '@/features/dashboard/DashboardQuickActions'
import AcademicPulseWidget from '@/features/dashboard/AcademicPulseWidget'
import LiveAttendanceBreakdown from '@/features/dashboard/LiveAttendanceBreakdown'
import TeacherDashboard from '@/pages/Dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/Dashboard/StudentDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardData } from '@/features/dashboard/useDashboardData'
import {
  DASHBOARD_CARDS,
  applyDashboardStats,
} from '@/features/dashboard/dashboardCards'
import type { Cohort } from '@/services/dashboardService'

/**
 * Maps the display labels DashboardHeroBanner renders to the URL-safe
 * slugs the backend expects. "All Grades" is what the user sees;
 * `'all'` is what `GET /dashboard/stats?cohort=...` accepts.
 */
const COHORT_MAP: Record<string, Cohort> = {
  'All Grades': 'all',
  'Upper Sec (10-12)': 'upper-secondary',
  'Lower Sec (7-9)': 'lower-secondary',
}

function AdminDashboard() {
  const [cohortLabel, setCohortLabel] = useState('All Grades')
  const cohort: Cohort = COHORT_MAP[cohortLabel] ?? 'all'
  const { stats, attendance, loading, error } = useDashboardData(cohort)

  // Fill the card shells with live values. Cards with no source keep `—`.
  const cards = applyDashboardStats(DASHBOARD_CARDS, stats, attendance)

  const handleExportSummary = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <DashboardHeroBanner
        selectedCohort={cohortLabel}
        onCohortChange={setCohortLabel}
        onExportSummary={handleExportSummary}
        attendanceRate={attendance?.attendanceRate}
        pendingApprovals={stats?.pendingLeaveRequests}
      />

      <DashboardQuickActions />

      {error && (
        <div className="rounded-2xl p-4 text-xs font-semibold text-error bg-surface border border-surface">
          Unable to synchronize real-time dashboard metrics. Displaying last known values.
        </div>
      )}

      <StatsGrid cards={cards} loading={loading} showHeader={true} columns={4} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AcademicPulseWidget />
        <LiveAttendanceBreakdown />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-2">
          <AttendanceChart loading={loading} />
        </div>
        <div className="lg:col-span-2 xl:col-span-1">
          <EnrollmentDonut />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === 'teacher') return <TeacherDashboard />
  if (user?.role === 'student') return <StudentDashboard />
  // Parent role is rendered by the parent portal's route set — no branch here.

  return <AdminDashboard />
}