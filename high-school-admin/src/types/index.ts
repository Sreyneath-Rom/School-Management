export interface StatCard {
  id: string
  label: string
  value: string
  delta: string
  deltaDirection: 'up' | 'down' | 'neutral'
  deltaLabel: string
  icon: string
  tint: 'blue' | 'green' | 'amber' | 'violet' | 'sky' | 'red'
}

export interface AttendanceDay {
  day: string
  value: number
}

export interface EnrollmentSlice {
  grade: string
  count: number
  color: string
}

export interface EventItem {
  id: string
  day: string
  month: string
  title: string
  time: string
}

export interface ActivityItem {
  id: string
  icon: 'enrolled' | 'grade' | 'homework' | 'leave' | 'announcement'
  title: string
  subtitle: string
  time: string
}

export interface LeaveRequestItem {
  id: string
  name: string
  grade: string
  dateRange: string
  status: 'Pending' | 'Approved' | 'Rejected'
  avatar: string
}

export interface AnnouncementItem {
  id: string
  title: string
  body: string
  time: string
}

export type NavLink = {
  label: string
  icon: string
  path: string
  active?: boolean
}

export type NavSection = {
  heading: string
  links: NavLink[]
}
