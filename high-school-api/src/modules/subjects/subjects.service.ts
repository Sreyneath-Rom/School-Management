import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateSubjectBody,
  ListSubjectsQuery,
  UpdateSubjectBody,
} from './subjects.validation'

interface SubjectRow {
  id: string
  name: string
  code: string
  department: string
  category: string
  description: string | null
  credits: number
  weeklyHours: number
  gradeLevel: string
  teacherNames: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

/**
 * Shapes a Subject row for the API. Prisma stores the teachers as
 * `teacherNames: string[]`; the frontend wants an array of
 * `{ id, name, label, color }` objects for the pill UI.
 *
 * IMPORTANT — the `id` on each teacher is NOT a Teacher row id. It's a
 * synthetic identifier derived from the name so React can key the pills
 * without warnings. It will not match any real teacher id, so a client
 * that tries to filter or navigate using it will get nothing back. See the
 * migration note at the bottom of the file.
 */
function toSubjectItem(subject: SubjectRow) {
  const teacherNames = Array.isArray(subject.teacherNames) ? subject.teacherNames : []
  return {
    ...subject,
    teachers: teacherNames.map((name) => ({
      id: `subject-teacher-name:${name}`,
      name,
      label: name.slice(0, 2).toUpperCase(),
      color: 'brand',
    })),
  }
}

/**
 * Existence check for update/delete paths. Returns the row so callers that
 * need more than `id` don't run a second query.
 */
async function getExistingSubject(id: string) {
  const subject = await prisma.subject.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, name: true, code: true },
  })
  if (!subject) throw ApiError.notFound('Subject not found')
  return subject
}

export const subjectsService = {
  async list(query: ListSubjectsQuery) {
    const where = {
      deletedAt: null,
      ...(query.department ? { department: query.department } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { code: { contains: query.search, mode: 'insensitive' as const } },
              {
                description: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'name'
    const orderBy = [
      { [primarySort]: query.sortOrder },
      // Stable tiebreaker — needed so pagination is deterministic when the
      // primary sort value ties across rows.
      ...(primarySort !== 'name' ? [{ name: 'asc' as const }] : []),
    ]

    const [items, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.subject.count({ where }),
    ])

    return {
      items: items.map((s) => toSubjectItem(s as SubjectRow)),
      total,
      page: query.page,
      limit: query.limit,
    }
  },

  async getById(id: string) {
    const subject = await prisma.subject.findFirst({
      where: { id, deletedAt: null },
    })
    if (!subject) throw ApiError.notFound('Subject not found')
    return toSubjectItem(subject as SubjectRow)
  },

  async create(input: CreateSubjectBody) {
    // Uniqueness is checked across both `code` and `name` — a school with
    // two subjects both called "Mathematics" is a UI problem regardless of
    // whether the codes differ.
    const [existingCode, existingName] = await Promise.all([
      prisma.subject.findFirst({
        where: { code: input.code, deletedAt: null },
        select: { id: true },
      }),
      prisma.subject.findFirst({
        where: { name: input.name, deletedAt: null },
        select: { id: true },
      }),
    ])
    if (existingCode) {
      throw ApiError.conflict(`A subject with code "${input.code}" already exists`)
    }
    if (existingName) {
      throw ApiError.conflict(`A subject named "${input.name}" already exists`)
    }

    const { teachers, ...rest } = input
    const created = await prisma.subject.create({
      data: { ...rest, teacherNames: teachers },
    })
    return toSubjectItem(created as SubjectRow)
  },

  async update(id: string, changes: UpdateSubjectBody) {
    const existing = await getExistingSubject(id)

    // Only re-check uniqueness for fields that are actually changing. A
    // PATCH that echoes the current `code` shouldn't hit its own row in the
    // uniqueness query.
    const [codeCollision, nameCollision] = await Promise.all([
      changes.code !== undefined && changes.code !== existing.code
        ? prisma.subject.findFirst({
            where: { code: changes.code, deletedAt: null, id: { not: id } },
            select: { id: true },
          })
        : Promise.resolve(null),
      changes.name !== undefined && changes.name !== existing.name
        ? prisma.subject.findFirst({
            where: { name: changes.name, deletedAt: null, id: { not: id } },
            select: { id: true },
          })
        : Promise.resolve(null),
    ])
    if (codeCollision) {
      throw ApiError.conflict(`A subject with code "${changes.code}" already exists`)
    }
    if (nameCollision) {
      throw ApiError.conflict(`A subject named "${changes.name}" already exists`)
    }

    const { teachers, ...rest } = changes
    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...rest,
        ...(teachers !== undefined ? { teacherNames: teachers } : {}),
      },
    })
    return toSubjectItem(updated as SubjectRow)
  },

  /**
   * Soft delete. Historical records — attendance, grades, homework,
   * submissions, quizzes — reference the subject by id and would either
   * orphan or need cascading deletes if the row were actually removed.
   *
   * The pre-delete guard counts live references in the models that
   * meaningfully depend on the subject still existing. Once the subject is
   * soft-deleted, all those lookups resolve to a row the API no longer
   * returns — so the guard prevents creating that inconsistent state in
   * the first place.
   *
   * Which models block deletion:
   *   - Schedule: an active timetable entry with no subject is broken.
   *   - Lesson: a lesson plan references a subject by id.
   *   - Homework/Quiz: an assignment to students references a subject.
   *   - Grade: a historical record — arguably OK to keep after subject is
   *     gone, but its subject name would render blank, so we refuse anyway.
   *
   * If a school genuinely needs to retire a subject while preserving
   * history, the right operation is a status flag (`Subject.isActive`),
   * not a delete.
   */
  async remove(id: string) {
    const subject = await getExistingSubject(id)

    const [
      scheduleCount,
      lessonCount,
      homeworkCount,
      quizCount,
      gradeCount,
    ] = await Promise.all([
      prisma.schedule.count({ where: { subjectId: id } }),
      prisma.lesson.count({ where: { subjectId: id } }),
      prisma.homework.count({ where: { subjectId: id } }),
      prisma.quiz.count({ where: { subjectId: id } }),
      prisma.grade.count({ where: { subjectId: id } }),
    ])

    const blocking: string[] = []
    if (scheduleCount > 0) blocking.push(`${scheduleCount} schedule(s)`)
    if (lessonCount > 0) blocking.push(`${lessonCount} lesson(s)`)
    if (homeworkCount > 0) blocking.push(`${homeworkCount} homework assignment(s)`)
    if (quizCount > 0) blocking.push(`${quizCount} quiz(zes)`)
    if (gradeCount > 0) blocking.push(`${gradeCount} grade record(s)`)

    if (blocking.length > 0) {
      throw ApiError.conflict(
        `Cannot delete "${subject.name}": still referenced by ${blocking.join(', ')}. ` +
          'Archive it (set a status flag) or remove the references first.'
      )
    }

    await prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}