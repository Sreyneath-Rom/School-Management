// src/services/announcementService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  Announcement,
  AnnouncementAudience,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '@/types/announcement'

/**
 * Announcements as returned by the backend. The list endpoint is scoped
 * server-side to the caller's role — a student never receives an
 * announcement targeted at teachers.
 *
 * `authorId` is resolved from the token on the backend; the create and
 * update payloads do not include it.
 */
export const announcementService = {
  /**
   * List announcements visible to the caller. Filtering by audience is a
   * server-side concern — do not pass `audience` here unless the backend
   * adds support for it.
   */
  list: () => apiClient.get<Announcement[]>('/announcements'),

  getById: (id: string) => apiClient.get<Announcement>(`/announcements/${id}`),

  create: (payload: CreateAnnouncementPayload) =>
    apiClient.post<Announcement>('/announcements', payload),

  update: (id: string, payload: UpdateAnnouncementPayload) =>
    apiClient.patch<Announcement>(`/announcements/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/announcements/${id}`),

  /** Quick filter helper for building audience dropdowns. */
  audiences: ['all', 'admin', 'teacher', 'student', 'parent'] as const satisfies readonly AnnouncementAudience[],
}