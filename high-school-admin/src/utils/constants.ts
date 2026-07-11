/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

/**
 * Student status
 */
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated',
} as const;

/**
 * Attendance status
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
  HALF_DAY: 'half_day',
} as const;

/**
 * Grade letters
 */
export const GRADE_LETTERS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  F: 'F',
} as const;

/**
 * Days of week
 */
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Months
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
 * Leave types
 */
export const LEAVE_TYPES = {
  SICK: 'sick',
  CASUAL: 'casual',
  MEDICAL: 'medical',
  EMERGENCY: 'emergency',
  PERSONAL: 'personal',
} as const;

/**
 * Leave status
 */
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  STUDENTS: '/api/students',
  TEACHERS: '/api/teachers',
  CLASSES: '/api/classes',
  SUBJECTS: '/api/subjects',
  ATTENDANCE: '/api/attendance',
  GRADES: '/api/grades',
  LEAVES: '/api/leaves',
  ANNOUNCEMENTS: '/api/announcements',
} as const;

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  PREFERENCES: 'preferences',
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'HH:mm:ss',
  DATE_TIME: 'MMM dd, yyyy HH:mm',
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
} as const;
