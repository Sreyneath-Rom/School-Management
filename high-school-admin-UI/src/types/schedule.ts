// src/types/schedule.ts

/**
 * Day of week. Matches the backend's `Schedule.dayOfWeek` indexing:
 * 0 = Sunday, 6 = Saturday.
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * A timetable slot as returned by the API.
 */
export interface Schedule {
  id: string
  classId: string
  subjectId: string
  teacherId: string
  dayOfWeek: DayOfWeek
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
  room: string | null
  createdAt: string
  updatedAt: string

  // Hydrated relations
  class?: { id: string; name: string; gradeLevel: number }
  subject?: { id: string; name: string; code: string }
  teacher?: {
    id: string
    teacherCode: string
    user: { id: string; firstName: string; lastName: string }
  }
}

/**
 * Payload for creating a schedule entry.
 *
 * The backend refuses overlapping entries on the same day for the same
 * teacher, class, or room.
 */
export interface CreateSchedulePayload {
  classId: string
  subjectId: string
  teacherId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  room?: string
}

export type UpdateSchedulePayload = Partial<CreateSchedulePayload>

/**
 * Query parameters for `GET /schedules`.
 */
export interface ListSchedulesQuery {
  classId?: string
  teacherId?: string
  subjectId?: string
  room?: string
  dayOfWeek?: DayOfWeek
  page?: number
  limit?: number
}

/**
 * Display labels for days of the week.
 *
 * Order matches the backend's indexing — `DAY_LABELS[0]` is `'Sunday'`,
 * `DAY_LABELS[1]` is `'Monday'`, etc.
 */
export const DAY_LABELS: readonly string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/** Monday-first order for calendars and weekly grids. */
export const WEEK_DISPLAY_ORDER: readonly DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]