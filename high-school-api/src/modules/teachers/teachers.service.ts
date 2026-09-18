import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import { hashPassword } from '@/utils/password'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateTeacherBody,
  ListTeachersQuery,
  UpdateTeacherBody,
} from './teachers.validation'

type Tx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const RETRY_LIMIT = 3
const RETRY_BASE_MS = 25

/**
 * Retries serializable-transaction conflicts (Postgres 40001 → Prisma P2034).
 * Same helper as students/schedules/school. The create path is where this
 * matters most: concurrent teacher creations with the same email or teacher
 * code must not both succeed.
 */
async function runSerializable<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < RETRY_LIMIT; attempt++) {
    try {
      return await prisma.$transaction(fn, { isolationLevel: 'Serializable' })
    } catch (err) {
      if ((err as { code?: string } | null)?.code !== 'P2034') throw err
      lastError = err
      await new Promise((r) => setTimeout(r, RETRY_BASE_MS * 2 ** attempt))
    }
  }
  throw lastError
}

/**
 * Two projections: `teacherListInclude` for the collection view (cheap),
 * `teacherDetailInclude` for the detail view (adds subjects and classes).
 * Previously a single `teacherInclude` was used for both — the list pulled
 * every teacher's subjects and classes, a wasted JOIN on every request.
 */
const teacherListInclude = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      phone: true,
      isActive: true,
    },
  },
  _count: { select: { subjects: true, classesLed: true } },
} as const

const teacherDetailInclude = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      phone: true,
      isActive: true,
    },
  },
  subjects: {
    select: {
      subject: {
        select: { id: true, name: true, code: true, department: true },
      },
    },
  },
  classesLed: {
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      _count: { select: { students: true } },
    },
  },
} as const

/**
 * Confirms every id in `subjectIds` refers to a live (non-deleted) subject.
 *
 * The previous version's check ran `prisma.subject.count({ where: { id: { in: subjectIds } } })`
 * with no `deletedAt: null` filter — a soft-deleted subject id passed the
 * check, then Prisma's FK accepted the create, producing a TeacherSubject
 * link to a subject the API never returns.
 */
async function assertSubjectsExist(subjectIds: string[]): Promise<void> {
  if (subjectIds.length === 0) return
  const validCount = await prisma.subject.count({
    where: { id: { in: subjectIds }, deletedAt: null },
  })
  if (validCount !== subjectIds.length) {
    throw ApiError.badRequest(
      'One or more subjectIds do not refer to existing subjects'
    )
  }
}

/**
 * Resolves an array of subject NAMES to ids. Case-insensitive exact match.
 *
 * Two important differences from the previous version:
 *
 *   1. Rejects unknown names instead of silently dropping them. Old code
 *      returned whatever matched, and the caller's length check
 *      (`subjectIds.length !== input.subjectsTaught.length`) only ran in the
 *      UPDATE path — a create with `subjectsTaught: ["Math", "Nonexistent"]`
 *      silently produced a teacher with just Math.
 *
 *   2. Case-insensitive matching. `subjectsTaught: ["math"]` previously
 *      missed a subject named "Mathematics" — leaving a silently empty
 *      teacher.
 */
async function resolveSubjectIds(subjectNames: string[]): Promise<string[]> {
  if (subjectNames.length === 0) return []

  const subjects = await prisma.subject.findMany({
    where: {
      deletedAt: null,
      OR: subjectNames.map((name) => ({
        name: { equals: name, mode: 'insensitive' as const },
      })),
    },
    select: { id: true, name: true },
  })

  if (subjects.length !== subjectNames.length) {
    const found = new Set(subjects.map((s) => s.name.toLowerCase()))
    const missing = subjectNames.filter((n) => !found.has(n.toLowerCase()))
    throw ApiError.badRequest('Some subject names do not exist', { missing })
  }

  // Preserve the caller's order — the mapping is by name, so re-sort to
  // match input.
  const byName = new Map(subjects.map((s) => [s.name.toLowerCase(), s.id]))
  return subjectNames.map((n) => byName.get(n.toLowerCase())!)
}

/**
 * Resolves the caller's final set of subject ids from the two accepted
 * inputs, applying the same precedence rule everywhere:
 *   - `subjectIds` wins if present.
 *   - Otherwise `subjectsTaught` (names) is resolved and validated.
 *   - Neither → `undefined` (meaning "no change").
 *
 * Extracted because create and update had this logic inline, slightly
 * differently in each place.
 */
