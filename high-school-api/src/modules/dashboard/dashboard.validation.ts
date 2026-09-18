import { z } from 'zod'

/**
 * Cohorts are addressed by URL-safe slugs, not display labels. The previous
 * version used the literal strings `"Upper Sec (10-12)"` and
 * `"Lower Sec (7-9)"` as query values — spaces and parentheses survive the
 * round trip but invite URL-encoding bugs and make typos silent (any
 * unrecognized value falls through to "no filter"). Slugs are unambiguous.
 *
 * If the client needs the human-readable label, that's a presentation
 * concern — keep the mapping on the frontend.
 */
export const COHORTS = ['all', 'lower-secondary', 'upper-secondary'] as const
export type Cohort = (typeof COHORTS)[number]

/**
 * Normalizes any accepted date input to UTC midnight, same rule as the
 * attendance module. Without this, `?from=2026-09-18` and
 * `?from=2026-09-18T08:30Z` would produce different filter bounds for the
 * same calendar day.
 */
const dateOnly = z.coerce.date().transform((d) => {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  )
})

export const statsQuerySchema = z.object({
  cohort: z.enum(COHORTS).default('all'),
})

export const attendanceSummaryQuerySchema = z
  .object({
    from: dateOnly.optional(),
    to: dateOnly.optional(),
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    message: '`from` must be on or before `to`',
    path: ['to'],
  })

export const gradeSummaryQuerySchema = z.object({
  subjectId: z.string().cuid().optional(),
  classId: z.string().cuid().optional(),
  periodLabel: z.string().trim().min(1).max(64).optional(),
})

export type StatsQuery = z.infer<typeof statsQuerySchema>
export type AttendanceSummaryQuery = z.infer<
  typeof attendanceSummaryQuerySchema
>
export type GradeSummaryQuery = z.infer<typeof gradeSummaryQuerySchema>