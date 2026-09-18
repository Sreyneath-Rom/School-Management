import { z } from 'zod'

/**
 * Notifications are created by the system or by admins — see the route file
 * for why `create` is admin-only. A client cannot choose to notify an
 * arbitrary user.
 *
 * `userId` is the recipient. Because this is a system/admin operation (not a
 * user-self-service one), the recipient id comes from the request body, not
 * from `req.user.sub` — unlike homework submissions or grade entries, where
 * the "actor" is the caller.
 */
export const createNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
  channel: z.enum(['PUSH', 'EMAIL', 'IN_APP']).default('IN_APP'),
})

/**
 * The update operation is "mark as read" or "mark as unread" — nothing else.
 *
 * The previous schema exposed `readAt` directly as a `Date`, which let a
 * client set an arbitrary timestamp ("I read this in 1999") and allowed an
 * empty `{}` body that produced a no-op update. A boolean is the actual
 * operation; the server decides the timestamp.
 */
export const updateNotificationSchema = z.object({
  read: z.boolean(),
})

/**
 * Query schema for the list endpoint.
 *
 * `z.coerce.boolean()` is unsafe here — `Boolean("false")` is `true`, so a
 * client sending `?unreadOnly=false` would get only-unread results, which is
 * the opposite of what they asked for. The enum-then-transform pattern below
 * accepts only the exact strings `"true"` and `"false"` and converts them
 * after validation.
 */
export const listNotificationsQuerySchema = z.object({
  unreadOnly: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export type CreateNotificationBody = z.infer<typeof createNotificationSchema>
export type UpdateNotificationBody = z.infer<typeof updateNotificationSchema>
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>