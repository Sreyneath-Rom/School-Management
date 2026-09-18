/**
 * Current date and time.
 */
export const getCurrentDate = (): Date => new Date();

/**
 * Add days to a date. Negative values subtract.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from a date.
 */
export const subtractDays = (date: Date, days: number): Date =>
  addDays(date, -days);

/**
 * Number of whole days between two dates, ignoring time-of-day.
 *
 * Uses UTC-normalized timestamps so DST transitions don't produce off-by-one
 * results (a 23- or 25-hour day would otherwise round wrong).
 */
export const getDaysBetween = (date1: Date, date2: Date): number => {
  const day1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const day2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
};

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Check whether the given date is today (local time).
 */
export const isToday = (date: Date): boolean => sameDay(date, getCurrentDate());

/**
 * Check whether the given date is tomorrow (local time).
 */
export const isTomorrow = (date: Date): boolean =>
  sameDay(date, addDays(getCurrentDate(), 1));

/**
 * Check whether the given date is yesterday (local time).
 */
export const isYesterday = (date: Date): boolean =>
  sameDay(date, subtractDays(getCurrentDate(), 1));

/**
 * Check whether a date is strictly in the past.
 */
export const isPast = (date: Date): boolean => date.getTime() < Date.now();

/**
 * Check whether a date is strictly in the future.
 */
export const isFuture = (date: Date): boolean => date.getTime() > Date.now();

/**
 * Midnight at the start of the day (local time).
 */
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * The last millisecond of the day (local time).
 */
export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * First day of the month (local time).
 */
export const getStartOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Last millisecond of the month (local time).
 */
export const getEndOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * January 1st, midnight (local time).
 */
export const getStartOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * December 31st, last millisecond (local time).
 */
export const getEndOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Whole years between a birth date and today.
 *
 * This is the "age on their last birthday" that schools typically report.
 */
export const getAge = (birthDate: Date): number => {
  const today = getCurrentDate();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

/**
 * Human-readable relative time: "just now", "5 minutes ago", "2 days ago",
 * or a formatted date for anything older than a week.
 */
export const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 0) return 'in the future';
  if (seconds < 60) return 'just now';

  const plural = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? '' : 's'} ago`;

  if (seconds < 3600) return plural(Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return plural(Math.floor(seconds / 3600), 'hour');
  if (seconds < 604800) return plural(Math.floor(seconds / 86400), 'day');

  return date.toLocaleDateString();
};