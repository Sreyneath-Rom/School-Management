import { z } from 'zod'

export const upsertTranslationsSchema = z
  .object({
    translations: z.record(z.string()),
  })
  .refine((data) => Object.keys(data.translations).length > 0, {
    message: 'translations must include at least one key',
  })

export const autoTranslateSchema = z
  .object({
    // The frontend owns the English source strings (src/i18n/strings.ts) —
    // the backend has no independent copy of "key -> English text", so the
    // client sends exactly what needs translating rather than the backend
    // guessing at source text from whatever's already stored.
    entries: z
      .array(
        z.object({
          key: z.string().min(1),
          text: z.string().min(1),
        })
      )
      .min(1)
      .max(200), // keeps a single request well under the free provider's practical batch size
  })