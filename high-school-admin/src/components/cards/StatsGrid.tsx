import {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { statCards } from '../../services/mockData'
import type { StatCard } from '../../types'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
}

const tintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-sky-700/20 backdrop-blur-sm text-sky-700',
  green: 'bg-emerald-700/20 backdrop-blur-sm text-emerald-700',
  amber: 'bg-amber-700/20 backdrop-blur-sm text-amber-700',
  violet: 'bg-violet-700/20 backdrop-blur-sm text-violet-700',
  sky: 'bg-sky-700/20 backdrop-blur-sm text-sky-700',
  red: 'bg-rose-700/20 backdrop-blur-sm text-rose-700',
}

function StatCardView({ card }: { card: StatCard }) {
  const Icon = iconMap[card.icon]
  const deltaClass =
    card.deltaDirection === 'up'
      ? 'text-emerald-600'
      : card.deltaDirection === 'down'
      ? 'text-rose-600'
      : 'text-slate-600'

  return (
    <div className="rounded-[28px] glass-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${tintClasses[card.tint]}`}>
          <Icon size={20} />
        </div>
        <div className="text-right text-sm font-semibold text-slate-500">
          <div className={deltaClass}>{card.delta}</div>
         
        </div>
      </div>
      <div className="mt-6 text-sm font-medium text-slate-600">{card.label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</div>
    </div>
  )
}

export default function StatsGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-6">
      {statCards.map((card) => (
        <StatCardView card={card} key={card.id} />
      ))}
    </div>
  )
}