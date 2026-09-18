import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

const termInclude = { academicYear: { select: { id: true, name: true } } }

async function validateDates(startDate?: Date, endDate?: Date) {
  if (startDate && endDate && startDate >= endDate) throw ApiError.badRequest('startDate must be earlier than endDate')
}

export const termsService = {
  async list(academicYearId?: string) {
    return prisma.term.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      include: termInclude,
      orderBy: { startDate: 'asc' },
    })
  },

  async getById(id: string) {
    const term = await prisma.term.findUnique({ where: { id }, include: termInclude })
    if (!term) throw ApiError.notFound('Term not found')
    return term
  },

  async create(input: { name: string; academicYearId: string; startDate: Date; endDate: Date; gradingDeadline: Date; status: string; examCount: number; weightPercentage: number; description?: string }) {
    await validateDates(input.startDate, input.endDate)
    const year = await prisma.academicYear.findUnique({ where: { id: input.academicYearId } })
    if (!year) throw ApiError.badRequest('academicYearId does not refer to an existing academic year')
    const existing = await prisma.term.findUnique({ where: { academicYearId_name: { academicYearId: input.academicYearId, name: input.name } } })
    if (existing) throw ApiError.conflict(`Term "${input.name}" already exists for this academic year`)

    return prisma.$transaction(async (tx: any) => {
      if (input.status === 'Active') await tx.term.updateMany({ where: { academicYearId: input.academicYearId, status: 'Active' }, data: { status: 'Completed' } })
      return tx.term.create({ data: input, include: termInclude })
    })
  },

  async update(id: string, input: Record<string, unknown>) {
    const existing = await termsService.getById(id)
    const startDate = input.startDate as Date | undefined
    const endDate = input.endDate as Date | undefined
    await validateDates(startDate ?? existing.startDate, endDate ?? existing.endDate)
    if (input.academicYearId) {
      const year = await prisma.academicYear.findUnique({ where: { id: String(input.academicYearId) } })
      if (!year) throw ApiError.badRequest('academicYearId does not refer to an existing academic year')
    }
    const academicYearId = String(input.academicYearId ?? existing.academicYearId)
    if (input.name || input.academicYearId) {
      const duplicate = await prisma.term.findUnique({ where: { academicYearId_name: { academicYearId, name: String(input.name ?? existing.name) } } })
      if (duplicate && duplicate.id !== id) throw ApiError.conflict('A term with this name already exists for the academic year')
    }
    return prisma.$transaction(async (tx: any) => {
      if (input.status === 'Active') await tx.term.updateMany({ where: { academicYearId, status: 'Active', id: { not: id } }, data: { status: 'Completed' } })
      return tx.term.update({ where: { id }, data: input as never, include: termInclude })
    })
  },

  async setActive(id: string) {
    const existing = await termsService.getById(id)
    return prisma.$transaction(async (tx: any) => {
      await tx.term.updateMany({ where: { academicYearId: existing.academicYearId, status: 'Active', id: { not: id } }, data: { status: 'Completed' } })
      return tx.term.update({ where: { id }, data: { status: 'Active' }, include: termInclude })
    })
  },

  async remove(id: string) {
    const term = await termsService.getById(id)
    if (term.status === 'Active') throw ApiError.conflict('Cannot delete the active term')
    if (term.examCount > 0) throw ApiError.conflict('Cannot delete a term with registered exams')
    await prisma.term.delete({ where: { id } })
  },
}
