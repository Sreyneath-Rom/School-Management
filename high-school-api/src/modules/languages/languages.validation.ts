import { z } from 'zod'

/**
 * Language codes follow BCP 47's primary subtag rules: 2-3 letters for ISO
 * 639-1/639-2/639-3, plus a handful of 4-5 letter codes used by some
 * regional variants. Lowercased on the wire so the unique key and the
 * Translation.languageCode foreign key agree.
 *
 * Everything normalizes to lowercase here rather than in the service, so a
 * value that reaches the service is already canonical — the previous version
 * normalized in `update`/`remove` but not `create`, which meant a direct
 * service call with `"EN"` would store `"EN"` while an update for `"en"`
 * would look up a different row.
 */
const code = z
  .string()
  .trim()
  .regex(/^[a-z]{2,5}$/i, 'code must be 2-5 letters')
  .transform((v) => v.toLowerCase())

export const createLanguageSchema = z.object({
  code,
  name: z.string().trim().min(1).max(80),
  /**
   * Optional model fields. If `Language` has these columns, they're part of
   * the contract; if not, delete them. The frontend's language switcher
   * typically wants `nativeName` ("ខ្មែរ" rather than "Khmer") and `rtl` for
   * right-to-left scripts.
   */
  nativeName: z.string().trim().min(1).max(80).optional(),
  rtl: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

/**
 * Update schema: `code` is immutable after creation.
 *
 * A language's code is its identity — it's the join key for every
 * `Translation` row and every `?lang=xx` query string a client has ever
 * sent. Letting it change would orphan translations and break existing URLs.
 * To rename, create a new language and migrate rows explicitly.
 */
export const updateLanguageSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    nativeName: z.string().trim().min(1).max(80).optional(),
    rtl: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

export type CreateLanguageBody = z.infer<typeof createLanguageSchema>
export type UpdateLanguageBody = z.infer<typeof updateLanguageSchema>