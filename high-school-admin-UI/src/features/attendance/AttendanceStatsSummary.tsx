// src/features/attendance/AttendanceStatsSummary.tsx
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
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

  const presentPct = total > 0 ? Math.round((present / total) * 100) : 0

  const cards: StatCard[] = [
    {
      id: 'all',
      label: 'Total Enrolled',
      value: String(total),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'students rostered',
      icon: 'Users',
      tint: 'blue',
    },
    {
      id: 'PRESENT',
      label: 'Present',
      value: String(present),
      delta: `${presentPct}%`,
      deltaDirection: 'neutral',
      deltaLabel: 'of class',
      icon: 'UserCheck',
      tint: 'green',
      progress: { value: presentPct, tone: 'success' },
    },
    {
      id: 'LATE',
      label: 'Late Arrivals',
      value: String(late),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'tardy check-ins',
      icon: 'Clock',
      tint: 'amber',
    },
    {
      id: 'ABSENT',
      label: 'Absent',
      value: String(absent),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'unexcused / pending',
      icon: 'UserX',
      tint: 'red',
    },
    {
      id: 'EXCUSED',
      label: 'Excused',
      value: String(excused),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'medical / official',
      icon: 'ShieldCheck',
      tint: 'violet',
    },
    {
      id: 'rate',
      label: 'Attendance Rate',
      value: `${rate}%`,
      delta: rate >= 90 ? 'Healthy' : 'Needs attention',
      deltaDirection: rate >= 90 ? 'up' : 'down',
      deltaLabel: 'overall standing',
      icon: 'TrendingUp',
      tint: 'sky',
      // Rate is informational, not a filter — clicking it would be
      // confusing since there's no matching status to filter by.
      noClick: true,
    },
  ]

  return (
    <StatsGrid
      cards={cards}
      loading={loading}
      columns={6}
      showHeader={false}
      onCardClick={
        onStatusFilterChange
          ? (cardId) =>
              onStatusFilterChange(selectedStatusFilter === cardId ? 'all' : cardId)
          : undefined
      }
      activeCardId={selectedStatusFilter !== 'all' ? selectedStatusFilter : null}
    />
  )
}