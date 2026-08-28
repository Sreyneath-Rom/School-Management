// src/features/students/StudentStats.tsx
import React from 'react'
import { Users, UserCheck, Award, TrendingUp, Sparkles } from 'lucide-react'
import type { StudentUser } from '@/types/user'

interface StudentStatsProps {
  students: StudentUser[]
  isLoading?: boolean
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="animate-pulse rounded-2xl border border-border-card/40 bg-surface-card p-5">
            <div className="h-4 w-24 rounded bg-surface-base" />
            <div className="mt-3 h-8 w-16 rounded bg-surface-base" />
            <div className="mt-2 h-3 w-32 rounded bg-surface-base" />
          </div>
        ))}
      </div>
    )
  }

  const total = students.length
  const activeCount = students.filter((s) => s.status === 'active').length
  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0

  // Calculate average attendance if available, or approximate from mock data
  const studentsWithAttendance = students.filter((s) => typeof (s as any).attendanceRate === 'number')
  const avgAttendance =
    studentsWithAttendance.length > 0
      ? Math.round(
          studentsWithAttendance.reduce((acc, s) => acc + ((s as any).attendanceRate || 0), 0) /
            studentsWithAttendance.length
        )
      : 96

  // Top GPA students (> 3.7 or top 25%)
  const highPerformers = students.filter((s) => ((s as any).gpa || 3.5) >= 3.7).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Students */}
      <div className="group relative overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card p-5 transition hover:border-brand-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-main/60">Total Enrolled</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-text-main">{total}</span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            +4.2% this term
          </span>
        </div>
        <p className="mt-1 text-xs text-text-main/55">Across Grades 9 to 12</p>
      </div>

      {/* Active Students */}
      <div className="group relative overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card p-5 transition hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-main/60">Active Status</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-text-main">{activeCount}</span>
          <span className="text-xs font-medium text-text-main/60">({activeRate}% of total)</span>
        </div>
        <p className="mt-1 text-xs text-text-main/55">Currently in good standing</p>
      </div>

      {/* Average Attendance */}
      <div className="group relative overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card p-5 transition hover:border-blue-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-main/60">Avg Attendance</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-text-main">{avgAttendance}%</span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Above target</span>
        </div>
        <p className="mt-1 text-xs text-text-main/55">Current academic period</p>
      </div>

      {/* Honor Roll */}
      <div className="group relative overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card p-5 transition hover:border-amber-500/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-main/60">Honor Roll</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-text-main">{highPerformers}</span>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3 w-3" />
            GPA ≥ 3.7
          </div>
        </div>
        <p className="mt-1 text-xs text-text-main/55">Eligible for academic honors</p>
      </div>
    </div>
  )
}