async function resolveSubjectIdsFromInput(input: {
  subjectIds?: string[]
  subjectsTaught?: string[]
}): Promise<string[] | undefined> {
  if (input.subjectIds !== undefined) return input.subjectIds
  if (input.subjectsTaught !== undefined) {
    return resolveSubjectIds(input.subjectsTaught)
  }
  return undefined
}

/**
 * Generates a teacher code that's unlikely to collide with existing rows.
 *
 * The old fallback `TCH-${Date.now()}` was a real collision risk — two
 * teachers created in the same millisecond got the same code, then one
 * failed with a P2002 that the caller couldn't diagnose. This uses a
 * random suffix. Still not guaranteed unique (there's no atomic counter),
 * but the failure mode is a 1-in-a-million collision instead of a
 * 1-in-a-burst collision.
 */
function generateTeacherCode(): string {
  const suffix = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
  return `TCH-${suffix}`
}

export const teachersService = {
  async list(query: ListTeachersQuery) {
    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(query.status === 'inactive' ? { user: { isActive: false } } : {}),
      ...(query.status === 'active' ? { user: { isActive: true } } : {}),
      ...(query.department
        ? { subjects: { some: { subject: { department: query.department } } } }
        : {}),
      ...(query.search
        ? {
            OR: [
              { teacherCode: { contains: query.search, mode: 'insensitive' } },
              {
                user: {
                  firstName: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                user: {
                  lastName: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                user: {
                  email: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'createdAt'
    const orderBy: Prisma.TeacherOrderByWithRelationInput[] =
      primarySort === 'firstName' || primarySort === 'lastName'
        ? [{ user: { [primarySort]: query.sortOrder } }, { id: 'asc' }]
        : [{ [primarySort]: query.sortOrder }, { id: 'asc' }]

    const [items, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: teacherListInclude,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.teacher.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async getById(id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      include: teacherDetailInclude,
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')
    return teacher
  },

  async create(input: CreateTeacherBody) {
    const subjectIds = await resolveSubjectIdsFromInput(input)
    const finalSubjectIds = subjectIds ?? []
    await assertSubjectsExist(finalSubjectIds)

    // `teacherCode` is canonical; `employeeId` is the deprecated alias the
    // current UI still sends. Prefer `teacherCode`, fall back to
    // `employeeId`, fall back to a generated code.
    const teacherCode =
      input.teacherCode ?? input.employeeId ?? generateTeacherCode()

    // Hash outside the transaction — bcrypt is ~250ms of CPU and would hold
    // serializable row locks for that whole window.
    const passwordHash = input.password
      ? await hashPassword(input.password)
      : null

    return runSerializable(async (tx) => {
      // Reference checks inside the transaction so we see a snapshot
      // consistent with the writes that follow.
      const codeCollision = await tx.teacher.findUnique({
        where: { teacherCode },
        select: { id: true },
      })
      if (codeCollision) {
        throw ApiError.conflict(
          `A teacher with code "${teacherCode}" already exists`
        )
      }

      let userId: string

      if (input.userId) {
        const user = await tx.user.findFirst({
          where: { id: input.userId, deletedAt: null },
          select: { id: true },
        })
        if (!user) {
          throw ApiError.badRequest('userId does not refer to an existing user')
        }
        userId = user.id
      } else {
        // Create-branch requires email/firstName/lastName/password — the
        // schema's superRefine already guaranteed they're present together
        // when userId is absent, so these non-null assertions are safe.
        const existing = await tx.user.findUnique({
          where: { email: input.email! },
          select: { id: true },
        })
        if (existing) {
          throw ApiError.conflict('A user with this email already exists')
        }

        const role = await tx.role.findUnique({
          where: { name: 'teacher' },
          select: { id: true },
        })
        if (!role) {
          throw ApiError.internal('The "teacher" role is not configured')
        }

        const user = await tx.user.create({
          data: {
            email: input.email!,
            passwordHash: passwordHash!,
            firstName: input.firstName!,
            lastName: input.lastName!,
            phone: input.phone,
            roleId: role.id,
          },
        })
        userId = user.id
      }

      // Guard against a linked user that already has a Teacher row. This
      // check runs inside the transaction so two concurrent POSTs for the
      // same userId can't both pass.
      const existingTeacher = await tx.teacher.findUnique({
        where: { userId },
        select: { id: true, deletedAt: true },
      })
      if (existingTeacher) {
        throw existingTeacher.deletedAt
          ? ApiError.conflict(
              'This user has a soft-deleted teacher record. Restore it instead of creating a new one.'
            )
          : ApiError.conflict('This user is already linked to a teacher record')
      }

      // If we just created the user and the teacher insert fails, the
      // transaction rolls back and the user is not orphaned. Same guarantee
      // in the other direction.
      return tx.teacher.create({
        data: {
          userId,
          teacherCode,
          subjects: {
            create: finalSubjectIds.map((subjectId) => ({ subjectId })),
          },
        },
        include: teacherDetailInclude,
      })
    })
  },

  async update(id: string, changes: UpdateTeacherBody) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true, teacherCode: true },
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')

    const subjectIds = await resolveSubjectIdsFromInput(changes)
    if (subjectIds) {
      await assertSubjectsExist(subjectIds)
    }

    // `teacherCode` is canonical; `employeeId` is the deprecated alias.
    // When both are present, `teacherCode` wins. When neither is present,
    // `nextTeacherCode` is `undefined` and the field is left unchanged.
    const nextTeacherCode = changes.teacherCode ?? changes.employeeId

    // Uniqueness re-check for teacherCode, only when actually changing.
    // The `id: { not: id }` clause lets the check ignore the current row.
    if (
      nextTeacherCode !== undefined &&
      nextTeacherCode !== teacher.teacherCode
    ) {
      const collision = await prisma.teacher.findUnique({
        where: { teacherCode: nextTeacherCode },
        select: { id: true },
      })
      if (collision && collision.id !== id) {
        throw ApiError.conflict(
          `A teacher with code "${nextTeacherCode}" already exists`
        )
      }
    }

    const {
      // Destructured out so they don't leak into `teacherChanges` — these
      // are handled through `nextTeacherCode` and `subjectIds` above.
      teacherCode: _canonicalTeacherCode,
      employeeId: _deprecatedEmployeeId,
      subjectsTaught: _deprecatedSubjectsTaught,
      subjectIds: _deprecatedSubjectIds,
      firstName,
      lastName,
      email,
      phone,
      status,
    } = changes

    // Status → isActive mapping. Only "inactive" (any casing) maps to
    // false. "On Leave" and "Active" both map to true — an on-leave
    // teacher still has a working account.
    const isInactive =
      status !== undefined && status.toLowerCase().trim() === 'inactive'

    const userChanges: Prisma.UserUpdateInput = {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(status !== undefined ? { isActive: !isInactive } : {}),
    }

    const teacherChanges: Prisma.TeacherUpdateInput = {
      ...(nextTeacherCode !== undefined
        ? { teacherCode: nextTeacherCode }
        : {}),
    }

    return prisma.$transaction(async (tx) => {
      if (Object.keys(teacherChanges).length > 0) {
        await tx.teacher.update({ where: { id }, data: teacherChanges })
      }
      if (Object.keys(userChanges).length > 0) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: userChanges,
        })
      }
      if (subjectIds) {
        // Full replace: delete all existing links, then create the new set.
        // Running in the same transaction as the teacher/user update means
        // a mid-way failure rolls back cleanly.
        await tx.teacherSubject.deleteMany({ where: { teacherId: id } })
        if (subjectIds.length > 0) {
          await tx.teacherSubject.createMany({
            data: subjectIds.map((subjectId) => ({ teacherId: id, subjectId })),
          })
        }
      }
      return tx.teacher.findUniqueOrThrow({
        where: { id },
        include: teacherDetailInclude,
      })
    })
  },

    /**
   * Soft delete. Preserves the teacher's history (classes led, lessons
   * taught, grades entered) — those rows reference the teacher by id and
   * would be orphaned by a hard delete.
   *
   * Both sides of the User ↔ Teacher pair are soft-deleted in the same
   * transaction, so the account no longer appears in `/users` lists either.
   * This is the mirror of `users.service.softDelete`'s cascade; whichever
   * endpoint the caller uses, the state after is identical.
   */
  async remove(id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')

    const now = new Date()

    await prisma.$transaction([
      prisma.teacher.update({
        where: { id },
        data: { deletedAt: now },
      }),
      prisma.user.update({
        where: { id: teacher.userId },
        data: { deletedAt: now, isActive: false },
      }),
    ])
  },
}