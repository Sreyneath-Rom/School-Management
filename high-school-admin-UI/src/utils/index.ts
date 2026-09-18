/**
 * Barrel file for the utils module.
 *
 * Keep exports grouped by source file so that removing a helper doesn't
 * silently break a downstream import — every name here maps 1:1 to a
 * declaration in one of the sibling files.
 */

// ---- Formatters ----
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatCurrency,
  formatPercentage,
  formatRatio,
  formatPhoneNumber,
  truncateText,
  formatFileSize,
  formatGradeLetter,
} from './formatters';

// ---- Validators ----
export {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidURL,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  isNumberInRange,
  isNumber,
  isValidDateFormat,
  isPastDate,
  isFutureDate,
} from './validators';

// ---- Helpers ----
export {
  capitalize,
  capitalizeWords,
  toKebabCase,
  toSnakeCase,
  toCamelCase,
  deepClone,
  mergeObjects,
  getRandomElement,
  shuffleArray,
  removeDuplicates,
  groupBy,
  flattenArray,
  getArrayDifference,
  isEmpty,
  sleep,
  debounce,
  throttle,
} from './helpers';

// ---- Constants ----
export {
  USER_ROLES,
  STUDENT_STATUS,
  ATTENDANCE_STATUS,
  LEAVE_STATUS,
  GRADE_PERIOD,
  NOTIFICATION_CHANNEL,
  GRADE_LETTERS,
  GRADE_SCALE,
  DAYS_OF_WEEK,
  WEEK_DISPLAY_ORDER,
  MONTHS,
  LEAVE_CATEGORIES,
  API_ENDPOINTS,
  LOCAL_STORAGE_KEYS,
  DATE_FORMATS,
  PAGINATION,
  HTTP_STATUS,
} from './constants';

export type {
  UserRole,
  StudentStatus,
  AttendanceStatus,
  LeaveStatus,
  GradePeriod,
  NotificationChannel,
  DayOfWeek,
} from './constants';

// ---- Error messages ----
export {
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  FORM_ERRORS,
  STUDENT_ERRORS,
  TEACHER_ERRORS,
  ATTENDANCE_ERRORS,
  GRADE_ERRORS,
  LEAVE_ERRORS,
  SERVER_ERRORS,
  SUCCESS_MESSAGES,
  WARNING_MESSAGES,
} from './errorMessages';

// ---- Date utilities ----
export {
  getCurrentDate,
  addDays,
  subtractDays,
  getDaysBetween,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  getAge,
  formatRelativeTime,
} from './dateUtils';

// ---- File utilities ----
export {
  isValidImage,
  isValidDocument,
  isValidFileSize,
  getFileExtension,
  getFileSizeInMB,
  fileToBase64,
  validateFileUpload,
  downloadFile,
  urlToBlob,
  compressImage,
} from './fileUtils';

// ---- String utilities ----
export {
  slugify,
  escapeHtml,
  stripHTMLTags,
  toBase64,
  fromBase64,
  generateRandomString,
  generateUUID,
  countWords,
  reverseString,
  isPalindrome,
  highlightSearchTerm,
  splitByDelimiters,
  getStringBetween,
  replaceMultiple,
  escapeRegex,
  matchPattern,
} from './stringUtils';

// ---- Role & permission display ----
export {
  ROLE_DISPLAY,
  getRoleLabel,
  getRoleColor,
  hasPermission,
} from './rolePermissions';

// ---- Asset URLs ----
export { resolveAssetUrl } from './resolveAssetUrl';

// ---- Greeting ----
export { getUserGreeting, getGreetingForUser } from './userGreeting';