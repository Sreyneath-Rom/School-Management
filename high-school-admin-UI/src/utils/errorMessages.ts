/**
 * Authentication errors.
 *
 * These mirror what the backend returns so the UI can show a message even
 * when the response body is empty (e.g. a network error before the request
 * reaches the server).
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid token',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  REFRESH_FAILED: 'Could not refresh session. Please log in again.',
} as const;

/**
 * Validation errors.
 *
 * The password message matches the backend's actual rule — 8 to 128
 * characters, no composition requirements. Do not add "must contain an
 * uppercase letter" here without also adding it server-side; the mismatch
 * rejects valid passwords.
 */
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must not exceed ${max} characters`,
} as const;

export const FORM_ERRORS = {
  SUBMISSION_FAILED: 'Failed to submit form. Please try again',
  REQUIRED_FIELDS: 'Please fill out all required fields',
  INVALID_DATA: 'Invalid data provided',
} as const;

export const STUDENT_ERRORS = {
  STUDENT_NOT_FOUND: 'Student not found',
  INVALID_STUDENT_ID: 'Invalid student ID',
  ENROLLMENT_FAILED: 'Failed to enroll student',
  CANNOT_DELETE_STUDENT: 'Cannot delete student with active enrollments',
} as const;

export const TEACHER_ERRORS = {
  TEACHER_NOT_FOUND: 'Teacher not found',
  INVALID_TEACHER_ID: 'Invalid teacher ID',
  ASSIGNMENT_FAILED: 'Failed to assign class to teacher',
} as const;

export const ATTENDANCE_ERRORS = {
  ATTENDANCE_NOT_FOUND: 'Attendance record not found',
  INVALID_ATTENDANCE_DATE: 'Invalid attendance date',
  MARK_FAILED: 'Failed to mark attendance',
} as const;

export const GRADE_ERRORS = {
  GRADE_NOT_FOUND: 'Grade not found',
  INVALID_GRADE_VALUE: 'Invalid grade value',
  SUBMISSION_FAILED: 'Failed to submit grades',
} as const;

export const LEAVE_ERRORS = {
  LEAVE_NOT_FOUND: 'Leave request not found',
  INVALID_DATES: 'Invalid leave dates',
  OVERLAPPING_LEAVE: 'Leave request overlaps with existing leave',
  SUBMISSION_FAILED: 'Failed to submit leave request',
} as const;

export const SERVER_ERRORS = {
  INTERNAL_ERROR: 'An internal server error occurred',
  DATABASE_ERROR: 'Database error. Please try again later',
  SERVICE_UNAVAILABLE: 'Service is unavailable. Please try again later',
  TIMEOUT: 'Request timeout. Please try again',
} as const;

export const SUCCESS_MESSAGES = {
  SAVED_SUCCESSFULLY: 'Saved successfully',
  DELETED_SUCCESSFULLY: 'Deleted successfully',
  UPDATED_SUCCESSFULLY: 'Updated successfully',
  CREATED_SUCCESSFULLY: 'Created successfully',
  SUBMITTED_SUCCESSFULLY: 'Submitted successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
} as const;

export const WARNING_MESSAGES = {
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  UNSAVED_CHANGES: 'You have unsaved changes',
  SESSION_EXPIRING: 'Your session is about to expire',
} as const;