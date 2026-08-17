import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

// Every caller is scoped to their own notifications — no admin/staff bypass.
// If staff need to view or manage notifications on a user's behalf, that
// needs an explicit elevated-permission check added here (e.g. checking for
// a `notifications.manage-all` permission on req.user before skipping this).
function assertOwnership(notification: { userId: string } | null, requestingUserId: string) {
  if (!notification) throw ApiError.notFound('Notification not found')
  if (notification.userId !== requestingUserId) throw ApiError.forbidden('Not your notification')
}

export const notificationsService = {
  async list(requestingUserId: string, filters: { unreadOnly?: boolean }) {
    return prisma.notification.findMany({
      where: {
        userId: requestingUserId,
        readAt: filters.unreadOnly ? null : undefined,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(notificationId: string, requestingUserId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
    assertOwnership(notification, requestingUserId)
    return notification
  },

  // Not ownership-scoped — this is how a notification gets sent TO a user in
  // the first place, so `userId` in the body is the recipient, not the caller.
  async create(input: { userId: string; title: string; body: string; channel: 'PUSH' | 'EMAIL' | 'IN_APP' }) {
    return prisma.notification.create({ data: input })
  },

  async update(notificationId: string, requestingUserId: string, changes: { readAt?: Date }) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
    assertOwnership(notification, requestingUserId)

    return prisma.notification.update({ where: { id: notificationId }, data: changes })
  },

  async remove(notificationId: string, requestingUserId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
    assertOwnership(notification, requestingUserId)

    await prisma.notification.delete({ where: { id: notificationId } })
  },
}