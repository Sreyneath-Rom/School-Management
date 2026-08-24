import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

// English is the built-in default the frontend always has — it's never
// stored as a Language row, so it's excluded from create/delete here.
const RESERVED_CODE = 'en'

export const languagesService = {
  async list() {
    return prisma.language.findMany({ orderBy: { name: 'asc' } })
  },

  async create(input: { code: string; name: string }) {
    if (input.code === RESERVED_CODE) {
      throw ApiError.conflict('English is the built-in default language and cannot be added')
    }

    const existing = await prisma.language.findUnique({ where: { code: input.code } })
    if (existing) throw ApiError.conflict(`Language "${input.code}" already exists`)

    return prisma.language.create({ data: input })
  },

  async update(code: string, input: { name: string }) {
    const normalized = code.toLowerCase()
    const existing = await prisma.language.findUnique({ where: { code: normalized } })
    if (!existing) throw ApiError.notFound('Language not found')

    return prisma.language.update({ where: { code: normalized }, data: input })
  },

  async remove(code: string) {
    const normalized = code.toLowerCase()
    if (normalized === RESERVED_CODE) {
      throw ApiError.badRequest('English cannot be removed')
    }

    const existing = await prisma.language.findUnique({ where: { code: normalized } })
    if (!existing) throw ApiError.notFound('Language not found')

    // Translation rows are expected to cascade-delete via the FK
    // (Translation.languageCode -> Language.code, onDelete: Cascade —
    // see the schema note in translations.service.ts).
    await prisma.language.delete({ where: { code: normalized } })
  },
}