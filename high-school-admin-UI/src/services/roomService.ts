// src/services/roomService.ts
import { apiClient } from '@/lib/apiClient'

export type RoomType =
  | 'Classroom'
  | 'Science Lab'
  | 'Computer Lab'
  | 'Auditorium'
  | 'Library Wing'

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
  amenities?: string[]
  status?: RoomStatus
  currentClass?: string | null
}

export interface ListRoomsQuery {
  type?: RoomType
  status?: RoomStatus
  building?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'code' | 'building' | 'capacity' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export const roomService = {
  list: (params?: ListRoomsQuery) => {
    const query = new URLSearchParams()
    if (params?.type) query.set('type', params.type)
    if (params?.status) query.set('status', params.status)
    if (params?.building) query.set('building', params.building)
    if (params?.search) query.set('search', params.search)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<RoomRecord[]>(`/rooms${qs}`)
  },

  getById: (id: string) => apiClient.get<RoomRecord>(`/rooms/${id}`),

  create: (payload: RoomPayload) =>
    apiClient.post<RoomRecord>('/rooms', payload),

  update: (id: string, payload: Partial<RoomPayload>) =>
    apiClient.patch<RoomRecord>(`/rooms/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/rooms/${id}`),
}