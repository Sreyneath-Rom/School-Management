import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateScheduleBody,
  ListSchedulesQuery,
  UpdateScheduleBody,
} from './schedules.validation'

/**
 * The transaction client Prisma hands to `$transaction(async (tx) => ...)`.
 * Derived from the base client type by stripping the top-level-only methods
 * — this is stable across Prisma versions and doesn't depend on a namespace
 * export path.
 */
type Tx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const scheduleInclude = {
  class: { select: { id: true, name: true, gradeLevel: true } },
  subject: { select: { id: true, name: true, code: true } },
  teacher: {
    select: {
      id: true,
      teacherCode: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
} as const

/**
 * Two half-open intervals [start, end) overlap iff aStart < bEnd AND
 * bStart < aEnd. Treats the end time as exclusive — a lesson ending at
 * 09:00 and another starting at 09:00 do NOT overlap.
 *
 * String comparison works because HH:MM is lexicographically ordered when
 * zero-padded. Validated by the schema, so no runtime parse needed.
 */
function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Throws 400 with a specific message for whichever reference id doesn't
 * resolve. Uses `findFirst` with `deletedAt: null` on models that soft-delete
 * — `findUnique` on a soft-deleted row would still succeed, letting a
 * schedule be created against a class or teacher that no longer appears in
 * any list.
 */
async function assertReferencesExist(
  tx: Tx,
  input: { classId: string; teacherId: string; subjectId: string }
): Promise<void> {
  const [cls, teacher, subject] = await Promise.all([
    tx.class.findFirst({
      where: { id: input.classId, deletedAt: null },
      select: { id: true },
    }),
    tx.teacher.findFirst({
      where: { id: input.teacherId, deletedAt: null },
      select: { id: true },
    }),
    tx.subject.findUnique({
      where: { id: input.subjectId },
      select: { id: true },
    }),
  ])

  if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
  if (!teacher) throw ApiError.badRequest('teacherId does not refer to an existing teacher')
  if (!subject) throw ApiError.badRequest('subjectId does not refer to an existing subject')
}

/**
 * Checks every overlap rule the schedule requires:
 *   - teacher not double-booked
 *   - class not double-booked
 *   - room not double-booked (only when a room is set)
 *
 * The `OR` in the query narrows to candidate rows; the loop then applies the
 * precise time comparison and reports the specific conflict type. This gives
 * the client an actionable message ("teacher is busy") instead of a generic
 * "conflict".
 */
async function assertNoConflict(
  tx: Tx,
  input: {
    classId: string
    teacherId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    room?: string
  },
  excludeId?: string
): Promise<void> {
  const sameDay = await tx.schedule.findMany({
    where: {
      dayOfWeek: input.dayOfWeek,
      ...(excludeId ? { id: { not: excludeId } } : {}),
      OR: [
        { teacherId: input.teacherId },
        { classId: input.classId },
        ...(input.room ? [{ room: input.room }] : []),
      ],
    },
    select: {
      teacherId: true,
      classId: true,
      room: true,
      startTime: true,
      endTime: true,
    },
  })

  for (const existing of sameDay) {
    if (
      !timesOverlap(
        input.startTime,
        input.endTime,
        existing.startTime,
        existing.endTime
      )
    ) {
      continue
    }

    if (existing.teacherId === input.teacherId) {
      throw ApiError.conflict(
        'Teacher is already scheduled during this time slot'
      )
    }
    if (existing.classId === input.classId) {
      throw ApiError.conflict(
        'Class already has a lesson during this time slot'
      )
    }
    if (input.room && existing.room === input.room) {
      throw ApiError.conflict(
        `Room "${input.room}" is already booked during this time slot`
      )
    }
  }
}

/**
 * Retry helper for serializable-transaction conflicts.
 *
 * Postgres raises SQLSTATE 40001 ("could not serialize access due to
 * concurrent update") when two serializable transactions can't be
 * interleaved. Prisma surfaces this as `PrismaClientKnownRequestError` with
 * code `P2034`. Retrying is the correct response — the losing transaction
 * just needs to see the winner's committed state.
 *
 * Exponential backoff with a small number of attempts keeps a burst of
 * concurrent bookings from spinning. If all attempts fail, the error
 * propagates as a 500 — the caller can retry the request.
 */
const SERIALIZATION_RETRY_LIMIT = 3
const SERIALIZATION_RETRY_BASE_MS = 25

async function runSerializable<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < SERIALIZATION_RETRY_LIMIT; attempt++) {
    try {
      return await prisma.$transaction(fn, { isolationLevel: 'Serializable' })
    } catch (err) {
      const code = (err as { code?: string } | null)?.code
      if (code !== 'P2034') throw err
      lastError = err
      await new Promise((r) =>
        setTimeout(r, SERIALIZATION_RETRY_BASE_MS * 2 ** attempt)
      )
    }
  }
  throw lastError
}

