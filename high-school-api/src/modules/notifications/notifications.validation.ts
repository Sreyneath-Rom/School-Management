import { z } from 'zod'

export const createNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  channel: z.enum(['PUSH', 'EMAIL', 'IN_APP']).default('IN_APP'),
})

export const updateNotificationSchema = z.object({
  readAt: z.coerce.date().optional(),
})
