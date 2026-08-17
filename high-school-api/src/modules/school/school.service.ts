import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const schoolService = {
  async get() {
    const school = await prisma.school.findFirst()
    if (!school) throw ApiError.notFound('School has not been configured yet')
    return school
  },

  /**
   * Single-tenant upsert. Prisma's `upsert()` needs a unique `where` to
   * target a row, but a school row created via `create()` gets an
   * auto-generated id we don't know ahead of time — so a plain
   * find-then-create/update has a race: two concurrent first-time saves
   * can both see "no existing row" and both call `create()`, leaving two
   * School rows despite this being meant as a singleton.
   *
   * Wrapping the read+write in a serializable transaction closes that
   * window (requires a DB that supports SERIALIZABLE isolation, e.g.
   * Postgres). The more bulletproof long-term fix is a DB-level
   * constraint — e.g. a `singleton boolean @unique @default(true)`
   * column on School — so a second insert fails outright instead of
   * relying on transaction isolation to prevent it.
   */
  async upsert(input: Record<string, unknown>) {
    return prisma.$transaction(
      async (tx) => {
        const existing = await tx.school.findFirst()
        return existing
          ? tx.school.update({ where: { id: existing.id }, data: input })
          : tx.school.create({ data: input as never })
      },
      { isolationLevel: 'Serializable' }
    )
  },

  async updateLogo(logoUrl: string) {
    const existing = await prisma.school.findFirst()
    if (!existing) {
      throw ApiError.notFound('School has not been configured yet — save the school profile before uploading a logo')
    }
    return prisma.school.update({ where: { id: existing.id }, data: { logoUrl } })
  },
}