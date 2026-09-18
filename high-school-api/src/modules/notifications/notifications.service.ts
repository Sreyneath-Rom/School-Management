import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateNotificationBody,
  ListNotificationsQuery,
  UpdateNotificationBody,
} from './notifications.validation'

/**
 * Every read/update/delete is scoped to the caller's own notifications —
 * no admin/staff bypass. A notification is personal; there is no legitimate
 * reason for one user to read another's.
 *
 * If the API ever needs "staff can view a user's notifications for support",
 * that should be a separate endpoint (`/admin/users/:id/notifications`) gated
 * by an explicit permission, not a silent relaxation of this rule.
 */
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
      // `null` when unreadOnly is true; `undefined` (no filter) otherwise.
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

  /**
   * Returns the caller's notification by id, or 404/403. The lookup is
   * combined with the ownership check: `findFirst` with `userId` in the
   * where clause can only return the caller's own row, so a hit means
   * ownership is already satisfied. A miss — whether the row doesn't exist
   * or belongs to someone else — is reported as 404 to avoid leaking whether
   * a given notification id exists for another user.
   */
  async getById(notificationId: string, requestingUserId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId: requestingUserId },
    })
    if (!notification) throw ApiError.notFound('Notification not found')
    return notification
  },

  /**
   * Creates a notification for `input.userId`. This is the one operation that
   * is NOT ownership-scoped — the recipient is the point of the endpoint.
   * Access control lives at the route level (admin-only); see
   * notifications.routes.ts.
   *
   * `assertRecipientExists` guards against a typo'd userId creating a row
   * that's never visible to anyone.
   */
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

  /**
   * Updates only the read state. The client says which state it wants; the
   * server decides the timestamp. A client-supplied `readAt` was a footgun:
   * it allowed marking a notification as read with a date in 1999, which
   * would then sort oddly in any UI that sorts by read timestamp.
   */
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