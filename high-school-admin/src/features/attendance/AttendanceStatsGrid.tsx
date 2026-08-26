import {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { attendanceStatCards } from '@/services/attendanceMockData'
import type { StatCard } from '@/types'
import type { AttendanceStats } from '@/services/attendanceService'
import { StatCardSkeleton } from '@/components/common/Skeleton'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
}

const overrides: Partial<Record<string, (stats: AttendanceStats) => string>> = {
  present: (stats) => stats.presentToday.toLocaleString(),
  absent: (stats) => stats.absentToday.toLocaleString(),
  late: (stats) => stats.lateToday.toLocaleString(),
  rate: (stats) => `${stats.attendanceRate}%`,
  excuses: (stats) => stats.pendingExcuses.toString(),
  perfect: (stats) => stats.perfectAttendanceCount.toLocaleString(),
}

interface AttendanceStatsGridProps {
  stats?: AttendanceStats | null
  loading?: boolean
}

const tintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-brand-700/15 text-brand-700 ring-1 ring-brand-700/15',
  green: 'bg-emerald-700/15 text-emerald-700 ring-1 ring-emerald-700/15',
  amber: 'bg-amber-700/15 text-amber-700 ring-1 ring-amber-700/15',
  violet: 'bg-violet-700/15 text-violet-700 ring-1 ring-violet-700/15',
  sky: 'bg-sky-700/15 text-sky-700 ring-1 ring-sky-700/15',
  red: 'bg-rose-700/15 text-rose-700 ring-1 ring-rose-700/15',
}

const deltaTintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-emerald-50 text-emerald-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-emerald-50 text-emerald-700',
  sky: 'bg-emerald-50 text-emerald-700',
  red: 'bg-rose-50 text-rose-700',
}

function StatCardView({ card }: { card: StatCard }) {
  const Icon = iconMap[card.icon]
  const DeltaIcon =
    card.deltaDirection === 'up' ? ArrowUp : card.deltaDirection === 'down' ? ArrowDown : Minus

  return (
    <div className="group rounded-2xl sm:rounded-[28px] glass-sm p-4 sm:p-5 lg:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div
          className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl transition-transform duration-300 ease-out group-hover:scale-105 ${tintClasses[card.tint]}`}
        >
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </div>
        <div
          className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold ${deltaTintClasses[card.tint]}`}
        >
          <DeltaIcon size={11} strokeWidth={2.5} />
          <span>{card.delta}</span>
        </div>
      </div>
      <div>
        <div className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 truncate">{card.label}</div>
        <div className="mt-1 sm:mt-1.5 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{card.value}</div>
      </div>
    </div>
  )
}

export default function AttendanceStatsGrid({ stats, loading }: AttendanceStatsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6" aria-busy="true" aria-label="Loading attendance statistics">
        {attendanceStatCards.map((card) => (
          <StatCardSkeleton key={`skeleton-${card.id}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      {attendanceStatCards.map((card) => {
        const value = stats && overrides[card.id] ? overrides[card.id]!(stats) : card.value
        return <StatCardView card={{ ...card, value }} key={card.id} />
      })}
    </div>
  )
}