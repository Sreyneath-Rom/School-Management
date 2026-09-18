import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateGradeLevelBody,
  ListGradeLevelsQuery,
  UpdateGradeLevelBody,
} from './gradeLevels.validation'

/**
 * Uniqueness checks against `code` and `name`. `excludeId` lets the update
 * path check "is any OTHER row using this value" without a second query.
 */
async function assertUnique(
  values: { code?: string; name?: string },
  excludeId?: string
) {
  const checks = await Promise.all([
    values.code
      ? prisma.gradeLevel.findUnique({
          where: { code: values.code },
          select: { id: true, code: true },
        })
      : null,
    values.name
      ? prisma.gradeLevel.findUnique({
          where: { name: values.name },
          select: { id: true, name: true },
        })
      : null,
  ])

  const [codeHit, nameHit] = checks
  if (codeHit && codeHit.id !== excludeId) {
    throw ApiError.conflict(`Grade level code "${codeHit.code}" already exists`)
  }
  if (nameHit && nameHit.id !== excludeId) {
    throw ApiError.conflict(`Grade level "${nameHit.name}" already exists`)
  }
}

export const gradeLevelsService = {
  async list(query: ListGradeLevelsQuery) {
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: 'insensitive' as const } },
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { alias: { contains: query.search, mode: 'insensitive' as const } },
              {
                headCoordinator: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'levelOrder'
    const orderBy = [
      { [primarySort]: query.sortOrder },
      // Stable tiebreaker — without it, pagination can skip or duplicate
      // rows that share the same primary sort value.
      ...(primarySort !== 'name' ? [{ name: 'asc' as const }] : []),
    ]

    const [items, total] = await Promise.all([
      prisma.gradeLevel.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.gradeLevel.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async getById(id: string) {
    const level = await prisma.gradeLevel.findUnique({ where: { id } })
    if (!level) throw ApiError.notFound('Grade level not found')
    return level
  },

  async create(input: CreateGradeLevelBody) {
    await assertUnique({ code: input.code, name: input.name })

    return prisma.gradeLevel.create({
      data: {
        code: input.code,
        name: input.name,
        alias: input.alias ?? '',
        levelOrder: input.levelOrder,
        minPassingScore: input.minPassingScore,
        headCoordinator: input.headCoordinator ?? '',
        maxCapacity: input.maxCapacity,
        status: input.status,
        description: input.description ?? '',
      },
    })
  },

  async update(id: string, input: UpdateGradeLevelBody) {
    await gradeLevelsService.getById(id)

    // Only re-check a value that's actually changing — a PATCH that includes
    // the current code unchanged shouldn't run a query that would find
    // itself.
    const current = await prisma.gradeLevel.findUnique({
      where: { id },
      select: { code: true, name: true },
    })
    await assertUnique(
      {
        ...(input.code !== undefined && input.code !== current?.code
          ? { code: input.code }
          : {}),
        ...(input.name !== undefined && input.name !== current?.name
          ? { name: input.name }
          : {}),
      },
      id
    )

    return prisma.gradeLevel.update({ where: { id }, data: input })
  },

  /**
   * Refuses to delete a grade level that still has children.
   *
   * The old guard checked the denormalized `totalClasses` / `enrolledStudents`
   * columns, which the client could set to zero via PATCH. This version
   * queries the actual child tables when a link exists.
   *
   * If `Class` has no FK to `GradeLevel` — in the current schema it looks
   * like it links by `gradeLevel: number`, not `gradeLevelId` — the count
   * below uses `levelOrder` as the join key. Adjust the where clause if the
   * actual relation is different.
   */
  async remove(id: string) {
    const level = await gradeLevelsService.getById(id)

    const [classCount, studentCount] = await Promise.all([
      prisma.class.count({
        where: { gradeLevel: level.levelOrder, deletedAt: null },
      }),
      prisma.student.count({
        where: {
          deletedAt: null,
          class: { gradeLevel: level.levelOrder },
        },
      }),
    ])

    if (classCount > 0 || studentCount > 0) {
      throw ApiError.conflict(
        `Cannot delete "${level.name}": ${classCount} class(es) and ${studentCount} student(s) still reference it`
      )
    }

    await prisma.gradeLevel.delete({ where: { id } })
  },
}