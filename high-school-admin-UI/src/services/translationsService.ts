// src/services/translationsService.ts
import { apiClient } from '@/lib/apiClient'

// Flat { key: value } map for a single language — matches what
// GET/PATCH /translations/:code returns on the backend.
export type TranslationsForLanguage = Record<string, string>

export interface AutoTranslateEntry {
  key: string
  text: string // the English source string to translate from
}

export interface AutoTranslateResult {
  translations: TranslationsForLanguage
  // Keys the provider failed to translate (rate limit, empty response,
  // network hiccup) — still worth surfacing so the admin knows which few
  // strings need a manual pass rather than assuming everything filled in.
  failedKeys: string[]
}

export const translationsService = {
  get: (code: string) =>
    apiClient.get<TranslationsForLanguage>(`/translations/${encodeURIComponent(code)}`),

  // Bulk upsert. Only send the keys that actually changed — the backend
  // upserts key-by-key inside a transaction, so a partial payload merges
  // with what's already stored rather than replacing it.
  upsert: (code: string, translations: TranslationsForLanguage) =>
    apiClient.patch<TranslationsForLanguage>(`/translations/${encodeURIComponent(code)}`, {
      translations,
    }),

  // Machine-translates a batch of English source entries into `code` and
  // persists the results server-side. Best-effort: check `failedKeys` for
  // anything that needs a manual translation afterward.
  autoTranslate: (code: string, entries: AutoTranslateEntry[]) =>
    apiClient.post<AutoTranslateResult>(
      `/translations/${encodeURIComponent(code)}/auto-translate`,
      { entries },
    ),

  removeKey: (code: string, key: string) =>
    apiClient.delete<void>(
      `/translations/${encodeURIComponent(code)}/${encodeURIComponent(key)}`,
    ),
}