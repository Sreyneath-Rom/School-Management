import { useState } from 'react'
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Star,
  FileCheck2,
  Trophy,
  CalendarClock,
  Calendar,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  UserRound,
  UserCheck,
  ClipboardList,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { statCards as defaultStatCards } from '@/services/mockData'
import type { StatCard } from '@/types'
import type { DashboardStats } from '@/services/dashboardService'
import { StatCardSkeleton } from '@/components/common/Skeleton'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Star,
  FileCheck2,
  Trophy,
  CalendarClock,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  UserRound,
  UserCheck,
  ClipboardList,
}

const overrides: Partial<Record<string, (stats: DashboardStats) => string>> = {
  students: (stats) => stats.studentCount.toLocaleString(),
  teachers: (stats) => stats.teacherCount.toLocaleString(),
  classes: (stats) => stats.classCount.toLocaleString(),
}

function isDashboardStats(value: unknown): value is DashboardStats {
  if (!value || typeof value !== 'object') return false
  const stats = value as Record<string, unknown>
  return (
    typeof stats.studentCount === 'number' &&
    typeof stats.teacherCount === 'number' &&
    typeof stats.classCount === 'number'
  )
}

interface StatsGridProps<T = DashboardStats> {
  stats?: T | null
  loading?: boolean
  cards?: StatCard[]
  columns?: 3 | 4 | 6 | 8
  resolveValue?: (card: StatCard, stats: T | null | undefined) => string
  showHeader?: boolean
}

// -------------------------------------------------------------
// Visual mini-graphics from the design reference image
// -------------------------------------------------------------

function MiniSparklineBlue() {
  return (
    <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 44" fill="none">
      <path
        d="M2 32 C 16 34, 24 18, 38 22 C 52 26, 60 12, 74 16 C 84 19, 90 8, 96 6"
        stroke="#3b82f6"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="96" cy="6" r="4.5" fill="#2563eb" />
    </svg>
  )
}

function MiniBarsTeal() {
  return (
    <div className="flex items-end gap-1.5 h-10">
      <span className="w-2 rounded-t-full bg-emerald-400/70 h-3" />
      <span className="w-2 rounded-t-full bg-emerald-400/80 h-5" />
      <span className="w-2 rounded-t-full bg-emerald-500/90 h-7" />
      <span className="w-2 rounded-t-full bg-teal-500 h-9" />
    </div>
  )
}

function MiniSparklinePurple() {
  return (
    <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 44" fill="none">
      <path
        d="M2 30 C 18 32, 28 14, 44 24 C 60 34, 72 10, 96 14"
        stroke="#8b5cf6"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniRingOrange({ percentage = 96.5 }: { percentage?: number }) {
  // SVG circular progress
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#fed7aa"
          strokeWidth="6"
          fill="none"
          className="opacity-50 dark:opacity-30"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#f97316"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-slate-800 dark:text-slate-100">
        96.5%
      </span>
    </div>
  )
}

function MiniBarsPink() {
  return (
    <div className="flex items-end gap-1.5 h-10">
      <span className="w-2 rounded-t-full bg-pink-400/70 h-2.5" />
      <span className="w-2 rounded-t-full bg-pink-400/80 h-4" />
      <span className="w-2 rounded-t-full bg-pink-500/90 h-6" />
      <span className="w-2 rounded-t-full bg-rose-500 h-8" />
      <span className="w-2 rounded-t-full bg-rose-600 h-10" />
    </div>
  )
}

function MiniRingBlue({ percentage = 98 }: { percentage?: number }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#bfdbfe"
          strokeWidth="6"
          fill="none"
          className="opacity-50 dark:opacity-30"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#0284c7"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-slate-800 dark:text-slate-100">
        98%
      </span>
    </div>
  )
}

function MiniUsersPurple() {
  return (
    <div className="flex items-center -space-x-1.5">
      <span className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-sm ring-2 ring-white/80 dark:ring-slate-900">
        <Users size={14} />
      </span>
      <span className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white/80 dark:ring-slate-900 z-10">
        <Users size={16} />
      </span>
      <span className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-sm ring-2 ring-white/80 dark:ring-slate-900">
        <Users size={14} />
      </span>
    </div>
  )
}

function MiniCalendarMint() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
      <CalendarClock size={24} strokeWidth={2} />
    </div>
  )
}

// -------------------------------------------------------------
// Card visual theme styling definitions
// -------------------------------------------------------------

interface CardVisualConfig {
  cardBg: string
  blob1: string
  blob2?: string
  iconBg: string
  iconText: string
  iconShadow: string
}

