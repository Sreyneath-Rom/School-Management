import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  Audience,
  CreateAnnouncementBody,
  UpdateAnnouncementBody,
} from './announcements.validation'

export const announcementsService = {
  /**
   * Returns announcements visible to the calling role: everything addressed
   * to `'all'` plus anything addressed specifically to their role name.
   */
  async list(requestingRoleName: string) {
    return prisma.announcement.findMany({
      where: { OR: [{ audience: 'all' }, { audience: requestingRoleName }] },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(announcementId: string, requestingRoleName: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    })
    if (!announcement) throw ApiError.notFound('Announcement not found')

    // Same audience rule as the list endpoint — otherwise a caller could
    // enumerate IDs and read announcements addressed to other roles.
    if (
      announcement.audience !== 'all' &&
      announcement.audience !== requestingRoleName
    ) {
      throw ApiError.forbidden('This announcement is not addressed to your audience')
    }

    return announcement
  },

  /**
   * `authorId` is a required, explicit parameter rather than part of the
   * caller-supplied body — the controller passes `req.user.sub`. This makes
   * the trust boundary visible at the type level.
   */
  async create(input: CreateAnnouncementBody & { authorId: string }) {
    return prisma.announcement.create({
      data: {
        title: input.title,
        content: input.content,
        audience: input.audience as Audience,
        authorId: input.authorId,
      },
    })
  },

  /**
   * No author check: anyone holding `announcements.edit` may update any
   * announcement. If you later want to restrict edits to the original
   * author (or to admins), add that check here — the controller cannot
   * enforce it because it has no visibility into the existing row.
   */
  async update(announcementId: string, changes: UpdateAnnouncementBody) {
    const existing = await prisma.announcement.findUnique({
      where: { id: announcementId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Announcement not found')

    return prisma.announcement.update({
      where: { id: announcementId },
      data: changes,
    })
  },

  async remove(announcementId: string) {
    const existing = await prisma.announcement.findUnique({
      where: { id: announcementId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Announcement not found')

    await prisma.announcement.delete({ where: { id: announcementId } })
  },
}