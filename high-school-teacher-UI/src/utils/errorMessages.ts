/**
 * Authentication errors
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid token',
} as const;

/**
 * Validation errors
 */
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must not exceed ${max} characters`,
} as const;

/**
 * Form errors
 */
export const FORM_ERRORS = {
  SUBMISSION_FAILED: 'Failed to submit form. Please try again',
  REQUIRED_FIELDS: 'Please fill out all required fields',
  INVALID_DATA: 'Invalid data provided',
} as const;

/**
 * Student errors
 */
export const STUDENT_ERRORS = {
  STUDENT_NOT_FOUND: 'Student not found',
  INVALID_STUDENT_ID: 'Invalid student ID',
  ENROLLMENT_FAILED: 'Failed to enroll student',
  CANNOT_DELETE_STUDENT: 'Cannot delete student with active enrollments',
} as const;

/**
 * Teacher errors
 */
export const TEACHER_ERRORS = {
  TEACHER_NOT_FOUND: 'Teacher not found',
  INVALID_TEACHER_ID: 'Invalid teacher ID',
  ASSIGNMENT_FAILED: 'Failed to assign class to teacher',
} as const;

/**
 * Attendance errors
 */
export const ATTENDANCE_ERRORS = {
  ATTENDANCE_NOT_FOUND: 'Attendance record not found',
  INVALID_ATTENDANCE_DATE: 'Invalid attendance date',
  MARK_FAILED: 'Failed to mark attendance',
} as const;

/**
 * Grade errors
 */
export const GRADE_ERRORS = {
  GRADE_NOT_FOUND: 'Grade not found',
  INVALID_GRADE_VALUE: 'Invalid grade value',
  SUBMISSION_FAILED: 'Failed to submit grades',
} as const;

/**
 * Leave errors
 */
export const LEAVE_ERRORS = {
  LEAVE_NOT_FOUND: 'Leave request not found',
  INVALID_DATES: 'Invalid leave dates',
  OVERLAPPING_LEAVE: 'Leave request overlaps with existing leave',
  SUBMISSION_FAILED: 'Failed to submit leave request',
} as const;

/**
 * Server errors
 */
export const SERVER_ERRORS = {
  INTERNAL_ERROR: 'An internal server error occurred',
  DATABASE_ERROR: 'Database error. Please try again later',
  SERVICE_UNAVAILABLE: 'Service is unavailable. Please try again later',
  TIMEOUT: 'Request timeout. Please try again',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED_SUCCESSFULLY: 'Saved successfully',
  DELETED_SUCCESSFULLY: 'Deleted successfully',
  UPDATED_SUCCESSFULLY: 'Updated successfully',
  CREATED_SUCCESSFULLY: 'Created successfully',
  SUBMITTED_SUCCESSFULLY: 'Submitted successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
} as const;

/**
 * Warning messages
 */
export const WARNING_MESSAGES = {
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  UNSAVED_CHANGES: 'You have unsaved changes',
  SESSION_EXPIRING: 'Your session is about to expire',
} as const;
