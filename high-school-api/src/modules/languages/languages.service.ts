import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateLanguageBody,
  UpdateLanguageBody,
} from './languages.validation'

/**
 * English is the built-in default the frontend always has — it's not stored
 * as a Language row. See the comment on `create`/`remove` for what that
 * means for the API surface.
 */
const RESERVED_CODE = 'en'

export const languagesService = {
  async list() {
    return prisma.language.findMany({ orderBy: { name: 'asc' } })
  },

  async create(input: CreateLanguageBody) {
    // `code` arrives already lowercased by the validation schema, but a
    // direct service call from another module wouldn't go through Zod. Do
    // the normalization here too so the invariant holds regardless of the
    // caller.
    const code = input.code.toLowerCase()

    if (code === RESERVED_CODE) {
      throw ApiError.conflict(
        'English is the built-in default language and cannot be added'
      )
    }

    const existing = await prisma.language.findUnique({
      where: { code },
      select: { code: true },
    })
    if (existing) {
      throw ApiError.conflict(`Language "${code}" already exists`)
    }

    return prisma.language.create({
      data: {
        code,
        name: input.name,
        ...(input.nativeName !== undefined ? { nativeName: input.nativeName } : {}),
        rtl: input.rtl,
        isActive: input.isActive,
      },
    })
  },

  async update(rawCode: string, input: UpdateLanguageBody) {
    const code = rawCode.toLowerCase()

    const existing = await prisma.language.findUnique({
      where: { code },
      select: { code: true },
    })
    if (!existing) throw ApiError.notFound('Language not found')

    return prisma.language.update({
      where: { code },
      data: input,
    })
  },

  /**
   * Deletes a language and every translation row that belongs to it.
   *
   * The previous version relied on the FK being configured with
   * `onDelete: Cascade`. If the Prisma schema doesn't have that — or someone
   * later changes it — this throws P2003 (foreign key violation), which the
   * error handler maps to a generic 409 with no actionable message. Deleting
   * translations explicitly in a transaction is idempotent and doesn't depend
   * on the FK's cascade setting.
   *
   * Both operations run in one transaction: a crash between them would leave
   * the language gone but its translations orphaned.
   */
  async remove(rawCode: string) {
    const code = rawCode.toLowerCase()

    if (code === RESERVED_CODE) {
      throw ApiError.badRequest('English cannot be removed')
    }

    const existing = await prisma.language.findUnique({
      where: { code },
      select: { code: true, name: true },
    })
    if (!existing) throw ApiError.notFound('Language not found')

    const translationCount = await prisma.translation.count({
      where: { languageCode: code },
    })

    await prisma.$transaction([
      // Explicit delete regardless of the FK cascade rule. `deleteMany` is
      // a no-op when there are zero rows, so this is safe even when the count
      // above is 0.
      prisma.translation.deleteMany({ where: { languageCode: code } }),
      prisma.language.delete({ where: { code } }),
    ])

    return { code, name: existing.name, deletedTranslations: translationCount }
  },
}