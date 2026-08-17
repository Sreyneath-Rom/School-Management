
import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const announcementsService = {
  // 'all' is always visible; otherwise the announcement's audience must match
  // the requester's role name.
  async list(requestingRoleName: string) {
    return prisma.announcement.findMany({
      where: { OR: [{ audience: 'all' }, { audience: requestingRoleName }] },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(announcementId: string, requestingRoleName: string) {
    const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } })
    if (!announcement) throw ApiError.notFound('Announcement not found')

    if (announcement.audience !== 'all' && announcement.audience !== requestingRoleName) {
      throw ApiError.forbidden('This announcement is not addressed to your audience')
    }
    return announcement
  },

  async create(input: { title: string; content: string; audience: string; authorId: string }) {
    return prisma.announcement.create({ data: input })
  },

  // No author check — anyone holding the `announcements:edit` permission can
  // update any announcement (per your answer). If you later want to restrict
  // this to the original author, add an authorId comparison here.
  async update(
    announcementId: string,
    changes: Partial<{ title: string; content: string; audience: string; authorId: string }>
  ) {
    const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } })
    if (!announcement) throw ApiError.notFound('Announcement not found')

    return prisma.announcement.update({ where: { id: announcementId }, data: changes })
  },

  async remove(announcementId: string) {
    const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } })
    if (!announcement) throw ApiError.notFound('Announcement not found')

    await prisma.announcement.delete({ where: { id: announcementId } })
  },
}