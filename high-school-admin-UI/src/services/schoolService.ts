// src/services/schoolService.ts
import { apiClient, apiUpload } from '@/lib/apiClient'
import type { School, SchoolFormState } from '@/types/school'
import { schoolFormToPayload } from '@/types/school'

export type SchoolModel = School
export type { SchoolFormState }

/**
 * Save-or-create. The backend's `/schools/setup` endpoint creates the row
 * on first call and updates on subsequent calls. Use this for the setup
 * page.
 */
function formToApiPayload(form: Partial<SchoolFormState>) {
  // Reuse the shared mapper for the fields that pass through unchanged,
  // then strip anything the backend doesn't accept as a top-level column.
  const full = schoolFormToPayload({
    name: form.name ?? '',
    logoUrl: form.logoUrl ?? '',
    address: form.address ?? '',
    phone: form.phone ?? '',
    email: form.email ?? '',
    academicYear: form.academicYear ?? '',
    website: form.website ?? '',
    motto: form.motto ?? '',
    timeZone: form.timeZone ?? '',
    dateFormat: form.dateFormat ?? '',
    language: form.language ?? '',
  })

  // Only include fields the caller actually set — the backend's PATCH
  // is partial.
  const out: Record<string, unknown> = {}
  if (form.name !== undefined) out.name = form.name
  if (form.logoUrl !== undefined) out.logoUrl = form.logoUrl || null
  if (form.address !== undefined) out.address = form.address || null
  if (form.phone !== undefined) out.phone = form.phone || null
  if (form.email !== undefined) out.email = form.email || null
  if (form.academicYear !== undefined) out.academicYear = form.academicYear
  if (
    form.website !== undefined ||
    form.motto !== undefined ||
    form.timeZone !== undefined ||
    form.dateFormat !== undefined ||
    form.language !== undefined
  ) {
    out.settings = full.settings
  }
  return out
}

export const schoolService = {
  getSchool: () => apiClient.get<SchoolModel>('/schools'),

  saveSchool: (payload: Partial<SchoolFormState>) =>
    apiClient.patch<SchoolModel>('/schools/setup', formToApiPayload(payload)),

  updateSchool: (payload: Partial<SchoolFormState>) =>
    apiClient.patch<SchoolModel>('/schools', formToApiPayload(payload)),

  uploadLogo: (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    return apiUpload<SchoolModel>('/schools/logo', formData)
  },

  removeLogo: () => apiClient.delete<SchoolModel>('/schools/logo'),
}