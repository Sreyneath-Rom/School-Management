// src/data/terms.ts
// Single source of truth for academic term data. Both the Header (which shows
// the current term as a small status pill) and the Terms setup page (which
// manages the full list) read from here, so they can never disagree.
//
// TODO: once a terms API exists, replace INITIAL_TERMS with a fetch/query and
// keep the shape of TermItem / getActiveTerm the same so consumers don't change.

export interface TermItem {
  id: string
  name: string
  academicYear: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  examCount: number
  weightPercentage: number
  description?: string
}

export const INITIAL_TERMS: TermItem[] = [
  {
    id: 'term-1',
    name: 'Term 1 (Fall Semester)',
    academicYear: '2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2025-11-20',
    gradingDeadline: '2025-11-28',
    status: 'Completed',
    examCount: 4,
    weightPercentage: 30,
    description: 'First formal evaluation period encompassing midterms and initial assessments.',
  },
  {
    id: 'term-2',
    name: 'Term 2 (Winter Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2025-12-01',
    endDate: '2026-03-15',
    gradingDeadline: '2026-03-25',
    status: 'Active',
    examCount: 6,
    weightPercentage: 35,
    description: 'Current instructional cycle with ongoing coursework and mid-year standard examinations.',
  },
  {
    id: 'term-3',
    name: 'Term 3 (Spring Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    gradingDeadline: '2026-06-28',
    status: 'Upcoming',
    examCount: 5,
    weightPercentage: 35,
    description: 'Final academic trimester culminating in AP testing and comprehensive final examinations.',
  },
]

/**
 * Returns the term currently marked Active, falling back to the most recent
 * term by start date if none is marked Active (defensive — shouldn't happen
 * with well-formed data).
 */
export function getActiveTerm(terms: TermItem[] = INITIAL_TERMS): TermItem | undefined {
  return (
    terms.find((term) => term.status === 'Active') ??
    [...terms].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
  )
}