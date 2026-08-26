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
    <div className="group rounded-[28px] glass-sm p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl transition-transform duration-300 ease-out group-hover:scale-105 ${tintClasses[card.tint]}`}
        >
          <Icon size={20} />
        </div>
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${deltaTintClasses[card.tint]}`}
        >
          <DeltaIcon size={12} strokeWidth={2.5} />
          {card.delta}
        </div>
      </div>
      <div className="mt-6 text-sm font-medium text-text-main/65">{card.label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-text-main">{card.value}</div>
    </div>
  )
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
      {statCards.map((card) => {
        const value = stats && overrides[card.id] ? overrides[card.id]!(stats) : card.value
        return <StatCardView card={{ ...card, value }} key={card.id} />
      })}
    </div>
  )
}