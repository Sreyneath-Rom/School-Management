// src/services/notificationService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateNotificationPayload,
  ListNotificationsQuery,
  Notification,
} from '@/types/notification'

/**
 * Notifications are always scoped to the authenticated user. There is no
 * admin endpoint for viewing another user's notifications.
 *
 * The "mark as read" operation sends `{ read: boolean }` — the server
 * decides the timestamp. Do not send a date.
 */
export const notificationService = {
  list: (params?: ListNotificationsQuery) => {
    const query = new URLSearchParams()
    if (params?.unreadOnly !== undefined) query.set('unreadOnly', String(params.unreadOnly))
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<Notification[]>(`/notifications${qs}`)
  },

  getById: (id: string) => apiClient.get<Notification>(`/notifications/${id}`),

  /** Mark read or unread. The server sets the timestamp. */
  setRead: (id: string, read: boolean) =>
    apiClient.patch<Notification>(`/notifications/${id}`, { read }),

  /** Bulk mark everything as read. No body, no parameters. */
  markAllRead: () => apiClient.post<void>('/notifications/read-all'),

  delete: (id: string) => apiClient.delete<void>(`/notifications/${id}`),

  /** Admin-only. Gated by `requireRole('admin')` on the backend. */
  create: (payload: CreateNotificationPayload) =>
    apiClient.post<Notification>('/notifications', payload),
}