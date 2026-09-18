import { z } from 'zod'
import { MAX_BATCH_SIZE } from '@/utils/translationProvider'

/**
 * Language codes follow the same rules as the languages module: 2-5
 * lowercase letters. Enforced here rather than relying on the
 * `assertLanguageExists` check, because the DB lookup would silently return
 * "not found" for a malformed code, and the caller can't tell a typo from a
 * missing language.
 */
const languageCode = z
  .string()
  .trim()
  .regex(/^[a-z]{2,5}$/i, 'code must be 2-5 letters')
  .transform((v) => v.toLowerCase())

/**
 * Translation keys are dotted identifiers like `grades.edit` or
 * `nav.dashboard.title`. Allowed characters: lowercase letters, digits,
 * dots, hyphens, underscores. Capped at 200 chars.
 *
 * NOTE on URL safety: the `removeKey` route uses `/:code/:key`, so the key
 * appears in a path segment. Characters like `/` would break routing, and
 * characters like `?` or `#` would break query parsing. The regex below
 * excludes all of them. If you ever need to allow a broader character set,
 * switch that route to use a query param (`?key=...`) or POST body.
 */
const translationKey = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    'key may only contain letters, digits, dots, hyphens, and underscores'
  )

/**
 * A `{ key: value }` map. Value strings are capped at 2000 chars — a UI
 * label or message; longer suggests a client bug or an attempt to store a
 * document in a translation field.
 */
const translationsMap = z.record(
  translationKey,
  z.string().max(2000, 'translation values are limited to 2000 characters')
)

/**
 * Bulk upsert. Two caps:
 *
 *   - `.refine` requires at least one entry (no no-op writes)
 *   - `max(5000)` bounds the request. A language with 5000 UI strings is a
 *     lot; 20 000 is a sign the client is sending the wrong payload.
 */
export const upsertTranslationsSchema = z.object({
  translations: translationsMap.refine(
    (map) => Object.keys(map).length <= 5000,
    'a single upsert is limited to 5000 translation keys'
  ),
})

/**
 * Auto-translate input. The client sends the English source strings
 * (the frontend owns `key -> English` in its i18n bundle; the backend has
 * no independent copy).
 *
 * The upper bound matches `MAX_BATCH_SIZE` from the translation provider —
 * not a magic number here — so a payload that passes validation will not
 * be rejected by the provider. The previous version hardcoded 200 while
 * the provider refused anything over 100, producing a confusing 500 for
 * batches of 101-200.
 */
export const autoTranslateSchema = z.object({
  entries: z
    .array(
      z.object({
        key: translationKey,
        text: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(
      MAX_BATCH_SIZE,
      `a single auto-translate is limited to ${MAX_BATCH_SIZE} entries`
    ),
})

/**
 * Param schema for routes with a `:code` path segment. The transform
 * lowercases so the service and the DB query agree on the key.
 */
export const translationCodeParamSchema = z.object({
  code: languageCode,
})

/**
 * Param schema for `DELETE /:code/:key`.
 */
export const translationKeyParamSchema = z.object({
  code: languageCode,
  key: translationKey,
})

export type UpsertTranslationsBody = z.infer<typeof upsertTranslationsSchema>
export type AutoTranslateBody = z.infer<typeof autoTranslateSchema>
export type TranslationCodeParam = z.infer<typeof translationCodeParamSchema>
export type TranslationKeyParam = z.infer<typeof translationKeyParamSchema>