import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const schoolService = {
  // CREATE
  // Wrapped in the same serializable-transaction pattern as `upsert` below
  // — without it, two concurrent POST / calls (or a POST / racing a
  // PATCH /setup) can both see "no existing row" and both insert,
  // producing two School rows despite this being meant as a singleton.
  async create(input: Record<string, unknown>) {
    return prisma.$transaction(
      async (tx: any) => {
        const existing = await tx.school.findFirst()
        if (existing) throw ApiError.conflict('School is already configured')
        return tx.school.create({ data: input as never })
      },
      { isolationLevel: 'Serializable' }
    )
  },

  // READ
  async get() {
    const school = await prisma.school.findFirst()
    if (!school) throw ApiError.notFound('School not configured')
    return school
  },

  // UPDATE
  async update(input: Record<string, unknown>) {
    const existing = await prisma.school.findFirst()
    if (!existing) throw ApiError.notFound('School not configured')
    return prisma.school.update({
      where: { id: existing.id },
      data: input,
    })
  },

  // UPSERT (used by setup page)
  async upsert(input: Record<string, unknown>) {
    return prisma.$transaction(
      async (tx: any) => {
        const existing = await tx.school.findFirst()
        if (existing) {
          return tx.school.update({ where: { id: existing.id }, data: input })
        }
        return tx.school.create({ data: input as never })
      },
      { isolationLevel: 'Serializable' }
    )
  },

  // DELETE
  async remove() {
    const existing = await prisma.school.findFirst()
    if (!existing) throw ApiError.notFound('School not configured')
    await prisma.school.delete({ where: { id: existing.id } })
    return { message: 'School deleted successfully' }
  },

  // LOGO – upload
  async updateLogo(logoUrl: string) {
    const existing = await prisma.school.findFirst()
    if (!existing) throw ApiError.notFound('Create school before uploading logo')
    return prisma.school.update({
      where: { id: existing.id },
      data: { logoUrl },
    })
  },

  // LOGO – remove
  async removeLogo() {
    const existing = await prisma.school.findFirst()
    if (!existing) throw ApiError.notFound('School not configured')
    return prisma.school.update({
      where: { id: existing.id },
      data: { logoUrl: null },
    })
  },
}