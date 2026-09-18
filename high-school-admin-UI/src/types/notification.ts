// src/types/notification.ts

/**
 * Delivery channel — matches the backend's `NotificationChannel` Prisma
 * enum exactly. Uppercase.
 */
export type NotificationChannel = 'PUSH' | 'EMAIL' | 'IN_APP'

/**
 * A notification. Always scoped to the authenticated user — there is no
 * endpoint that returns another user's notifications.
 */
export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  channel: NotificationChannel
  readAt: string | null
  createdAt: string
}

/**
 * Payload for `PATCH /notifications/:id` — the only mutable state is
 * whether the notification is read. The server sets the timestamp; the
 * client sends a boolean.
 */
export interface UpdateNotificationPayload {
  read: boolean
}

/**
 * Payload for `POST /notifications` — admin-only.
 */
export interface CreateNotificationPayload {
  userId: string
  title: string
  body: string
  channel?: NotificationChannel
}

/**
 * Query parameters for `GET /notifications`.
 *
 * `unreadOnly` is a string in the URL — `?unreadOnly=true`. The frontend
 * passes the boolean; the API layer serializes it.
 */
export interface ListNotificationsQuery {
  unreadOnly?: boolean
  page?: number
  limit?: number
}