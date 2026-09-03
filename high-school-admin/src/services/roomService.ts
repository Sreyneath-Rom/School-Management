import { apiClient } from '@/lib/apiClient'

export type RoomType = 'Classroom' | 'Science Lab' | 'Computer Lab' | 'Auditorium' | 'Library Wing'
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance'

export interface RoomRecord {
  id: string
  name: string
  code: string
  building: string
  floor: string
  type: RoomType
  capacity: number
  amenities: string[]
  status: RoomStatus
  currentClass?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateRoomPayload {
  name: string
  code: string
  building: string
  floor: string
  type: RoomType
  capacity: number
  amenities: string[]
  status?: RoomStatus
  currentClass?: string
}

export interface UpdateRoomPayload extends Partial<CreateRoomPayload> {}

export const roomService = {
  list: async (): Promise<RoomRecord[]> => {
    return apiClient.get<RoomRecord[]>('/rooms')
  },

  getById: async (id: string): Promise<RoomRecord> => {
    return apiClient.get<RoomRecord>(`/rooms/${id}`)
  },

  create: async (payload: CreateRoomPayload): Promise<RoomRecord> => {
    return apiClient.post<RoomRecord>('/rooms', payload)
  },

  update: async (id: string, payload: UpdateRoomPayload): Promise<RoomRecord> => {
    return apiClient.patch<RoomRecord>(`/rooms/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/rooms/${id}`)
  },
}
