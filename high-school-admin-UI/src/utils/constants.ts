/**
 * User roles.
 *
 * The backend seeds exactly four roles with these lowercase names. Any
 * additional role in the DB is not a system role and won't match
 * `requireRole(...)` checks in the API.
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Student active status.
 *
 * The backend exposes only `active` / `inactive` on User.isActive. There is
 * no separate Student status column — `SUSPENDED` and `GRADUATED` were
 * removed because the API has no way to persist them.
 */
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type StudentStatus =
  (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

/**
 * Attendance status.
 *
 * Matches the backend's `AttendanceStatus` Prisma enum exactly. Values are
 * uppercase — lowercase strings return `400 Invalid enum value` from the API.
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

/**
 * Leave request status.
 *
 * Matches the backend's `LeaveStatus` Prisma enum. There is no `CANCELLED`
 * state — cancelling a pending request is a DELETE, not a status change.
 */
export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type LeaveStatus = (typeof LEAVE_STATUS)[keyof typeof LEAVE_STATUS];

/**
 * Grade period.
 *
 * Matches the backend's `GradePeriod` Prisma enum.
 */
export const GRADE_PERIOD = {
  MONTHLY: 'MONTHLY',
  SEMESTER: 'SEMESTER',
  ANNUAL: 'ANNUAL',
} as const;

export type GradePeriod = (typeof GRADE_PERIOD)[keyof typeof GRADE_PERIOD];

/**
 * Notification channel.
 *
 * Matches the backend's `NotificationChannel` Prisma enum.
 */
export const NOTIFICATION_CHANNEL = {
  PUSH: 'PUSH',
  EMAIL: 'EMAIL',
  IN_APP: 'IN_APP',
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL];

/**
 * Grade letters for display only.
 *
 * The backend stores numeric scores; letter grades are a client-side
 * presentation derived from the score. Update the thresholds here if the
 * school's grade scale differs.
 */
export const GRADE_LETTERS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
} as const;

/**
 * Grade scale thresholds — score >= min gets the letter.
 * Order matters: first match wins, so list highest first.
 */
export const GRADE_SCALE = [
  { letter: 'A', min: 90 },
  { letter: 'B', min: 80 },
  { letter: 'C', min: 70 },
  { letter: 'D', min: 60 },
  { letter: 'F', min: 0 },
] as const;

/**
 * Days of the week.
 *
 * Index matters: `Schedule.dayOfWeek` in the backend is `0 = Sunday .. 6 =
 * Saturday`. This array is in the same order so `DAYS_OF_WEEK.indexOf(name)`
 * and `DAYS_OF_WEEK[dayNumber]` both work without a translation step.
 *
 * If you need to render the week starting on Monday, iterate an explicit
 * display order — do not sort this array.
 */
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

/** Display order starting Monday — for calendars and week grids. */
export const WEEK_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/**
 * Months.
 */
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * Leave reason categories.
 *
 * The backend has no `type` field on LeaveRequest — only a free-text
 * `reason`. These categories are a client-side helper for a select dropdown;
 * the chosen label is written into `reason`. If you need to query or filter
 * by category later, the backend needs a `type` enum column.
 */
export const LEAVE_CATEGORIES = {
  SICK: 'Sick leave',
  PERSONAL: 'Personal leave',
  MEDICAL: 'Medical appointment',
  EMERGENCY: 'Family emergency',
  OTHER: 'Other',
} as const;

/**
 * API endpoints — paths relative to the client's base URL.
 *
 * The `apiClient` prepends `VITE_API_URL` (which already includes
 * `/api/v1`). These values must NOT include that prefix, or requests will
 * hit `/api/v1/api/v1/...` and 404.
 *
 * Note the plural `HOMEWORKS` — the backend route is `/homeworks`, not
 * `/homework`.
 */
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  SCHOOL: '/schools',
  ACADEMIC_YEARS: '/academic-years',
  TERMS: '/terms',
  ROOMS: '/rooms',
  GRADE_LEVELS: '/grade-levels',
  CLASSES: '/classes',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  SUBJECTS: '/subjects',
  SCHEDULES: '/schedules',
  LESSONS: '/lessons',
  HOMEWORK: '/homeworks',
  QUIZZES: '/quizzes',
  GRADES: '/grades',
  EXAMS: '/exams',
  ATTENDANCE: '/attendance',
  LEAVES: '/leaves',
  ANNOUNCEMENTS: '/announcements',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  LANGUAGES: '/languages',
  TRANSLATIONS: '/translations',
} as const;

/**
 * Local storage keys.
 *
 * `AUTH_TOKEN` and `REFRESH_TOKEN` are read by `apiClient` — changing them
 * without updating that file will silently break authentication.
 */
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  PREFERENCES: 'preferences',
} as const;

/**
 * Date formats (for date-fns, dayjs, or any formatter that accepts these
 * tokens — not used by the native `Intl` API).
 */
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'HH:mm:ss',
  DATE_TIME: 'MMM dd, yyyy HH:mm',
  ISO_DATE: 'yyyy-MM-dd',
} as const;

/**
 * Pagination defaults.
 *
 * `DEFAULT_PAGE_SIZE` is what the UI sends explicitly on every list call.
 * The backend's fallback (when no `limit` is passed) is 20.
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * HTTP status codes.
 *
 * Prefer `ApiError`'s typed getters (`err.isAuth`, `err.isForbidden`,
 * `err.isValidation`) where possible — these constants are for the rare
 * case where you only have a raw status number.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;