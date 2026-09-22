// src/types/attendance.ts

/**
 * Attendance status — matches the backend's `AttendanceStatus` Prisma
 * enum exactly. Uppercase; the API rejects lowercase values.
 */
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'

/**
 * A single attendance record as returned by the API.
 */
export interface AttendanceRecord {
  id: string
  studentId: string
  date: string // ISO date (UTC midnight)
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  note: string | null
  createdAt: string

  // Convenience flat fields used by rosters and drawers
  studentName?: string
  studentCode?: string
  studentAvatar?: string
  class?: string | null

  // Hydrated relations
  student?: {
    id: string
    studentCode: string
    user: { id: string; firstName: string; lastName: string; email: string }
    class: { id: string; name: string; gradeLevel: number } | null
  }
}

/**
 * A row returned for a student with no attendance record on the requested
 * day. The `id` has an `unmarked:` prefix — it is NOT a database id and
 * cannot be PATCHed or DELETEd. To "edit" it, POST a check-in for that
 * student and date.
 */
export interface UnmarkedAttendanceRow {
  id: string // "unmarked:<studentId>:<yyyy-mm-dd>"
  studentId: string
  date: string
  status: 'ABSENT'
  checkIn: null
  checkOut: null
  note: null
  createdAt: string
  studentName?: string
  studentCode?: string
  studentAvatar?: string
  class?: string | null
  student: NonNullable<AttendanceRecord['student']>
}

export type AttendanceListRow = AttendanceRecord | UnmarkedAttendanceRow

/**
 * Detect an unmarked row so UI can render it differently (e.g. gray text,
 * "Not yet marked" label).
 */
export function isUnmarkedRow(
  row: AttendanceListRow
): row is UnmarkedAttendanceRow {
  return row.id.startsWith('unmarked:')
}

/**
 * Attendance summary returned by `GET /attendance/stats` and by the
 * student profile endpoint. Every key is present even when the count is
 * zero — the backend returns a fixed shape.
 */
export interface AttendanceStats {
  date: string // yyyy-mm-dd
  total: number
  present: number
  absent: number
  late: number
  excused: number
  /**
   * Attendance rate in 0-100. Already scaled by the backend — do NOT
   * multiply by 100 before formatting.
   */
  attendanceRate: number

  // Convenience aliases
  presentToday?: number
  absentToday?: number
  lateToday?: number
  pendingExcuses?: number
  perfectAttendanceCount?: number
}

/**
 * Query parameters for `GET /attendance`.
 *
 * `date` and `from`/`to` are mutually exclusive — passing both returns a
 * 400. Use `date` for a single-day view, `from`/`to` for a range.
 */
export interface AttendanceListQuery {
  studentId?: string
  classId?: string
  date?: string // yyyy-mm-dd
  from?: string // yyyy-mm-dd
  to?: string // yyyy-mm-dd
}

/**
 * Payload for `POST /attendance/check-in` — creates or updates a single
 * student's attendance for one day.
 */
export interface CheckInPayload {
  studentId: string
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  note?: string
}

/**
 * Payload for `POST /attendance/bulk` — the common "mark the whole class"
 * flow.
 *
 * The backend caps this at 500 records per request.
 */
export interface BulkMarkPayload {
  date: string
  records: Array<{
    studentId: string
    status: AttendanceStatus
    checkIn?: string
    checkOut?: string
    note?: string
  }>
}

/**
 * Payload for `PATCH /attendance/:id`.
 */
export interface UpdateAttendancePayload {
  status?: AttendanceStatus
  checkIn?: string | null
  checkOut?: string | null
  note?: string | null
}

/**
 * Human-readable label per status — for dropdowns and badges.
 */
export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
}

/**
 * Tailwind color tokens per status — for badges, pills, and status dots.
 *
 * Uses the semantic tokens from `globals.css`
 * (`--color-success` / `--color-info` / `--color-warning` / `--color-error`)
 * instead of raw Tailwind shades. Those variables flip with the theme, so
 * a badge written once renders correctly in both light and dark mode
 * without a `dark:` variant on every class.
 *
 * The `/15`-style opacity modifiers resolve through `color-mix` against
 * the CSS variable — Tailwind 4 handles this without a fixed hex value.
 */
export const ATTENDANCE_COLORS: Record<
  AttendanceStatus,
  { bg: string; text: string; ring: string }
> = {
  PRESENT: {
    bg: 'bg-success/15',
    text: 'text-success',
    ring: 'ring-success/30',
  },
  ABSENT: {
    bg: 'bg-error/15',
    text: 'text-error',
    ring: 'ring-error/30',
  },
  LATE: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    ring: 'ring-warning/30',
  },
  EXCUSED: {
    bg: 'bg-info/15',
    text: 'text-info',
    ring: 'ring-info/30',
  },
}