import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateNotificationBody,
  ListNotificationsQuery,
  UpdateNotificationBody,
} from './notifications.validation'

function assertOwnership(
  notification: { userId: string } | null,
  requestingUserId: string
): asserts notification is { userId: string } {
  if (!notification) throw ApiError.notFound('Notification not found')
  if (notification.userId !== requestingUserId) {
    throw ApiError.forbidden('This notification does not belong to you')
  }
}

export const notificationsService = {
  async list(requestingUserId: string, query: ListNotificationsQuery) {
    const where = {
      userId: requestingUserId,
      ...(query.unreadOnly ? { readAt: null } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.notification.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async unreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, readAt: null },
    })
    return { count }
  },

  async getById(notificationId: string, requestingUserId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId: requestingUserId },
    })
    if (!notification) throw ApiError.notFound('Notification not found')
    return notification
  },

  async create(input: CreateNotificationBody) {
    const recipient = await prisma.user.findFirst({
      where: { id: input.userId, deletedAt: null, isActive: true },
      select: { id: true },
    })
    if (!recipient) {
      throw ApiError.badRequest(
        'userId does not refer to an existing active user'
      )
    }

    return prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        body: input.body,
        channel: input.channel,
      },
    })
  },

  async update(
    notificationId: string,
    requestingUserId: string,
    changes: UpdateNotificationBody
  ) {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId: requestingUserId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Notification not found')

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: changes.read ? new Date() : null },
    })
  },

  async remove(notificationId: string, requestingUserId: string) {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId: requestingUserId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Notification not found')

    await prisma.notification.delete({ where: { id: notificationId } })
  },
}