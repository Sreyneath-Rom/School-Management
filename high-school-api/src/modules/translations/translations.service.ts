import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { translateBatch, type TranslateEntry } from '@/utils/translationProvider'

// English is built-in on the frontend (never a stored Language row), so
// it's exempt from the "does this language exist" check below — you can
// still fetch/save 'en' overrides if you ever want admin-editable English.
const RESERVED_CODE = 'en'

/*
Assumed Prisma schema (add to schema.prisma if not already present):

model Language {
  id           String        @id @default(cuid())
  code         String        @unique
  name         String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  translations Translation[]
}

model Translation {
  id           String   @id @default(cuid())
  languageCode String
  language     Language @relation(fields: [languageCode], references: [code], onDelete: Cascade)
  key          String
  value        String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([languageCode, key])
}
*/

async function assertLanguageExists(code: string) {
  if (code === RESERVED_CODE) return
  const language = await prisma.language.findUnique({ where: { code } })
  if (!language) throw ApiError.notFound('Language not found')
}

export const translationsService = {
  async get(code: string) {
    const normalized = code.toLowerCase()
    await assertLanguageExists(normalized)

    const rows = await prisma.translation.findMany({ where: { languageCode: normalized } })
    return Object.fromEntries(rows.map((row) => [row.key, row.value]))
  },

  /**
   * Bulk upsert — mirrors the frontend's per-language editing flow
   * (TranslationManager edits one language's keys at a time, then saves
   * the whole set). Wrapped in a transaction so a failure partway through
   * can't leave some keys saved and others not.
   */
  async upsert(code: string, translations: Record<string, string>) {
    const normalized = code.toLowerCase()
    await assertLanguageExists(normalized)

    const entries = Object.entries(translations)

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.translation.upsert({
          where: { languageCode_key: { languageCode: normalized, key } },
          update: { value },
          create: { languageCode: normalized, key, value },
        })
      )
    )

    return translationsService.get(normalized)
  },

  /**
   * Machine-translates a batch of { key, text } English source entries into
   * `code` via translationProvider, then persists whatever came back
   * (skipping any entry the provider failed on) using the same upsert path
   * as a manual save. Returns the full, current translation set for the
   * language plus which of the requested keys didn't come back — a partial
   * result is expected with a free provider under rate limits, not an error
   * condition, so this doesn't throw for individual failures.
   */
  async autoTranslate(code: string, entries: TranslateEntry[]) {
    const normalized = code.toLowerCase()
    if (normalized === RESERVED_CODE) {
      throw ApiError.badRequest('English is the source language and cannot be auto-translated into itself')
    }
    await assertLanguageExists(normalized)

    const results = await translateBatch(entries, normalized)
    const translated = results.filter(
      (r): r is { key: string; translated: string } => r.translated !== null
    )
    const failedKeys = results.filter((r) => r.translated === null).map((r) => r.key)

    if (translated.length > 0) {
      await prisma.$transaction(
        translated.map(({ key, translated: value }) =>
          prisma.translation.upsert({
            where: { languageCode_key: { languageCode: normalized, key } },
            update: { value },
            create: { languageCode: normalized, key, value },
          })
        )
      )
    }

    const current = await translationsService.get(normalized)
    return { translations: current, failedKeys }
  },

  /** Removes a single override, reverting that key back to the built-in fallback on the frontend. */
  async removeKey(code: string, key: string) {
    const normalized = code.toLowerCase()
    const existing = await prisma.translation.findUnique({
      where: { languageCode_key: { languageCode: normalized, key } },
    })
    if (!existing) throw ApiError.notFound('Translation override not found')

    await prisma.translation.delete({ where: { id: existing.id } })
  },
}