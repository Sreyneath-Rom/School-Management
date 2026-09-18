/**
 * Validate email format.
 *
 * Same shape as the backend's Zod `.email()` validator: a `local@domain`
 * with at least one dot after the `@`. Not RFC 5322 complete — neither is
 * the backend.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength.
 *
 * Matches the backend's rule exactly: 8-128 characters, at least one
 * non-whitespace character. No composition requirements — the backend
 * deliberately omits them (composition rules push users toward predictable
 * patterns without measurably improving entropy).
 *
 * Do NOT add uppercase/digit/symbol requirements here without also adding
 * them to the backend. A frontend-only rule rejects valid passwords and
 * trains users to work around the UI.
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    password.trim().length > 0
  );
};

/**
 * Validate phone number.
 *
 * Loose on purpose — the backend stores `phone` as a free-form string, so
 * this is a client-side sanity check, not an enforcement boundary.
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL format.
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate that a string has content after trimming.
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate minimum string length.
 */
export const hasMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validate maximum string length.
 */
export const hasMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validate that a number is within an inclusive range.
 */
export const isNumberInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Check if a value is a finite number (or a string coercible to one).
 *
 * Uses `Number.isFinite` instead of the global `isFinite` — the global
 * coerces strings and returns `true` for `" "`, `null`, and `[]`.
 */
export const isNumber = (value: unknown): value is number => {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string' && value.trim() !== '') {
    return Number.isFinite(Number(value));
  }
  return false;
};

/**
 * Validate that a string parses as an ISO `YYYY-MM-DD` date.
 *
 * `Date.parse` alone accepts `"2026-13-45"` as a string — the regex is
 * what enforces the shape.
 */
export const isValidDateFormat = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const parsed = Date.parse(dateString);
  if (Number.isNaN(parsed)) return false;
  // Confirm round-trip: `Date.parse("2026-02-31")` returns a valid date in
  // some engines, and `"2026-13-01"` in others. Comparing the ISO output
  // catches both.
  return new Date(parsed).toISOString().slice(0, 10) === dateString;
};

/**
 * Validate that a date is in the past.
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() < Date.now();
};

/**
 * Validate that a date is in the future.
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() > Date.now();
};