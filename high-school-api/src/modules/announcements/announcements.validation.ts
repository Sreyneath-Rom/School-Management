import { z } from 'zod'

/**
 * Audiences are role names plus the special value `'all'`. Kept in sync with
 * the roles seeded in prisma/seed.ts (ROLE_DEFS). A free-form string here
 * would let a client write an announcement addressed to an audience nobody
 * has — invisible to everyone, but polluting the table.
 */
export const AUDIENCES = ['all', 'admin', 'teacher', 'student', 'parent'] as const
export type Audience = (typeof AUDIENCES)[number]

/**
 * NOTE — `authorId` is intentionally absent.
 *
 * The previous version accepted `authorId` from the request body, which
 * allowed any caller holding `announcements.create` to attribute an
 * announcement to another user. The author is set from `req.user.sub` in the
 * controller, not from client input.
 */
export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(10_000),
  audience: z.enum(AUDIENCES).default('all'),
})

/**
 * Update schema mirrors create minus `authorId`. It also does NOT allow
 * changing the author — reassigning authorship of an existing announcement
 * is not a meaningful operation and would only exist as an audit-trail
 * hazard.
 */
export const updateAnnouncementSchema = createAnnouncementSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type CreateAnnouncementBody = z.infer<typeof createAnnouncementSchema>
export type UpdateAnnouncementBody = z.infer<typeof updateAnnouncementSchema>