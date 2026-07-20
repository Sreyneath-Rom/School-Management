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

/** Two [start,end) time ranges on the same day overlap. */
function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd
}

async function assertNoConflict(input: ScheduleInput, excludeId?: string) {
  const sameDay = await prisma.schedule.findMany({
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

export const schedulesService = {
  async create(input: ScheduleInput & { subjectId: string }) {
    await assertNoConflict(input)
    return prisma.schedule.create({ data: input })
  },

  async update(id: string, input: Partial<ScheduleInput & { subjectId: string }>) {
    const existing = await prisma.schedule.findUnique({ where: { id } })
    if (!existing) throw ApiError.notFound('Schedule entry not found')

    const merged: ScheduleInput = {
      classId: input.classId ?? existing.classId,
      teacherId: input.teacherId ?? existing.teacherId,
      dayOfWeek: input.dayOfWeek ?? existing.dayOfWeek,
      startTime: input.startTime ?? existing.startTime,
      endTime: input.endTime ?? existing.endTime,
      room: input.room ?? existing.room ?? undefined,
    }
    await assertNoConflict(merged, id)
    return prisma.schedule.update({ where: { id }, data: input })
  },
}
