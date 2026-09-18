import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateAcademicYearBody,
  UpdateAcademicYearBody,
} from './academicYears.validation'

/**
 * Input types re-declared at the service boundary so this file doesn't depend
 * on the Zod schemas directly. The controller is the only layer that knows
 * about HTTP and validation; the service knows about the domain.
 */
export interface CreateAcademicYearInput {
  name: string
  startDate: Date
  endDate: Date
  status?: 'Active' | 'Upcoming' | 'Archived'
  termsCount?: number
  classesCount?: number
  studentsCount?: number
  description?: string
}

export type UpdateAcademicYearInput = Partial<CreateAcademicYearInput>

/**
 * NOTE — `termsCount`, `classesCount`, `studentsCount` are treated as
 * client-supplied columns here, matching the current schema. They should
 * almost certainly be derived from Prisma `_count` relations instead:
 *
 *   include: { _count: { select: { terms: true, classes: true, students: true } } }
 *
 * and then projected in the response. The delete guard below trusts these
 * columns — a client that PATCHes `classesCount: 0` while classes still exist
 * defeats it. If these become derived, the guard should query for actual
 * child rows instead:
 *
 *   const counts = await prisma.academicYear.findUnique({
 *     where: { id },
 *     select: { _count: { select: { classes: true, students: true } } },
 *   })
 */

function ensureDatesAreOrdered(startDate?: Date, endDate?: Date) {
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

  async create(input: CreateAcademicYearBody) {
    ensureDatesAreOrdered(input.startDate, input.endDate)

    const existing = await prisma.academicYear.findUnique({
      where: { name: input.name },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict(`Academic year "${input.name}" already exists`)
    }

    const willBeCurrent = input.status === 'Active'

    // Transaction so "clear the old current" and "create the new one" are
    // atomic — a crash between them would leave the system with zero current
    // academic years.
    return prisma.$transaction(async (tx) => {
      if (willBeCurrent) {
        await tx.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        })
      }
      return tx.academicYear.create({
        data: { ...input, isCurrent: willBeCurrent },
      })
    })
  },

  async update(id: string, input: UpdateAcademicYearBody) {
    const year = await academicYearsService.getById(id)

    ensureDatesAreOrdered(
      input.startDate ?? year.startDate,
      input.endDate ?? year.endDate
    )

    if (input.name && input.name !== year.name) {
      const existing = await prisma.academicYear.findUnique({
        where: { name: input.name },
        select: { id: true },
      })
      if (existing) {
        throw ApiError.conflict(`Academic year "${input.name}" already exists`)
      }
    }

    const willBeCurrent = input.status ? input.status === 'Active' : undefined

    return prisma.$transaction(async (tx) => {
      if (willBeCurrent === true) {
        await tx.academicYear.updateMany({
          where: { isCurrent: true, id: { not: id } },
          data: { isCurrent: false },
        })
      }
      return tx.academicYear.update({
        where: { id },
        data: {
          ...input,
          ...(willBeCurrent !== undefined ? { isCurrent: willBeCurrent } : {}),
        },
      })
    })
  },

  async setCurrent(id: string) {
    await academicYearsService.getById(id)

    return prisma.$transaction(async (tx) => {
      await tx.academicYear.updateMany({
        where: { isCurrent: true, id: { not: id } },
        data: { isCurrent: false },
      })
      return tx.academicYear.update({
        where: { id },
        data: { isCurrent: true, status: 'Active' },
      })
    })
  },

  async remove(id: string) {
    const year = await academicYearsService.getById(id)

    if (year.isCurrent) {
      throw ApiError.conflict(
        'Cannot delete the current academic year. Set another year as current first.'
      )
    }

    if (year.classesCount > 0 || year.studentsCount > 0) {
      throw ApiError.conflict(
        'Cannot delete an academic year that still contains classes or students'
      )
    }

    await prisma.academicYear.delete({ where: { id } })
  },
}