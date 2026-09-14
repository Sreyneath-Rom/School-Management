import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Sparkles,
  DownloadCloud,
  FileSpreadsheet,
  Check,
  Building,
  GraduationCap,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getGreetingForUser } from '@/utils/userGreeting'

interface DashboardHeaderActionProps {
  onExportSummary?: () => void
  selectedCohort: string
  onCohortChange: (cohort: string) => void
}

export default function DashboardHeroBanner({
  onExportSummary,
  selectedCohort,
  onCohortChange,
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

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-teal-50/40 p-5 sm:p-7 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-teal-950/20">
      {/* Decorative background geometry */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Salutation & Institutional Status */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-500/20">
              <Sparkles size={13} className="text-teal-600 dark:text-teal-300" />
              Academic Session 2025–2026 • Term II
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <CalendarDays size={13} />
              {currentDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">{displayName}</span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-400 leading-relaxed">
            Varin High School academic performance is stable. 94.2% daily attendance reported today with 0 pending exam approval escalations.
          </p>
        </div>

        {/* Right: Quick Cohort Filter & Export Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Cohort Select Pill */}
          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-800/90 p-1 border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
            {['All Grades', 'Upper Sec (10-12)', 'Lower Sec (7-9)'].map((cohort) => (
              <button
                key={cohort}
                type="button"
                onClick={() => onCohortChange(cohort)}
                className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  selectedCohort === cohort
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cohort}
              </button>
            ))}
          </div>

          {/* Quick PDF/Excel Export summary */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition cursor-pointer"
          >
            {exported ? (
              <>
                <Check size={14} className="text-emerald-400 dark:text-emerald-600" />
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
