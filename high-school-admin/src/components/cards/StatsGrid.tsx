import {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
  ArrowUp,
  ArrowDown,
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
  blue: 'bg-sky-100 text-sky-600',
  green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  violet: 'bg-violet-100 text-violet-600',
  sky: 'bg-sky-100 text-sky-600',
  red: 'bg-rose-100 text-rose-600',
}

function StatCardView({ card }: { card: StatCard }) {
  const Icon = iconMap[card.icon]
  const deltaClass =
    card.deltaDirection === 'up'
      ? 'text-emerald-600'
      : card.deltaDirection === 'down'
      ? 'text-rose-600'
      : 'text-slate-500'

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${tintClasses[card.tint]}`}>
        <Icon size={20} />
      </div>
      <div className="mt-4 text-sm font-medium text-slate-500">{card.label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</div>
      <div className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${deltaClass}`}>
        {card.deltaDirection === 'up' ? <ArrowUp size={14} /> : card.deltaDirection === 'down' ? <ArrowDown size={14} /> : null}
        <span>{card.delta}</span>
        <span className="text-slate-400 font-medium">{card.deltaLabel}</span>
      </div>
    </div>
  )
}

export default function StatsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {statCards.map((card) => (
        <StatCardView card={card} key={card.id} />
      ))}
    </div>
  )
}
