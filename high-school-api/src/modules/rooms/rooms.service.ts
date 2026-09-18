import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateRoomBody,
  ListRoomsQuery,
  UpdateRoomBody,
} from './rooms.validation'

/**
 * Confirms the room exists and returns nothing — a lightweight existence
 * check for the update/delete paths. `select: { id: true }` avoids loading
 * the full row when only existence matters.
 */
async function assertRoomExists(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!room) throw ApiError.notFound('Room not found')
}

export const roomsService = {
  async list(query: ListRoomsQuery) {
    const where = {
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.building ? { building: query.building } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { code: { contains: query.search, mode: 'insensitive' as const } },
              {
                building: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'building'
    const orderBy = [
      { [primarySort]: query.sortOrder },
      // Stable tiebreaker — the previous static sort `[{ building }, { code }]`
      // was already stable, but the primary sort is now caller-selectable, so
      // a fallback is needed to keep pagination deterministic across pages.
      ...(primarySort !== 'code' ? [{ code: 'asc' as const }] : []),
    ]

    const [items, total] = await Promise.all([
      prisma.room.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.room.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async getById(id: string) {
    const room = await prisma.room.findUnique({ where: { id } })
    if (!room) throw ApiError.notFound('Room not found')
    return room
  },

  /**
   * Create input is exactly `CreateRoomBody` — the schema already guarantees
   * every required field is present, so there's no defense-in-depth check to
   * duplicate here. If the service is called from somewhere other than a
   * route, the type system is what catches an incomplete input, not a
   * runtime `if (!x)` guard.
   */
  async create(input: CreateRoomBody) {
    const existing = await prisma.room.findUnique({
      where: { code: input.code },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict(`A room with code "${input.code}" already exists`)
    }

    return prisma.room.create({ data: input })
  },

  async update(id: string, changes: UpdateRoomBody) {
    await assertRoomExists(id)

    // Re-check the code only if it's actually changing. A PATCH that echoes
    // the current code should not fail its own uniqueness check.
    if (changes.code !== undefined) {
      const current = await prisma.room.findUnique({
        where: { id },
        select: { code: true },
      })
      if (current && changes.code !== current.code) {
        const collision = await prisma.room.findUnique({
          where: { code: changes.code },
          select: { id: true },
        })
        if (collision) {
          throw ApiError.conflict(
            `A room with code "${changes.code}" already exists`
          )
        }
      }
    }

    return prisma.room.update({ where: { id }, data: changes })
  },

  /**
   * Hard delete. Two things to check:
   *
   *   1. Schedules — the `Schedule` model references rooms by name
   *      (`room: "Room 101"`), not by FK. Deleting the room doesn't orphan
   *      a foreign key, but it does leave a schedule pointing at a name
   *      that no longer resolves to a room. A count query catches the case.
   *
   *   2. Future bookings (if you later add a booking/reservation model).
   *      Same pattern: count and refuse if non-zero.
   *
   * The hard delete vs. soft delete choice is deliberate — the current
   * schema has no `deletedAt` on Room, and rooms are structural (they don't
   * carry user-generated history the way attendance or grades do). If the
   * schema gains soft delete later, swap the final `delete` for an `update`
   * setting `deletedAt` and add `where: { deletedAt: null }` to every read.
   */
  async remove(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      select: { id: true, name: true, code: true },
    })
    if (!room) throw ApiError.notFound('Room not found')

    // Schedules reference rooms by name in the current schema. If your
    // schema stores a `roomId` FK instead, change the where clause to
    // `{ roomId: id }`.
    const scheduleCount = await prisma.schedule.count({
      where: { room: room.name },
    })
    if (scheduleCount > 0) {
      throw ApiError.conflict(
        `Cannot delete "${room.name}": ${scheduleCount} schedule(s) still reference it. ` +
          'Reassign those schedules to another room first.'
      )
    }

    await prisma.room.delete({ where: { id } })
  },
}