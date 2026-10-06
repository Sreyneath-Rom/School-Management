/**
 * Normalizes any date input to UTC midnight. Every "date" field in the API
 * means "the calendar day in UTC" — storing a time component breaks the
 * attendance `studentId_date` unique constraint, causes dashboard range
 * queries to miss rows, and makes "same day" comparisons unreliable.
 */
export function toUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

/** Convenience for `z.coerce.date().transform(toUtcMidnight)` call sites. */
export const dateOnlyTransform = toUtcMidnight