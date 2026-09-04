// src/services/languagesService.ts
import { apiClient } from '@/lib/apiClient'

export interface LanguageRecord {
  id: string
  code: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateLanguagePayload {
  code: string
  name: string
}

export interface UpdateLanguagePayload {
  name: string
}

// Thin wrapper around GET/POST/PATCH/DELETE /languages — mirrors the shape
// of roleService/schoolService. Returns the raw backend records (no `flag`
// field); callers that need a `LanguageDef` (code/name/flag) should map
// through `getFlagFromLanguageCode` from '@/i18n' themselves, since flag
// lookup is presentation-only and doesn't belong on the wire format.
export const languagesService = {
  list: () => apiClient.get<LanguageRecord[]>('/languages'),

  create: (payload: CreateLanguagePayload) =>
    apiClient.post<LanguageRecord>('/languages', payload),

  update: (code: string, payload: UpdateLanguagePayload) =>
    apiClient.patch<LanguageRecord>(`/languages/${encodeURIComponent(code)}`, payload),

  remove: (code: string) => apiClient.delete<void>(`/languages/${encodeURIComponent(code)}`),
}