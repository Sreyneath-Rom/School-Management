// src/features/dashboard/useDashboardData.ts
import { useCallback, useEffect, useState } from 'react'
import {
  dashboardService,
  type Cohort,
  type DashboardStats,
} from '@/services/dashboardService'
import type { AttendanceStats } from '@/types/attendance'

interface DashboardData {
  stats: DashboardStats | null
  attendance: AttendanceStats | null
  loading: boolean
  error: string | null
  refresh: () => void
}

/**
 * Fetches every dataset the dashboard KPI grid reads. The two requests run
 * in parallel and fail independently — if `stats` succeeds but `attendance`
 * 500s, the grid still renders the four stat-based cards and shows `—` for
 * the attendance card.
 *
 * `cohort` is the URL-safe slug the backend accepts (`'all'`, `'lower-secondary'`,
 * `'upper-secondary'`). The display labels ("All Grades", "Upper Sec (10-12)")
 * live in `DashboardHeroBanner`; the caller maps them before passing here.
 */
export function useDashboardData(cohort: Cohort = 'all'): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.allSettled([
      dashboardService.getStats(cohort),
      dashboardService.getAttendanceSummary(),
    ]).then(([statsResult, attendanceResult]) => {
      if (cancelled) return

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value)
      } else {
        setStats(null)
        setError((prev) => prev ?? 'Could not load dashboard statistics')
      }

      if (attendanceResult.status === 'fulfilled') {
        setAttendance(attendanceResult.value)
      } else {
        setAttendance(null)
        // Deliberately not setting error here — the stat cards still render.
      }

      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [cohort, reloadKey])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  return { stats, attendance, loading, error, refresh }
}