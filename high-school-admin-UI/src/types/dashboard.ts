// src/types/dashboard.ts

/**
 * UI-only display types for the dashboard.
 *
 * These are NOT API shapes — they're view models that dashboard components
 * render. Every one of them is produced by a client-side mapper that
 * composes data from one or more API endpoints.
 *
 * Keeping them separate from the API types makes the boundary explicit:
 * when a dashboard widget breaks, the file to check is either the mapper
 * (if the data is wrong) or the widget (if the display is wrong), not the
 * API types.
 */

/**
 * A single metric tile at the top of the dashboard.
 *
 * `delta` and `deltaDirection` are display-only — the backend doesn't
 * compute week-over-week changes, so the mapper that builds these does
 * the comparison against a cached or fetched previous period.
 */
export interface StatCard {
  id: string
  label: string
  value: string
  delta: string
  deltaDirection: 'up' | 'down' | 'neutral'
  deltaLabel: string
  icon: string
  tint:
    | 'blue'
    | 'green'
    | 'amber'
    | 'violet'
    | 'sky'
    | 'red'
    | 'pink'
    | 'purple'
    | 'orange'
    | 'emerald'
  footerLabel?: string
  miniGraphicType?:
    | 'wave-blue'
    | 'bars-teal'
    | 'wave-purple'
    | 'ring-orange'
    | 'bars-pink'
    | 'ring-blue'
    | 'users-purple'
    | 'calendar-mint'
}

/**
 * A single day's attendance figure for the weekly trend chart.
 */
export interface AttendanceDay {
  day: string
  value: number
}

/**
 * A slice of the enrollment-by-grade donut chart.
 */
export interface EnrollmentSlice {
  grade: string
  count: number
  color: string
}

/**
 * An upcoming calendar event.
 */
export interface EventItem {
  id: string
  day: string
  month: string
  title: string
  time: string
}

/**
 * An entry in the recent-activity feed.
 */
export interface ActivityItem {
  id: string
  icon: 'enrolled' | 'grade' | 'homework' | 'leave' | 'announcement'
  title: string
  subtitle: string
  time: string
}

/**
 * A pending leave request as displayed on the dashboard.
 *
 * NOTE — the `status` values here are PascalCase, while the backend's
 * `LeaveStatus` enum is UPPERCASE (`PENDING` / `APPROVED` / `REJECTED`).
 * If this type is populated from an actual API call, the mapper must
 * lowercase the values. If it's coming from local fixtures, keep the
 * PascalCase — the two aren't interchangeable.
 */
export interface LeaveRequestItem {
  id: string
  name: string
  grade: string
  dateRange: string
  status: 'Pending' | 'Approved' | 'Rejected'
  avatar: string
}

/**
 * A recent announcement as displayed on the dashboard.
 */
export interface AnnouncementItem {
  id: string
  title: string
  body: string
  time: string
}

/**
 * A single navigation link in the sidebar.
 */
export type NavLink = {
  label: string
  icon: string
  path: string
  active?: boolean
}

/**
 * A group of navigation links with a heading.
 */
export type NavSection = {
  heading: string
  links: NavLink[]
}

/**
 * A generic status used by status pills in tables and cards. This is a
 * display union, not a backend enum — each table maps its own enum values
 * to one of these for consistent rendering.
 */
export type Status =
  | 'Draft'
  | 'Upcoming'
  | 'Active'
  | 'Completed'
  | 'Archived'
  | 'Inactive'