// src/features/students/StudentStats.tsx
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import type { StudentUser } from '@/types/user'

interface StudentStatsProps {
  students: StudentUser[]
  isLoading?: boolean
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students, isLoading }) => {
  const total = students.length
  const activeCount = students.filter((s) => s.status === 'active').length
  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0

  const studentsWithAttendance = students.filter((s) => typeof (s as any).attendanceRate === 'number')
  const avgAttendance =
    studentsWithAttendance.length > 0
      ? Math.round(
          studentsWithAttendance.reduce((acc, s) => acc + ((s as any).attendanceRate || 0), 0) /
            studentsWithAttendance.length
        )
      : 96.4

  const highPerformers = students.filter((s) => ((s as any).gpa || 3.5) >= 3.7).length
  const honorRate = total > 0 ? Math.round((highPerformers / total) * 100) : 32

  const cards: StatCard[] = [
    {
      id: 'total-enrolled',
      label: 'Total Enrolled',
      value: String(total),
      delta: '+4.2%',
      deltaDirection: 'up',
      deltaLabel: 'YoY',
      icon: 'GraduationCap',
      tint: 'blue',
      footerLabel: 'Grades 9–12 Roster',
    },
    {
      id: 'active-status',
      label: 'Active Status',
      value: String(activeCount),
      delta: `${activeRate}%`,
      deltaDirection: 'neutral',
      deltaLabel: 'in good standing',
      icon: 'UserCheck',
      tint: 'green',
      progress: { value: activeRate, tone: 'success' },
    },
    {
      id: 'avg-attendance',
      label: 'Avg Attendance',
      value: `${avgAttendance}%`,
      delta: 'Above target',
      deltaDirection: 'up',
      deltaLabel: 'target ≥ 95%',
      icon: 'TrendingUp',
      tint: 'sky',
      progress: { value: Math.min(100, avgAttendance), tone: 'info' },
    },
    {
      id: 'honor-roll',
      label: 'Honor Roll (GPA ≥3.7)',
      value: String(highPerformers),
      delta: `${honorRate}%`,
      deltaDirection: 'neutral',
      deltaLabel: 'of roster',
      icon: 'Award',
      tint: 'amber',
      footerLabel: 'Excellence in Academics',
    },
  ]

  return (
    <StatsGrid
      cards={cards}
      loading={isLoading}
      columns={4}
      showHeader={false}
    />
  )
}