// src/types/announcement.ts

/**
 * Audience the backend accepts. `'all'` reaches every role; the others
 * reach users whose role name matches exactly.
 */
export type AnnouncementAudience = 'all' | 'admin' | 'teacher' | 'student' | 'parent'

/**
 * An announcement as returned by the API.
 *
 * The list endpoint returns only announcements the caller's role can see:
 * those with `audience = 'all'` plus those whose `audience` matches their
 * role name.
 */
export interface Announcement {
  id: string
  title: string
  content: string
  audience: AnnouncementAudience
  authorId: string
  createdAt: string
  updatedAt: string

  // Hydrated relation
  author?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

/**
 * Payload for creating an announcement.
 *
 * `authorId` is resolved from `req.user.sub` on the backend — the schema
 * rejects it if you send it. Do not include it in the payload.
 */
export interface CreateAnnouncementPayload {
  title: string
  content: string
  audience?: AnnouncementAudience
}

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>