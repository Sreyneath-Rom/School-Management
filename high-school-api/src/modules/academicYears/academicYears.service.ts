import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type { PrismaClient } from '@/generated/prisma/client'

const editableFields = {
  name: true,
  startDate: true,
  endDate: true,
  status: true,
  termsCount: true,
  classesCount: true,
  studentsCount: true,
  description: true,
} as const

type AcademicYearInput = {
  name?: string
  startDate?: Date
  endDate?: Date
  status?: 'Active' | 'Upcoming' | 'Archived'
  termsCount?: number
  classesCount?: number
  studentsCount?: number
  description?: string
}

async function ensureDatesAreOrdered(startDate?: Date, endDate?: Date) {
  if (startDate && endDate && startDate >= endDate) {
    throw ApiError.badRequest('startDate must be earlier than endDate')
  }
}

export const academicYearsService = {
  async list() {
    return prisma.academicYear.findMany({ orderBy: { startDate: 'desc' } })
  },

  async getById(id: string) {
    const year = await prisma.academicYear.findUnique({ where: { id } })
    if (!year) throw ApiError.notFound('Academic year not found')
    return year
  },

  async create(input: Required<Pick<AcademicYearInput, 'name' | 'startDate' | 'endDate'>> & AcademicYearInput) {
    await ensureDatesAreOrdered(input.startDate, input.endDate)
    const existing = await prisma.academicYear.findUnique({ where: { name: input.name } })
    if (existing) throw ApiError.conflict(`Academic year "${input.name}" already exists`)

    return prisma.$transaction(async (tx: PrismaClient) => {
      if (input.status === 'Active') {
        await tx.academicYear.updateMany({ data: { isCurrent: false }, where: { isCurrent: true } })
      }
      return tx.academicYear.create({
        data: { ...input, isCurrent: input.status === 'Active' },
      })
    })
  },

  async update(id: string, input: AcademicYearInput) {
    const year = await academicYearsService.getById(id)
    await ensureDatesAreOrdered(input.startDate ?? year.startDate, input.endDate ?? year.endDate)

    if (input.name && input.name !== year.name) {
      const existing = await prisma.academicYear.findUnique({ where: { name: input.name } })
      if (existing) throw ApiError.conflict(`Academic year "${input.name}" already exists`)
    }

    const data = Object.fromEntries(Object.entries(input).filter(([key]) => key in editableFields))
    return prisma.$transaction(async (tx: PrismaClient) => {
      if (input.status === 'Active') {
        await tx.academicYear.updateMany({ data: { isCurrent: false }, where: { isCurrent: true, id: { not: id } } })
      }
      return tx.academicYear.update({
        where: { id },
        data: { ...data, ...(input.status ? { isCurrent: input.status === 'Active' } : {}) },
      })
    })
  },

  async setCurrent(id: string) {
    await academicYearsService.getById(id)
    return prisma.$transaction(async (tx: PrismaClient) => {
      await tx.academicYear.updateMany({ data: { isCurrent: false }, where: { isCurrent: true, id: { not: id } } })
      return tx.academicYear.update({ where: { id }, data: { isCurrent: true, status: 'Active' } })
    })
  },

  async remove(id: string) {
    const year = await academicYearsService.getById(id)
    if (year.isCurrent) throw ApiError.conflict('Cannot delete the current academic year')
    if (year.classesCount > 0 || year.studentsCount > 0) {
      throw ApiError.conflict('Cannot delete an academic year containing classes or students')
    }
    await prisma.academicYear.delete({ where: { id } })
  },
}
