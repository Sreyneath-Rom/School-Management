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
import { statCards } from '@/services/mockData'
import type { StatCard } from '@/types'
import type { DashboardStats } from '@/services/dashboardService'
import { StatCardSkeleton } from '@/components/common/Skeleton'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
}

const overrides: Partial<Record<string, (stats: DashboardStats) => string>> = {
  students: (stats) => stats.studentCount.toLocaleString(),
  teachers: (stats) => stats.teacherCount.toLocaleString(),
  classes: (stats) => stats.classCount.toLocaleString(),
  leaves: (stats) => stats.pendingLeaveRequests.toString(),
}

interface StatsGridProps {
  stats?: DashboardStats | null
  loading?: boolean
}

const tintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-info/15 text-info ring-1 ring-info/25',
  green: 'bg-success/15 text-success ring-1 ring-success/25',
  amber: 'bg-warning/15 text-warning ring-1 ring-warning/25',
  violet: 'bg-orange-600/15 text-orange-600 ring-1 ring-orange-600/25 dark:text-orange-300',
  sky: 'bg-brand-600/15 text-brand-600 ring-1 ring-brand-600/25 dark:text-brand-300',
  red: 'bg-error/15 text-error ring-1 ring-error/25',
}

const deltaTintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-success/15 text-success',
  green: 'bg-success/15 text-success',
  amber: 'bg-success/15 text-success',
  violet: 'bg-success/15 text-success',
  sky: 'bg-success/15 text-success',
  red: 'bg-error/15 text-error',
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
        <div className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-text-main/65 truncate">{card.label}</div>
        <div className="mt-1 sm:mt-1.5 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-text-main">{card.value}</div>
      </div>
    </div>
  )
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6" aria-busy="true" aria-label="Loading statistics">
        {statCards.map((card) => (
          <StatCardSkeleton key={`skeleton-${card.id}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      {statCards.map((card) => {
        const value = stats && overrides[card.id] ? overrides[card.id]!(stats) : card.value
        return <StatCardView card={{ ...card, value }} key={card.id} />
      })}
    </div>
  )
}