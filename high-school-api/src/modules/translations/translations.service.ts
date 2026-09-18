import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { translateBatch, type TranslateEntry } from '@/utils/translationProvider'

/**
 * English is built-in on the frontend (never a stored Language row), so it's
 * exempt from the "does this language exist" check — you can still fetch/save
 * 'en' overrides if you ever want admin-editable English.
 */
const RESERVED_CODE = 'en'

/**
 * Confirms the language exists before allowing reads or writes against it.
 *
 * `en` is exempt because the frontend treats it as the built-in default. A
 * caller who sends an invalid code like `zz` gets a 404 naming the code,
 * not a mysterious empty result.
 */
async function assertLanguageExists(code: string): Promise<void> {
  if (code === RESERVED_CODE) return
  const language = await prisma.language.findUnique({
    where: { code },
    select: { code: true },
  })
  if (!language) {
    throw ApiError.notFound(`Language "${code}" is not configured`)
  }
}

/**
 * Runs a batch of upsert operations inside a single transaction.
 *
 * Extracted because `upsert` and `autoTranslate` both need the same "apply
 * N key/value pairs atomically" behavior. Using `Promise.all` inside the
 * `$transaction` callback would parallelize the writes on one connection,
 * which Prisma disallows — the array form `$transaction([...promises])` is
 * what the callback-less overload supports, and it's what we use here.
 */
async function upsertTranslations(
  languageCode: string,
  entries: Array<[key: string, value: string]>
): Promise<void> {
  if (entries.length === 0) return

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.translation.upsert({
        where: { languageCode_key: { languageCode, key } },
        update: { value },
        create: { languageCode, key, value },
      })
    )
  )
}

export const translationsService = {
  /**
   * Returns the language's full key/value map. A language with no
   * translations yet returns `{}` — indistinguishable from "nothing stored"
   * is intentional; the frontend falls back to its English bundle.
   */
  async get(code: string) {
    await assertLanguageExists(code)

    const rows = await prisma.translation.findMany({
      where: { languageCode: code },
      select: { key: true, value: true },
    })

    return Object.fromEntries(rows.map((row) => [row.key, row.value]))
  },

  /**
   * Bulk upsert. The map is applied atomically — a failure partway through
   * rolls back the whole batch, so a client never sees "some keys saved,
   * some didn't".
   *
   * Returns the full, current set for the language (not just the changes),
   * matching the frontend's save-and-reload flow.
   */
  async upsert(code: string, translations: Record<string, string>) {
    await assertLanguageExists(code)

    const entries = Object.entries(translations)
    await upsertTranslations(code, entries)

    return translationsService.get(code)
  },

  /**
   * Machine-translates a batch of `{ key, text }` English source entries
   * into `code`, persists the successful ones via the same upsert path as
   * a manual save, and returns the full set plus which keys failed.
   *
   * Partial failure is expected with a free provider under rate limits — a
   * batch of 50 might come back 48 translated and 2 failed. That's not an
   * error condition; the client gets the failures listed and can retry
   * those keys alone.
   */
  async autoTranslate(code: string, entries: TranslateEntry[]) {
    if (code === RESERVED_CODE) {
      throw ApiError.badRequest(
        'English is the source language and cannot be auto-translated into itself'
      )
    }
    await assertLanguageExists(code)

    const results = await translateBatch(entries, code)

    const translatedPairs: Array<[string, string]> = results
      .filter(
        (r): r is { key: string; translated: string } => r.translated !== null
      )
      .map((r) => [r.key, r.translated])

    const failedKeys = results
      .filter((r) => r.translated === null)
      .map((r) => r.key)

    await upsertTranslations(code, translatedPairs)

    const current = await translationsService.get(code)
    return { translations: current, failedKeys }
  },

  /**
   * Removes a single override. The key falls back to the frontend's built-in
   * English string on the next render.
   */
  async removeKey(code: string, key: string) {
    const existing = await prisma.translation.findUnique({
      where: { languageCode_key: { languageCode: code, key } },
      select: { id: true },
    })
    if (!existing) {
      throw ApiError.notFound('Translation override not found')
    }

    await prisma.translation.delete({ where: { id: existing.id } })
  },
}