// src/features/dashboard/DashboardHeroBanner.tsx
import { useState } from 'react'
import { CalendarDays, Sparkles, FileSpreadsheet, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getGreetingForUser } from '@/utils/userGreeting'

interface DashboardHeaderActionProps {
  onExportSummary?: () => void
  selectedCohort: string
  onCohortChange: (cohort: string) => void
  /**
   * Live attendance rate (0–100) from `/dashboard/attendance-summary`.
   * Omit or pass `undefined` to hide the sentence fragment.
   */
  attendanceRate?: number
  /** Pending leave requests from `/dashboard/stats`. */
  pendingApprovals?: number
}

const COHORTS = ['All Grades', 'Upper Sec (10-12)', 'Lower Sec (7-9)'] as const

export default function DashboardHeroBanner({
  onExportSummary,
  selectedCohort,
  onCohortChange,
  attendanceRate,
  pendingApprovals,
}: DashboardHeaderActionProps) {
  const { user } = useAuth()
  const displayName = user ? getGreetingForUser(user) : 'Administrator'
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    setExported(true)
    onExportSummary?.()
    setTimeout(() => setExported(false), 2500)
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Build the status sentence from whichever live values are present.
  // No value is fabricated — a missing metric is simply omitted from the
  // sentence rather than replaced with a placeholder number.
  const statusParts: string[] = []
  if (attendanceRate !== undefined) {
    statusParts.push(`${attendanceRate}% daily attendance reported today`)
  }
  if (pendingApprovals !== undefined) {
    statusParts.push(
      pendingApprovals === 0
        ? 'no pending approvals'
        : `${pendingApprovals} pending approval${pendingApprovals === 1 ? '' : 's'}`
    )
  }
  const statusSentence = statusParts.join(', ')

  return (
    <div className="relative overflow-hidden rounded-3xl border border-surface bg-surface-strong p-5 sm:p-7 shadow-xs">
      {/* Decorative background geometry */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-success/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: salutation & institutional status */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300 border border-brand-500/20">
              <Sparkles size={13} />
              Academic Session 2025–2026 • Term II
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted">
              <CalendarDays size={13} />
              {currentDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-fg">
            Welcome Back,{' '}
            <span className="text-brand-600 dark:text-brand-400">{displayName}</span>
          </h1>

          {statusSentence && (
            <p className="max-w-2xl text-xs sm:text-sm font-normal text-fg-muted leading-relaxed">
              Varin High School academic performance is stable, {statusSentence}.
            </p>
          )}
        </div>

        {/* Right: cohort filter + export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-2xl bg-surface p-1 border border-surface shadow-xs">
            {COHORTS.map((cohort) => (
              <button
                key={cohort}
                type="button"
                onClick={() => onCohortChange(cohort)}
                className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  selectedCohort === cohort
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {cohort}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-2xl bg-brand-600 hover:bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
          >
            {exported ? (
              <>
                <Check size={14} />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={14} />
                <span>Briefing Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}