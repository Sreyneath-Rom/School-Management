// src/types/school.ts

/**
 * School profile as returned by `GET /schools`.
 *
 * Matches the backend's School model. The `settings` bag is JSON — the
 * backend stores it opaquely, so its shape is a client-side contract. If
 * you need a field the model doesn't have (motto, time zone, date format),
 * either add a column via migration or store it inside `settings`.
 */
export interface School {
  id: string
  name: string
  logoUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  academicYear: string
  settings: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

/**
 * Form state for the school settings page.
 *
 * Fields are a superset of the API's School — the extra ones (website,
 * motto, time zone, etc.) either live inside `settings` or need a backend
 * schema addition. The submit handler maps this down to what the API
 * accepts; see `schoolFormToPayload`.
 */
export interface SchoolFormState {
  name: string
  logoUrl: string
  address: string
  phone: string
  email: string
  academicYear: string

  // Stored inside `settings`:
  website: string
  motto: string
  timeZone: string
  dateFormat: string
  language: string
}

export type GradeScale = {
  id: string
  grade: string
  minScore: number
  maxScore: number
  point: number
  description: string
  passing: boolean
}

/**
 * Map the form state down to the two shapes the API accepts: the direct
 * columns and the JSON `settings` bag.
 */
export function schoolFormToPayload(form: SchoolFormState): {
  name: string
  logoUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  academicYear: string
  settings: Record<string, unknown>
} {
  return {
    name: form.name,
    logoUrl: form.logoUrl || null,
    address: form.address || null,
    phone: form.phone || null,
    email: form.email || null,
    academicYear: form.academicYear,
    settings: {
      website: form.website,
      motto: form.motto,
      timeZone: form.timeZone,
      dateFormat: form.dateFormat,
      language: form.language,
    },
  }
}