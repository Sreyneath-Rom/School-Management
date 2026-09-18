/**
 * Format a date as "Jan 15, 2024".
 */
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return '—';
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date and time as "Jan 15, 2024 10:30 AM".
 */
export const formatDateTime = (
  date: Date | string,
  locale = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return '—';
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format just the time portion as "10:30 AM".
 */
export const formatTime = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return '—';
  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a number as currency, e.g. "$1,234.56".
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format an already-scaled percentage value.
 *
 * Expects a value in 0–100 (e.g. `attendanceRate: 93.3` from the backend).
 * For a ratio (0–1), use `formatRatio`.
 *
 * This name used to mean "multiply by 100", which produced `9330.0%` when
 * fed the backend's already-scaled values.
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a ratio (0–1) as a percentage, e.g. `0.933` → `"93.3%"`.
 */
export const formatRatio = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a 10-digit US phone number as "(555) 123-4567". Other shapes
 * are returned unchanged — the backend stores `phone` as a free-form
 * string, so this is a display-only formatter.
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Truncate a string to a maximum length, appending an ellipsis if cut.
 */
export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Format a byte count as "2.5 MB", "512 KB", etc.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Derive a letter grade from a numeric score (0–100).
 * Returns `null` for an invalid score.
 */
export const formatGradeLetter = (
  score: number | null | undefined
): string | null => {
  if (score == null || Number.isNaN(score)) return null;
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};