import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateClassBody,
  ListClassesQuery,
  UpdateClassBody,
} from './classes.validation'

/**
 * Standard projection for a class in list and detail responses. Kept as a
 * single constant so list and getById can't drift apart — that mismatch is a
 * common source of "the list shows X but the detail page doesn't".
 */
const classInclude = {
  homeroomTeacher: {
    select: {
      id: true,
      teacherCode: true,
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  },
} as const

/**
 * Confirms a teacher exists before a create/update writes a foreign key that
 * points at it. Without this, a typo'd CUID hits Prisma as a P2003 foreign
 * key violation and surfaces as an opaque 500. A 400 here is faster and
 * clearer, and doesn't require the client to guess which field was wrong.
 */
async function assertTeacherExists(teacherId: string) {
  const teacher = await prisma.teacher.findFirst({
    where: { id: teacherId, deletedAt: null },
    select: { id: true },
  })
  if (!teacher) {
    throw ApiError.badRequest(
      'homeroomTeacherId does not refer to an existing teacher'
    )
  }
}

export const classesService = {
  async list(filters: ListClassesQuery) {
    const where = {
      deletedAt: null,
      ...(filters.gradeLevel !== undefined
        ? { gradeLevel: filters.gradeLevel }
        : {}),
      ...(filters.homeroomTeacherId
        ? { homeroomTeacherId: filters.homeroomTeacherId }
        : {}),
      ...(filters.search
        ? { name: { contains: filters.search, mode: 'insensitive' as const } }
        : {}),
    }

    // Stable secondary sort by name so classes with equal gradeLevel (or
    // equal createdAt, if that's what was requested) always come back in the
    // same order between requests. Without a tiebreaker, pagination can skip
    // or duplicate rows.
    const primarySort = filters.sortBy ?? 'gradeLevel'
    const orderBy = [
      { [primarySort]: filters.sortOrder },
      ...(primarySort !== 'name' ? [{ name: 'asc' as const }] : []),
    ]

    const [items, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: classInclude,
        orderBy,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.class.count({ where }),
    ])

    return { items, total, page: filters.page, limit: filters.limit }
  },

  async getById(classId: string) {
    const cls = await prisma.class.findFirst({
      where: { id: classId, deletedAt: null },
      include: {
        ...classInclude,
        // A class detail page almost always wants the student roster; include
        // the count so the client can render "N students enrolled" without
        // a second request.
        _count: { select: { students: true } },
      },
    })
    if (!cls) throw ApiError.notFound('Class not found')
    return cls
  },

  async create(input: CreateClassBody) {
    if (input.homeroomTeacherId) {
      await assertTeacherExists(input.homeroomTeacherId)
    }

    // Uniqueness is enforced at the app level per (name, gradeLevel). If the
    // Prisma schema has `@@unique([name, gradeLevel])`, this check is
    // redundant but still useful — it returns a friendlier message than the
    // P2002 handler. If the schema doesn't have that constraint, this is the
    // only thing preventing duplicate class names.
    const existing = await prisma.class.findFirst({
      where: {
        name: input.name,
        gradeLevel: input.gradeLevel,
        deletedAt: null,
      },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict(
        `A class named "${input.name}" already exists for grade ${input.gradeLevel}`
      )
    }

    return prisma.class.create({
      data: {
        name: input.name,
        gradeLevel: input.gradeLevel,
        homeroomTeacherId: input.homeroomTeacherId ?? null,
        ...(input.capacity !== undefined ? { capacity: input.capacity } : {}),
      },
      include: classInclude,
    })
  },

  async update(classId: string, changes: UpdateClassBody) {
    const existing = await prisma.class.findFirst({
      where: { id: classId, deletedAt: null },
      select: { id: true, name: true, gradeLevel: true },
    })
    if (!existing) throw ApiError.notFound('Class not found')

    if (changes.homeroomTeacherId) {
      await assertTeacherExists(changes.homeroomTeacherId)
    }

    // Re-check uniqueness only if name or gradeLevel actually changed. The
    // `existing` fields fill in the unchanged half of the pair, so the check
    // covers the case where only one of the two is being updated.
    const nextName = changes.name ?? existing.name
    const nextGradeLevel = changes.gradeLevel ?? existing.gradeLevel

    if (nextName !== existing.name || nextGradeLevel !== existing.gradeLevel) {
      const collision = await prisma.class.findFirst({
        where: {
          id: { not: classId },
          name: nextName,
          gradeLevel: nextGradeLevel,
          deletedAt: null,
        },
        select: { id: true },
      })
      if (collision) {
        throw ApiError.conflict(
          `A class named "${nextName}" already exists for grade ${nextGradeLevel}`
        )
      }
    }

    return prisma.class.update({
      where: { id: classId },
      data: changes,
      include: classInclude,
    })
  },

  /**
   * Soft delete. Historical records (attendance, grades, homework) reference
   * `classId`, so a hard delete would either orphan them or require cascades
   * that erase audit history. Setting `deletedAt` keeps the record but
   * removes the class from all list/getById responses.
   *
   * Refuses if the class still has enrolled students. A soft-deleted class
   * with active students is worse than either hard-deleting or leaving it
   * alone: the students keep referencing a class that no longer appears in
   * any UI, and their attendance/grades become unreachable through the
   * normal class → student navigation.
   */
  async remove(classId: string) {
    const cls = await prisma.class.findFirst({
      where: { id: classId, deletedAt: null },
      select: {
        id: true,
        name: true,
        _count: { select: { students: true } },
      },
    })
    if (!cls) throw ApiError.notFound('Class not found')

    if (cls._count.students > 0) {
      throw ApiError.conflict(
        `Cannot delete "${cls.name}": ${cls._count.students} student(s) still enrolled. Move them to another class first.`
      )
    }

    await prisma.class.update({
      where: { id: classId },
      data: { deletedAt: new Date() },
    })
  },
}