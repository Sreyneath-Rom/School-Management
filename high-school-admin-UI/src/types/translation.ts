// src/types/translation.ts

/**
 * A supported language.
 *
 * English (`code: 'en'`) is reserved — it's the frontend's built-in
 * source language and is never stored as a Language row.
 */
export interface Language {
  id: string
  code: string
  name: string
  nativeName: string | null
  rtl: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * A single translation override for a language.
 */
export interface Translation {
  id: string
  languageCode: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

/**
 * Response shape from `GET /translations/:code` — a `{ key: value }` map,
 * not an array. The frontend uses it directly as its i18n dictionary.
 */
export type TranslationMap = Record<string, string>

/**
 * Payload for `PATCH /translations/:code` — the full set to upsert.
 *
 * The backend caps this at 5000 keys per request.
 */
export interface UpsertTranslationsPayload {
  translations: TranslationMap
}

/**
 * Payload for `POST /translations/:code/auto-translate`.
 *
 * `entries` is the source strings (typically English) to translate. The
 * backend caps this at 100 entries per request — its provider refuses
 * batches above that.
 */
export interface AutoTranslatePayload {
  entries: Array<{ key: string; text: string }>
}

/**
 * Response from auto-translate — the updated dictionary plus the keys the
 * provider failed on. Partial failure is normal with a free provider under
 * rate limits.
 */
export interface AutoTranslateResponse {
  translations: TranslationMap
  failedKeys: string[]
}

/**
 * Payload for creating a language.
 */
export interface CreateLanguagePayload {
  code: string
  name: string
  nativeName?: string
  rtl?: boolean
  isActive?: boolean
}

/**
 * Update payload. `code` is immutable after creation — a language's code
 * is the join key for every translation row.
 */
export interface UpdateLanguagePayload {
  name?: string
  nativeName?: string
  rtl?: boolean
  isActive?: boolean
}