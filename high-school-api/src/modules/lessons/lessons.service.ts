import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateLessonBody,
  ListLessonsQuery,
  UpdateLessonBody,
} from './lessons.validation'

const lessonInclude = {
  subject: { select: { id: true, name: true, code: true } },
  class: { select: { id: true, name: true, gradeLevel: true } },
  teacher: {
    select: {
      id: true,
      teacherCode: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
} as const

/**
 * Verifies related entities exist before writing FK references that point at
 * them. Without this, a typo'd id surfaces as a P2003 foreign key violation
 * with no field name. Runs the three checks in parallel.
 */
async function assertRelatedExist(input: {
  subjectId?: string
  classId?: string
  teacherId?: string
}) {
  const [subject, cls, teacher] = await Promise.all([
    input.subjectId
      ? prisma.subject.findUnique({
          where: { id: input.subjectId },
          select: { id: true },
        })
      : Promise.resolve(null),
    input.classId
      ? prisma.class.findFirst({
          where: { id: input.classId, deletedAt: null },
          select: { id: true },
        })
      : Promise.resolve(null),
    input.teacherId
      ? prisma.teacher.findFirst({
          where: { id: input.teacherId, deletedAt: null },
          select: { id: true },
        })
      : Promise.resolve(null),
  ])

  if (input.subjectId && !subject) {
    throw ApiError.badRequest('subjectId does not refer to an existing subject')
  }
  if (input.classId && !cls) {
    throw ApiError.badRequest('classId does not refer to an existing class')
  }
  if (input.teacherId && !teacher) {
    throw ApiError.badRequest('teacherId does not refer to an existing teacher')
  }
}

/**
 * Resolves the Teacher row for an authenticated user. Used by the controller
 * to derive `teacherId` from `req.user.sub` — the caller's identity, not
 * client input.
 */
export async function teacherIdForUser(userId: string): Promise<string> {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!teacher) {
    throw ApiError.forbidden('Only teachers can create or edit lessons')
  }
  return teacher.id
}

export const lessonsService = {
  async list(filters: ListLessonsQuery) {
    const where = {
      ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      ...(filters.scheduledFrom || filters.scheduledTo
        ? {
            scheduledAt: {
              ...(filters.scheduledFrom ? { gte: filters.scheduledFrom } : {}),
              ...(filters.scheduledTo ? { lte: filters.scheduledTo } : {}),
            },
          }
        : {}),
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' as const } },
              {
                description: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = filters.sortBy ?? 'createdAt'
    const orderBy = [
      { [primarySort]: filters.sortOrder },
      // Stable tiebreaker — prevents pagination from skipping or duplicating
      // rows that share the primary sort value.
      ...(primarySort !== 'title' ? [{ title: 'asc' as const }] : []),
    ]

    const [items, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        include: lessonInclude,
        orderBy,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.lesson.count({ where }),
    ])

    return { items, total, page: filters.page, limit: filters.limit }
  },

  async getById(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: lessonInclude,
    })
    if (!lesson) throw ApiError.notFound('Lesson not found')
    return lesson
  },

  /**
   * `teacherId` is a separate, required parameter — resolved from the
   * authenticated user by the controller. The service never accepts a
   * caller-supplied teacher id.
   */
  async create(input: CreateLessonBody & { teacherId: string }) {
    await assertRelatedExist({
      subjectId: input.subjectId,
      classId: input.classId,
      teacherId: input.teacherId,
    })

    const { teacherId, ...rest } = input
    return prisma.lesson.create({
      data: { ...rest, teacherId },
      include: lessonInclude,
    })
  },

  /**
   * Ownership check: a teacher may only edit their own lessons. Admins may
   * edit any (pass `isAdmin: true`). Without this, any teacher with
   * `lessons.edit` could modify every other teacher's materials.
   *
   * The `subjectId` / `classId` existence check runs only when those fields
   * are actually being changed — a PATCH that only touches `title` shouldn't
   * fire two extra queries.
   */
  async update(
    lessonId: string,
    changes: UpdateLessonBody,
    actor: { teacherId: string; isAdmin: boolean }
  ) {
    const existing = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, teacherId: true },
    })
    if (!existing) throw ApiError.notFound('Lesson not found')

    if (!actor.isAdmin && existing.teacherId !== actor.teacherId) {
      throw ApiError.forbidden('You can only edit your own lessons')
    }

    if (changes.subjectId !== undefined || changes.classId !== undefined) {
      await assertRelatedExist({
        ...(changes.subjectId !== undefined
          ? { subjectId: changes.subjectId }
          : {}),
        ...(changes.classId !== undefined ? { classId: changes.classId } : {}),
      })
    }

    return prisma.lesson.update({
      where: { id: lessonId },
      data: changes,
      include: lessonInclude,
    })
  },

  async remove(
    lessonId: string,
    actor: { teacherId: string; isAdmin: boolean }
  ) {
    const existing = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, teacherId: true },
    })
    if (!existing) throw ApiError.notFound('Lesson not found')

    if (!actor.isAdmin && existing.teacherId !== actor.teacherId) {
      throw ApiError.forbidden('You can only delete your own lessons')
    }

    await prisma.lesson.delete({ where: { id: lessonId } })
  },
}