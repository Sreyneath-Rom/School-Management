import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

type RoomInput = {
  name?: string
  code?: string
  building?: string
  floor?: string
  type?: 'Classroom' | 'Science Lab' | 'Computer Lab' | 'Auditorium' | 'Library Wing'
  capacity?: number
  amenities?: string[]
  status?: 'Available' | 'Occupied' | 'Maintenance'
  currentClass?: string | null
}

export const roomsService = {
  async list(filters: { type?: string; status?: string; search?: string } = {}) {
    const search = filters.search?.trim()
    return prisma.room.findMany({
      where: {
        ...(filters.type && filters.type !== 'All' ? { type: filters.type } : {}),
        ...(filters.status && filters.status !== 'All' ? { status: filters.status } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
            { building: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: [{ building: 'asc' }, { code: 'asc' }],
    })
  },

  async getById(id: string) {
    const room = await prisma.room.findUnique({ where: { id } })
    if (!room) throw ApiError.notFound('Room not found')
    return room
  },

  async create(input: RoomInput) {
    if (!input.name || !input.code || !input.building || !input.floor || !input.type || !input.capacity) {
      throw ApiError.badRequest('Room name, code, building, floor, type, and capacity are required')
    }
    const existing = await prisma.room.findUnique({ where: { code: input.code } })
    if (existing) throw ApiError.conflict(`Room code "${input.code}" already exists`)
    return prisma.room.create({ data: { ...input, amenities: input.amenities ?? [] } })
  },

  async update(id: string, input: RoomInput) {
    await roomsService.getById(id)
    if (input.code) {
      const existing = await prisma.room.findUnique({ where: { code: input.code } })
      if (existing && existing.id !== id) throw ApiError.conflict(`Room code "${input.code}" already exists`)
    }
    return prisma.room.update({ where: { id }, data: input })
  },

  async remove(id: string) {
    await roomsService.getById(id)
    await prisma.room.delete({ where: { id } })
  },
}