const cardStyles: Record<string, CardVisualConfig> = {
  students: {
    cardBg: 'from-blue-50/80 via-cyan-50/40 to-blue-100/50 dark:from-slate-900/90 dark:via-blue-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-blue-300/40 to-cyan-200/50 dark:from-blue-600/20 dark:to-cyan-500/20',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-blue-500/30',
  },
  teachers: {
    cardBg: 'from-emerald-50/80 via-teal-50/40 to-emerald-100/50 dark:from-slate-900/90 dark:via-emerald-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-teal-300/40 to-emerald-200/50 dark:from-teal-600/20 dark:to-emerald-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-emerald-500/30',
  },
  classes: {
    cardBg: 'from-purple-50/80 via-indigo-50/40 to-purple-100/50 dark:from-slate-900/90 dark:via-purple-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-purple-300/40 to-pink-200/50 dark:from-purple-600/20 dark:to-pink-500/20',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-purple-500/30',
  },
  attendance: {
    cardBg: 'from-orange-50/80 via-amber-50/40 to-rose-50/50 dark:from-slate-900/90 dark:via-orange-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-orange-300/40 to-amber-200/50 dark:from-orange-600/20 dark:to-amber-500/20',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-orange-500/30',
  },
  gpa: {
    cardBg: 'from-pink-50/80 via-rose-50/40 to-purple-50/50 dark:from-slate-900/90 dark:via-pink-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-pink-300/40 to-rose-200/50 dark:from-pink-600/20 dark:to-rose-500/20',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-pink-500/30',
  },
  assignments: {
    cardBg: 'from-sky-50/80 via-cyan-50/40 to-blue-50/50 dark:from-slate-900/90 dark:via-sky-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-sky-300/40 to-blue-200/50 dark:from-sky-600/20 dark:to-blue-500/20',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-sky-500/30',
  },
  'top-students': {
    cardBg: 'from-indigo-50/80 via-purple-50/40 to-indigo-100/50 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-indigo-300/40 to-purple-200/50 dark:from-indigo-600/20 dark:to-purple-500/20',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-indigo-500/30',
  },
  events: {
    cardBg: 'from-teal-50/80 via-emerald-50/40 to-cyan-50/50 dark:from-slate-900/90 dark:via-teal-950/30 dark:to-slate-900',
    blob1: 'bg-gradient-to-br from-teal-300/40 to-cyan-200/50 dark:from-teal-600/20 dark:to-cyan-500/20',
    iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
    iconText: 'text-white',
    iconShadow: 'shadow-md shadow-teal-500/30',
  },
}

function renderMiniGraphic(type?: string) {
  switch (type) {
    case 'wave-blue':
      return <MiniSparklineBlue />
    case 'bars-teal':
      return <MiniBarsTeal />
    case 'wave-purple':
      return <MiniSparklinePurple />
    case 'ring-orange':
      return <MiniRingOrange percentage={96.5} />
    case 'bars-pink':
      return <MiniBarsPink />
    case 'ring-blue':
      return <MiniRingBlue percentage={98} />
    case 'users-purple':
      return <MiniUsersPurple />
    case 'calendar-mint':
      return <MiniCalendarMint />
    default:
      return null
  }
}

// -------------------------------------------------------------
// Single KPI Card Component
// -------------------------------------------------------------

function KPICardView({ card }: { card: StatCard }) {
  const Icon = iconMap[card.icon] ?? GraduationCap
  const style =
    cardStyles[card.id] ||
    cardStyles.students

  const isPositive = card.deltaDirection === 'up'
  const isNegative = card.deltaDirection === 'down'

  return (
    <div className="group relative isolate overflow-hidden rounded-[26px] border border-white/80 bg-white/70 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/70">
      {/* Background Soft Fluid Glass Glow */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full blur-2xl opacity-70 transition-transform duration-500 group-hover:scale-110 ${style.blob1}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full blur-2xl opacity-40 ${style.blob1}`}
      />

      <div className="relative flex flex-col justify-between h-full min-h-[178px]">
        {/* Top: Icon Badge */}
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.iconBg} ${style.iconText} ${style.iconShadow} transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
        </div>

        {/* Middle: Metric Title & Large Number */}
        <div className="mt-4">
          <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
            {card.label}
          </p>
          <p className="mt-1 text-3xl sm:text-[34px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {card.value}
          </p>
        </div>

        {/* Lower: Trend Delta & Mini Graphic */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {card.delta ? (
              <div className="flex items-center gap-1.5">
                <span className="flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {isPositive && <ArrowUp size={13} strokeWidth={3} className="mr-0.5" />}
                  {isNegative && <ArrowDown size={13} strokeWidth={3} className="mr-0.5" />}
                  {card.delta}
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {card.deltaLabel}
                </span>
              </div>
            ) : null}

            {card.footerLabel && (
              <p className="mt-1 text-[11px] font-normal text-slate-400 dark:text-slate-500">
                {card.footerLabel}
              </p>
            )}
          </div>

          {/* Right aligned mini graphic */}
          <div className="shrink-0 flex items-center justify-end">
            {renderMiniGraphic(card.miniGraphicType)}
          </div>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// StatsGrid Main Component
// -------------------------------------------------------------

export default function StatsGrid<T = DashboardStats>({
  stats,
  loading,
  cards = defaultStatCards,
  resolveValue,
  showHeader = true,
}: StatsGridProps<T>) {
  const [selectedYear, setSelectedYear] = useState('2025 – 2026')
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCardSkeleton key={`skeleton-${card.id}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header bar matching user's image reference:
          "Key Performance Indicators" + "Overall school performance at a glance" + year pill dropdown */}
      {showHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
              <BarChart3 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Key Performance Indicators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Overall school performance at a glance
              </p>
            </div>
          </div>

          {/* Academic Year Dropdown Pill */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer transition"
            >
              <Calendar size={14} className="text-slate-400" />
              <span>{selectedYear}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showYearDropdown && (
              <div className="absolute right-0 mt-1.5 z-30 w-36 rounded-2xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {['2025 – 2026', '2024 – 2025', '2023 – 2024'].map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearDropdown(false)
                    }}
                    className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      selectedYear === year
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4x2 Grid Layout matching design reference image */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const value = resolveValue
            ? resolveValue(card, stats)
            : isDashboardStats(stats) && overrides[card.id]
            ? overrides[card.id]!(stats)
            : card.value
          return <KPICardView card={{ ...card, value }} key={card.id} />
        })}
      </div>

      {/* Footer slogan matching design reference: "✦ Better Learning • Brighter Future" */}
      {showHeader && (
        <div className="flex items-center gap-2 pt-1 px-1 text-xs font-medium text-slate-400 dark:text-slate-500">
          <Sparkles size={13} className="text-blue-500" />
          <span>Better Learning</span>
          <span>•</span>
          <span>Brighter Future</span>
        </div>
      )}
    </div>
  )
}
