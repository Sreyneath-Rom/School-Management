// src/services/eventService.ts
import { apiClient, ApiError } from '@/lib/apiClient'

export type EventCategory =
  | 'Academic'
  | 'Exam'
  | 'Holiday'
  | 'Extracurricular'
  | 'Meeting'

export type EventAudience =
  | 'All'
  | 'Students'
  | 'Teachers'
  | 'Parents'
  | 'Staff'

export interface SchoolEvent {
  id: string
  title: string
  category: EventCategory
  /** ISO date, e.g. "2026-03-02" */
  date: string
  /** 24-hour "HH:MM" */
  startTime: string
  endTime: string
  location: string
  targetAudience: EventAudience
  description: string
  organizer: string
  isAllDay: boolean
}

export type EventPayload = Omit<SchoolEvent, 'id'>

const STUB_MESSAGE =
  'The calendar module is not yet implemented on the backend. Events cannot be saved until the /events endpoint exists.'

function isStubError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 501 || err.status === 404)
}

export const eventService = {
  /** Reads return [] if the endpoint isn't there yet. */
  list: async (): Promise<SchoolEvent[]> => {
    try {
      const data = await apiClient.get<SchoolEvent[]>('/events')
      return Array.isArray(data) ? data : []
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  getById: async (id: string): Promise<SchoolEvent> =>
    apiClient.get<SchoolEvent>(`/events/${id}`),

  /** Writes throw with a friendly message if the endpoint is a stub. */
  create: async (payload: EventPayload): Promise<SchoolEvent> => {
    try {
      return await apiClient.post<SchoolEvent>('/events', payload)
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  update: async (id: string, payload: Partial<EventPayload>): Promise<SchoolEvent> => {
    try {
      return await apiClient.patch<SchoolEvent>(`/events/${id}`, payload)
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<void>(`/events/${id}`)
    } catch (err) {
      if (isStubError(err)) throw new Error(STUB_MESSAGE)
      throw err
    }
  },

  stubMessage: STUB_MESSAGE,
}