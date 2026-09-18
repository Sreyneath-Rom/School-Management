// src/features/dashboard/dashboardCards.ts
import type { StatCard } from '@/types'
import type { DashboardStats } from '@/services/dashboardService'
import type { AttendanceStats } from '@/types/attendance'

/**
 * Card shells for the dashboard KPI grid. Values are filled in by
 * `applyDashboardStats`; the empty placeholder `—` renders until then.
 *
 * Cards whose metric has no backend endpoint yet (`gpa`, `assignments`,
 * `events`) keep `value: '—'`. When a real endpoint lands, add a case to
 * the switch inside `applyDashboardStats` — no change to this file.
 */
export const DASHBOARD_CARDS: StatCard[] = [
  {
    id: 'students',
    label: 'Total Students',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'GraduationCap',
    tint: 'blue',
    miniGraphicType: 'wave-blue',
    footerLabel: 'Active students',
  },
  {
    id: 'teachers',
    label: 'Total Teachers',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'Users',
    tint: 'emerald',
    miniGraphicType: 'bars-teal',
    footerLabel: 'Faculty on record',
  },
  {
    id: 'classes',
    label: 'Total Classes',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'BookOpen',
    tint: 'purple',
    miniGraphicType: 'wave-purple',
    footerLabel: 'Active sections',
  },
  {
    id: 'attendance',
    label: 'Attendance Rate',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'FileText',
    tint: 'orange',
    miniGraphicType: 'ring-orange',
    footerLabel: 'Current period',
  },
  {
    id: 'pending-leaves',
    label: 'Pending Leaves',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'ClipboardList',
    tint: 'violet',
    miniGraphicType: 'ring-blue',
    footerLabel: 'Awaiting review',
  },
  {
    id: 'gpa',
    label: 'Average GPA',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'Star',
    tint: 'pink',
    miniGraphicType: 'bars-pink',
    footerLabel: 'Not yet available',
  },
  {
    id: 'assignments',
    label: 'Completed Assignments',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'FileCheck2',
    tint: 'sky',
    miniGraphicType: 'bars-teal',
    footerLabel: 'Not yet available',
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    value: '—',
    delta: '',
    deltaDirection: 'neutral',
    deltaLabel: '',
    icon: 'CalendarClock',
    tint: 'emerald',
    miniGraphicType: 'calendar-mint',
    footerLabel: 'Not yet available',
  },
]

/**
 * Fills in each card's `value` from live data. Cards with no source in the
 * current API response keep their placeholder — no guessing, no zeroes.
 */
export function applyDashboardStats(
  cards: StatCard[],
  stats: DashboardStats | null,
  attendance: AttendanceStats | null
): StatCard[] {
  return cards.map((card) => {
    let value = card.value

    switch (card.id) {
      case 'students':
        if (stats) value = stats.studentCount.toLocaleString()
        break
      case 'teachers':
        if (stats) value = stats.teacherCount.toLocaleString()
        break
      case 'classes':
        if (stats) value = stats.classCount.toLocaleString()
        break
      case 'pending-leaves':
        if (stats) value = stats.pendingLeaveRequests.toLocaleString()
        break
      case 'attendance':
        // attendanceRate is 0-100 from the backend — do not multiply.
        if (attendance) value = `${attendance.attendanceRate}%`
        break
      // 'gpa', 'assignments', 'events' — no source yet.
    }

    return value === card.value ? card : { ...card, value }
  })
}