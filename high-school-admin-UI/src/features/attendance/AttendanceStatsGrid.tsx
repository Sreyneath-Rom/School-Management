// src/features/attendance/AttendanceStatsGrid.tsx
import { attendanceStatCards } from '@/services/attendanceMockData'
import type { AttendanceStats } from '@/services/attendanceService'
import StatsGrid from '@/components/cards/StatsGrid'

interface AttendanceStatsGridProps {
  stats?: AttendanceStats | null
  loading?: boolean
}

export default function AttendanceStatsGrid({ stats, loading }: AttendanceStatsGridProps) {
  return (
    <StatsGrid
      stats={stats}
      loading={loading}
      cards={attendanceStatCards}
      resolveValue={(card) => {
        if (!stats) return card.value
        const values: Record<string, string> = {
          present: (stats.presentToday ?? stats.present ?? 0).toLocaleString(),
          absent: (stats.absentToday ?? stats.absent ?? 0).toLocaleString(),
          late: (stats.lateToday ?? stats.late ?? 0).toLocaleString(),
          rate: `${stats.attendanceRate}%`,
          excuses: (stats.pendingExcuses ?? stats.excused ?? 0).toString(),
          perfect: (stats.perfectAttendanceCount ?? 0).toLocaleString(),
        }
        return values[card.id] ?? card.value
      }}
    />
  )
}