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

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
}

const tintClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-sky-700/15 text-sky-700 ring-1 ring-sky-700/15',
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
      <div className="mt-6 text-sm font-medium text-slate-600">{card.label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</div>
    </div>
  )
}

export default function StatsGrid() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
      {statCards.map((card) => (
        <StatCardView card={card} key={card.id} />
      ))}
    </div>
  )
}