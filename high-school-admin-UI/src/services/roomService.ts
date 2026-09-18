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
  currentClass?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface RoomPayload {
  name: string
  code: string
  building: string
  floor: string
  type: RoomType
  capacity: number
  amenities: string[]
  status?: RoomStatus
  currentClass?: string | null
}

export const roomService = {
  list: (params?: { type?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.type && params.type !== 'All') query.set('type', params.type)
    if (params?.status && params.status !== 'All') query.set('status', params.status)
    if (params?.search) query.set('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<RoomRecord[]>(`/rooms${qs}`)
  },
  getById: (id: string) => apiClient.get<RoomRecord>(`/rooms/${id}`),
  create: (payload: RoomPayload) => apiClient.post<RoomRecord>('/rooms', payload),
  update: (id: string, payload: Partial<RoomPayload>) => apiClient.patch<RoomRecord>(`/rooms/${id}`, payload),
  delete: (id: string) => apiClient.delete<void>(`/rooms/${id}`),
}
