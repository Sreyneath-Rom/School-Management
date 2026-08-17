import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

type ScheduleInput = {
  classId: string
  teacherId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room?: string
}

// Derived directly from the existing `prisma` instance's own method
// signatures rather than importing `Prisma.TransactionClient` — this
// avoids depending on how `@prisma/client` happens to export things in
// your setup (custom generator output paths, stale generated client,
// etc.), since it's just "the same methods `prisma` already has."
type ScheduleTx = {
  schedule: {
    findMany: typeof prisma.schedule.findMany
    findUnique: typeof prisma.schedule.findUnique
    create: typeof prisma.schedule.create
    update: typeof prisma.schedule.update
  }
  class: { findUnique: typeof prisma.class.findUnique }
  teacher: { findUnique: typeof prisma.teacher.findUnique }
  subject: { findUnique: typeof prisma.subject.findUnique }
}

const scheduleInclude = { class: true, subject: true, teacher: { include: { user: true } } }

/** Two [start,end) time ranges on the same day overlap. */
function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd
}

async function assertNoConflict(tx: ScheduleTx, input: ScheduleInput, excludeId?: string) {
  const sameDay = await tx.schedule.findMany({
    where: {
      dayOfWeek: input.dayOfWeek,
      id: excludeId ? { not: excludeId } : undefined,
      OR: [{ teacherId: input.teacherId }, { classId: input.classId }, ...(input.room ? [{ room: input.room }] : [])],
    },
  })

  for (const existing of sameDay) {
    if (!timesOverlap(input.startTime, input.endTime, existing.startTime, existing.endTime)) continue

    if (existing.teacherId === input.teacherId) {
      throw ApiError.conflict('Teacher is already scheduled during this time slot')
    }
    if (existing.classId === input.classId) {
      throw ApiError.conflict('Class already has a lesson during this time slot')
    }
    if (input.room && existing.room === input.room) {
      throw ApiError.conflict(`Room ${input.room} is already booked during this time slot`)
    }
  }
}

async function assertReferencesExist(
  tx: ScheduleTx,
  input: { classId: string; teacherId: string; subjectId: string }
) {
  const [cls, teacher, subject] = await Promise.all([
    tx.class.findUnique({ where: { id: input.classId } }),
    tx.teacher.findUnique({ where: { id: input.teacherId } }),
    tx.subject.findUnique({ where: { id: input.subjectId } }),
  ])
  if (!cls) throw ApiError.badRequest('classId does not refer to an existing class')
  if (!teacher) throw ApiError.badRequest('teacherId does not refer to an existing teacher')
  if (!subject) throw ApiError.badRequest('subjectId does not refer to an existing subject')
}

export const schedulesService = {
  async list(filters: { classId?: string; teacherId?: string }) {
    return prisma.schedule.findMany({
      where: { classId: filters.classId, teacherId: filters.teacherId },
      include: scheduleInclude,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  },

  async getById(id: string) {
    const schedule = await prisma.schedule.findUnique({ where: { id }, include: scheduleInclude })
    if (!schedule) throw ApiError.notFound('Schedule entry not found')
    return schedule
  },

  /**
   * The conflict check and the actual insert must be atomic — otherwise
   * two concurrent POSTs for the same teacher/room/time slot can both
   * read "no conflict" before either write lands, producing the exact
   * double-booking this check exists to prevent. Running both inside a
   * serializable transaction closes that race (requires a DB that
   * supports it, e.g. Postgres).
   */
  async create(input: ScheduleInput & { subjectId: string }) {
    return prisma.$transaction(
      async (tx) => {
        await assertReferencesExist(tx, input)
        await assertNoConflict(tx, input)
        return tx.schedule.create({ data: input, include: scheduleInclude })
      },
      { isolationLevel: 'Serializable' }
    )
  },

  async update(id: string, input: Partial<ScheduleInput & { subjectId: string }>) {
    return prisma.$transaction(
      async (tx) => {
        const existing = await tx.schedule.findUnique({ where: { id } })
        if (!existing) throw ApiError.notFound('Schedule entry not found')

        const merged: ScheduleInput & { subjectId: string } = {
          classId: input.classId ?? existing.classId,
          teacherId: input.teacherId ?? existing.teacherId,
          subjectId: input.subjectId ?? existing.subjectId,
          dayOfWeek: input.dayOfWeek ?? existing.dayOfWeek,
          startTime: input.startTime ?? existing.startTime,
          endTime: input.endTime ?? existing.endTime,
          room: input.room ?? existing.room ?? undefined,
        }

        if (input.classId || input.teacherId || input.subjectId) {
          await assertReferencesExist(tx, merged)
        }
        await assertNoConflict(tx, merged, id)

        return tx.schedule.update({ where: { id }, data: input, include: scheduleInclude })
      },
      { isolationLevel: 'Serializable' }
    )
  },

  async remove(id: string) {
    const existing = await prisma.schedule.findUnique({ where: { id } })
    if (!existing) throw ApiError.notFound('Schedule entry not found')
    await prisma.schedule.delete({ where: { id } })
  },
}