/**
 * Formatters
 */
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatCurrency,
  formatPercentage,
  formatPhoneNumber,
  truncateText,
  formatFileSize,
} from './formatters';

/**
 * Validators
 */
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

/**
 * Helpers
 */
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

/**
 * Constants
 */
export {
  USER_ROLES,
  STUDENT_STATUS,
  ATTENDANCE_STATUS,
  GRADE_LETTERS,
  DAYS_OF_WEEK,
  MONTHS,
  LEAVE_TYPES,
  LEAVE_STATUS,
  API_ENDPOINTS,
  LOCAL_STORAGE_KEYS,
  DATE_FORMATS,
  PAGINATION,
  ERROR_CODES,
} from './constants';

/**
 * Error Messages
 */
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

/**
 * Date Utilities
 */
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

/**
 * File Utilities
 */
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

/**
 * String Utilities
 */
export {
  slugify,
  sanitizeHTML,
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

/**
 * Role & Permissions Utilities
 */
export {
  ROLE_PERMISSIONS,
  hasPermission,
  canAccessSection,
  getRoleLabel,
  getRoleColor,
  type UserRole,
} from './rolePermissions';