export const schedulesService = {
  async list(query: ListSchedulesQuery) {
    const where = {
      ...(query.classId ? { classId: query.classId } : {}),
      ...(query.teacherId ? { teacherId: query.teacherId } : {}),
      ...(query.subjectId ? { subjectId: query.subjectId } : {}),
      ...(query.room ? { room: query.room } : {}),
      ...(query.dayOfWeek !== undefined ? { dayOfWeek: query.dayOfWeek } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        include: scheduleInclude,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.schedule.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async getById(id: string) {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: scheduleInclude,
    })
    if (!schedule) throw ApiError.notFound('Schedule entry not found')
    return schedule
  },

  /**
   * The conflict check and the insert must be atomic. Two concurrent POSTs
   * for the same teacher/room/time would otherwise both read "no conflict"
   * before either write lands, producing exactly the double-booking this
   * check exists to prevent.
   *
   * Serializable isolation + the retry helper on `runSerializable` closes
   * the race. See the comment on `runSerializable` for why retries are
   * necessary rather than optional.
   */
  async create(input: CreateScheduleBody) {
    return runSerializable(async (tx) => {
      await assertReferencesExist(tx, input)
      await assertNoConflict(tx, input)
      return tx.schedule.create({ data: input, include: scheduleInclude })
    })
  },

  async update(id: string, changes: UpdateScheduleBody) {
    return runSerializable(async (tx) => {
      const existing = await tx.schedule.findUnique({
        where: { id },
        select: {
          classId: true,
          subjectId: true,
          teacherId: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          room: true,
        },
      })
      if (!existing) throw ApiError.notFound('Schedule entry not found')

      /**
       * Merge the requested changes onto the stored row so the conflict and
       * reference checks run against the post-update state. Without this, a
       * PATCH that moves only `endTime` past an existing booking would pass
       * the checks (they'd see only the old endTime) and produce a conflict
       * after the write.
       *
       * `?? ` is intentionally NOT used here — the nullish coalescing
       * operator would treat `room: null` as "no change", but the schema
       * treats `room: null` as "clear the room". Use `=== undefined` for
       * the not-provided case.
       */
      const merged = {
        classId: changes.classId ?? existing.classId,
        subjectId: changes.subjectId ?? existing.subjectId,
        teacherId: changes.teacherId ?? existing.teacherId,
        dayOfWeek: changes.dayOfWeek ?? existing.dayOfWeek,
        startTime: changes.startTime ?? existing.startTime,
        endTime: changes.endTime ?? existing.endTime,
        room: changes.room !== undefined ? changes.room : existing.room ?? undefined,
      }

      if (merged.startTime >= merged.endTime) {
        throw ApiError.badRequest('startTime must be before endTime')
      }

      if (
        changes.classId !== undefined ||
        changes.teacherId !== undefined ||
        changes.subjectId !== undefined
      ) {
        await assertReferencesExist(tx, merged)
      }

      await assertNoConflict(tx, merged, id)

      return tx.schedule.update({
        where: { id },
        data: changes,
        include: scheduleInclude,
      })
    })
  },

  /**
   * Hard delete. Schedules are structural records with no user-generated
   * history — removing one is a legitimate "cancel this recurring slot"
   * operation, not a data-loss event. If the schema later gains audit
   * requirements, add a `deletedAt` column and switch to soft delete.
   */
  async remove(id: string) {
    const existing = await prisma.schedule.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Schedule entry not found')

    await prisma.schedule.delete({ where: { id } })
  },
}