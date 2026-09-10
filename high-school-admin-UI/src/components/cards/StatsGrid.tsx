import {
  GraduationCap,
  UserRound,
  Users,
  BookOpen,
  UserCheck,
  ClipboardList,
  CalendarRange,
  School,
  Layers,
  FileText,
  Shield,
  ShieldCheck,
  Key,
  Calendar,
  MapPin,
  Languages,
  Globe,
  AlertCircle,
  AlertTriangle,
  DoorOpen,
  BookMarked,
  Megaphone,
  Pin,
  CalendarDays,
  Database,
  DollarSign,
  Mail,
  TrendingUp,
  Sparkles,
  CreditCard,
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  MoreHorizontal,
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
  CalendarRange,
  School,
  Layers,
  FileText,
  Shield,
  ShieldCheck,
  Key,
  Calendar,
  MapPin,
  Languages,
  Globe,
  AlertCircle,
  AlertTriangle,
  DoorOpen,
  BookMarked,
  Megaphone,
  Pin,
  CalendarDays,
  Database,
  DollarSign,
  Mail,
  TrendingUp,
  Sparkles,
  CreditCard,
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
}

const overrides: Partial<Record<string, (stats: DashboardStats) => string>> = {
  students: (stats) => stats.studentCount.toLocaleString(),
  teachers: (stats) => stats.teacherCount.toLocaleString(),
  classes: (stats) => stats.classCount.toLocaleString(),
  leaves: (stats) => stats.pendingLeaveRequests.toString(),
}

function isDashboardStats(value: unknown): value is DashboardStats {
  if (!value || typeof value !== 'object') return false
  const stats = value as Record<string, unknown>
  return (
    typeof stats.studentCount === 'number' &&
    typeof stats.teacherCount === 'number' &&
    typeof stats.classCount === 'number' &&
    typeof stats.pendingLeaveRequests === 'number'
  )
}

interface StatsGridProps<T> {
  stats?: T | null
  loading?: boolean
  cards?: StatCard[]
  columns?: 3 | 4 | 6
  resolveValue?: (card: StatCard, stats: T | null | undefined) => string
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

const accentClasses: Record<StatCard['tint'], string> = {
  blue: 'bg-info/10',
  green: 'bg-success/10',
  amber: 'bg-warning/10',
  violet: 'bg-orange-600/10',
  sky: 'bg-brand-600/10',
  red: 'bg-error/10',
}

const deltaTextClasses: Record<StatCard['deltaDirection'], string> = {
  up: 'text-success',
  down: 'text-error',
  neutral: 'text-text-main/55',
}

function StatCardView({ card }: { card: StatCard }) {
  const Icon = iconMap[card.icon] ?? AlertCircle
  const DeltaIcon =
    card.deltaDirection === 'up' ? ArrowUp : card.deltaDirection === 'down' ? ArrowDown : Minus

  return (
    <div className="group relative isolate min-h-44 overflow-hidden rounded-2xl sm:rounded-3xl glass-sm p-4 sm:p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)]">
      <div aria-hidden="true" className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-[1px] ${accentClasses[card.tint]}`} />
      <div aria-hidden="true" className={`pointer-events-none absolute -bottom-12 -right-5 h-24 w-24 rounded-full border-18 border-white/20 ${accentClasses[card.tint]}`} />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105 ${tintClasses[card.tint]}`}
        >
            <Icon size={18} />
        </div>
          <button type="button" aria-label={`More options for ${card.label}`} className="rounded-full p-1 text-text-main/45 transition hover:bg-text-main/5 hover:text-text-main">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div>
          <div className="text-xs font-medium text-text-main/65 sm:text-sm">{card.label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-text-main sm:text-3xl">{card.value}</div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${deltaTextClasses[card.deltaDirection]}`}>
          <span className={`inline-flex items-center justify-center rounded-full p-0.5 ${deltaTintClasses[card.tint]}`}>
            <DeltaIcon size={11} strokeWidth={2.5} />
          </span>
          <span>{card.delta}</span>
          <span className="font-normal text-text-main/45">{card.deltaLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default function StatsGrid<T = DashboardStats>({
  stats,
  loading,
  cards = statCards,
  columns = 6,
  resolveValue,
}: StatsGridProps<T>) {
  const gridClassName = columns === 3
    ? 'grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3'
    : columns === 4
    ? 'grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4'
    : 'grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6'

  if (loading) {
    return (
      <div className={gridClassName} aria-busy="true" aria-label="Loading statistics">
        {cards.map((card) => (
          <StatCardSkeleton key={`skeleton-${card.id}`} />
        ))}
      </div>
    )
  }

  return (
    <div className={gridClassName}>
      {cards.map((card) => {
        const value = resolveValue
          ? resolveValue(card, stats)
          : isDashboardStats(stats) && overrides[card.id]
            ? overrides[card.id]!(stats)
            : card.value
        return <StatCardView card={{ ...card, value }} key={card.id} />
      })}
    </div>
  )
}