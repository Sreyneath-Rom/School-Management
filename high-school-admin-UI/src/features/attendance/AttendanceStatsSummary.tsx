import React from 'react'
import {
  UserCheck,
  Clock,
  UserX,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { AttendanceStats } from '@/services/attendanceService'

interface AttendanceStatsSummaryProps {
  stats: AttendanceStats | null
  loading?: boolean
  selectedStatusFilter?: string
  onStatusFilterChange?: (status: string) => void
}

export default function AttendanceStatsSummary({
  stats,
  loading = false,
  selectedStatusFilter = 'all',
  onStatusFilterChange,
}: AttendanceStatsSummaryProps) {
  const total = stats?.total ?? 0
  const present = stats?.present ?? stats?.presentToday ?? 0
  const late = stats?.late ?? stats?.lateToday ?? 0
  const absent = stats?.absent ?? stats?.absentToday ?? 0
  const excused = stats?.excused ?? 0
  const rate = stats?.attendanceRate ?? 0

  const cards = [
    {
      id: 'all',
      title: 'Total Enrolled',
      count: total,
      subtext: 'Students rostered',
      icon: Users,
      color: 'text-slate-700 dark:text-slate-200',
      bg: 'bg-slate-50 dark:bg-slate-800/80',
      border: 'border-slate-200/80 dark:border-slate-800',
      activeRing: 'ring-2 ring-slate-400',
    },
    {
      id: 'PRESENT',
      title: 'Present',
      count: present,
      subtext: total > 0 ? `${Math.round((present / total) * 100)}% of class` : '0%',
      icon: UserCheck,
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/25',
      border: 'border-emerald-200/70 dark:border-emerald-900/40',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'LATE',
      title: 'Late Arrivals',
      count: late,
      subtext: 'Tardy check-ins',
      icon: Clock,
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50/60 dark:bg-amber-950/25',
      border: 'border-amber-200/70 dark:border-amber-900/40',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'ABSENT',
      title: 'Absent',
      count: absent,
      subtext: 'Unexcused / pending',
      icon: UserX,
      color: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-50/60 dark:bg-rose-950/25',
      border: 'border-rose-200/70 dark:border-rose-900/40',
      activeRing: 'ring-2 ring-rose-500',
    },
    {
      id: 'EXCUSED',
      title: 'Excused',
      count: excused,
      subtext: 'Medical / official',
      icon: ShieldCheck,
      color: 'text-violet-700 dark:text-violet-400',
      bg: 'bg-violet-50/60 dark:bg-violet-950/25',
      border: 'border-violet-200/70 dark:border-violet-900/40',
      activeRing: 'ring-2 ring-violet-500',
    },
    {
      id: 'rate',
      title: 'Attendance Rate',
      count: `${rate}%`,
      subtext: rate >= 90 ? 'Healthy standing' : 'Needs attention',
      icon: TrendingUp,
      color: 'text-brand-700 dark:text-brand-400',
      bg: 'bg-brand-50/60 dark:bg-brand-950/25',
      border: 'border-brand-200/70 dark:border-brand-900/40',
      activeRing: 'ring-2 ring-brand-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon
        const isSelected = selectedStatusFilter === card.id
        const isClickable = onStatusFilterChange && card.id !== 'rate'

        return (
          <button
            key={card.id}
            type="button"
            disabled={!isClickable || loading}
            onClick={() => isClickable && onStatusFilterChange(isSelected ? 'all' : card.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${card.bg} ${
              card.border
            } ${isSelected ? `${card.activeRing} shadow-xs` : 'hover:border-slate-300 dark:hover:border-slate-700'} ${
              isClickable ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
            </div>

            {loading ? (
              <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
            ) : (
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {card.count}
              </div>
            )}

            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {card.subtext}
            </div>
          </button>
        )
      })}
    </div>
  )
}
