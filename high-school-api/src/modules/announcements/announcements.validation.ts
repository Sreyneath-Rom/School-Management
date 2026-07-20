import { z } from 'zod'

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  audience: z.string().default('all'),
  authorId: z.string().cuid(),
})

export const updateAnnouncementSchema = createAnnouncementSchema.partial()
