import type { StatCard } from '@/types'

// Stat cards for the Attendance page header grid. `value` here is the
// placeholder shown before `attendanceService.getStats()` resolves —
// once it does, `AttendanceStatsGrid`'s `overrides` map replaces it,
// exactly like `statCards` + `StatsGrid`'s overrides do on the Dashboard.
export const attendanceStatCards: StatCard[] = [
  { id: 'present', label: 'Present Today', value: '0', delta: '+2.1%', deltaDirection: 'up', deltaLabel: 'vs yesterday', tint: 'green', icon: 'UserCheck' },
  { id: 'absent', label: 'Absent Today', value: '0', delta: '-0.8%', deltaDirection: 'down', deltaLabel: 'vs yesterday', tint: 'red', icon: 'Users' },
  { id: 'late', label: 'Late Arrivals', value: '0', delta: '+1.2%', deltaDirection: 'up', deltaLabel: 'vs yesterday', tint: 'amber', icon: 'ClipboardList' },
  { id: 'rate', label: 'Attendance Rate', value: '0%', delta: '+0.4%', deltaDirection: 'up', deltaLabel: 'vs last week', tint: 'blue', icon: 'GraduationCap' },
  { id: 'excuses', label: 'Pending Excuses', value: '0', delta: '-3', deltaDirection: 'down', deltaLabel: 'vs last week', tint: 'violet', icon: 'UserRound' },
  { id: 'perfect', label: 'Perfect Attendance', value: '0', delta: '+12', deltaDirection: 'up', deltaLabel: 'vs last month', tint: 'sky', icon: 'BookOpen' },
]

// Weekly attendance rate, same shape as `attendanceData` (`{ day, value }`)
// so it drops straight into the same `AreaChart` setup as `AttendanceChart`.
export const attendanceTrendData = [
  { day: 'Mon', value: 96 },
  { day: 'Tue', value: 94 },
  { day: 'Wed', value: 97 },
  { day: 'Thu', value: 93 },
  { day: 'Fri', value: 91 },
]

// Present-student headcount by grade, same shape as `enrollmentData`
// (`{ grade, count, color }` with real hex colors for the Pie `fill`).
export const attendanceByGradeData = [
  { grade: 'Grade 9', count: 215, color: '#0ea5e9' },
  { grade: 'Grade 10', count: 214, color: '#10b981' },
  { grade: 'Grade 11', count: 207, color: '#f59e0b' },
  { grade: 'Grade 12', count: 206, color: '#8b5cf6' },
]

export const todayAbsentees = [
  { id: 'a1', name: 'Liam Carter', grade: 'Grade 10-A', reason: 'Sick leave', avatar: 'LC' },
  { id: 'a2', name: 'Maya Chen', grade: 'Grade 11-B', reason: 'Family emergency', avatar: 'MC' },
  { id: 'a3', name: 'Noah Bennett', grade: 'Grade 9-C', reason: 'Unexcused', avatar: 'NB' },
  { id: 'a4', name: 'Ava Rodriguez', grade: 'Grade 12-A', reason: 'Medical appointment', avatar: 'AR' },
]

export const recentCheckIns = [
  { id: 'c1', icon: 'checkin', title: 'Sophie Turner checked in', subtitle: 'Grade 11-B • Main Gate', time: '2m ago' },
  { id: 'c2', icon: 'late', title: 'Ethan Walsh marked late', subtitle: 'Grade 10-A • Homeroom', time: '14m ago' },
  { id: 'c3', icon: 'verified', title: 'Attendance verified for 9-C', subtitle: 'Homeroom teacher: Ms. Alvarez', time: '32m ago' },
  { id: 'c4', icon: 'checkout', title: 'Early dismissal logged', subtitle: 'Grade 12-A • James Foster', time: '48m ago' },
]

export const pendingExcuseRequests = [
  { id: 'e1', name: 'Noah Bennett', avatar: 'NB', grade: 'Grade 9-C', dateRange: 'Jun 12 – Jun 13', status: 'Pending' },
  { id: 'e2', name: 'Priya Nair', avatar: 'PN', grade: 'Grade 10-A', dateRange: 'Jun 14', status: 'Pending' },
  { id: 'e3', name: 'Diego Alvarez', avatar: 'DA', grade: 'Grade 11-B', dateRange: 'Jun 10 – Jun 11', status: 'Approved' },
]

export const attendanceAlerts = [
  {
    id: 'al1',
    title: 'Chronic Absenteeism Flag',
    body: '5 students in Grade 10-B have missed 3+ days this month.',
    time: '1h ago',
  },
  {
    id: 'al2',
    title: 'Repeated Tardiness',
    body: 'Ethan Walsh has been marked late 6 times in the past two weeks.',
    time: '3h ago',
  },
]