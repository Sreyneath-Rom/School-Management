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
          present: stats.presentToday.toLocaleString(),
          absent: stats.absentToday.toLocaleString(),
          late: stats.lateToday.toLocaleString(),
          rate: `${stats.attendanceRate}%`,
          excuses: stats.pendingExcuses.toString(),
          perfect: stats.perfectAttendanceCount.toLocaleString(),
        }
        return values[card.id] ?? card.value
      }}
    />
  )
}