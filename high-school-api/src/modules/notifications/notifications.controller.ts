import type { Request, Response } from 'express'
import { notificationsService } from './notifications.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateNotificationBody,
  ListNotificationsQuery,
  UpdateNotificationBody,
} from './notifications.validation'

function requireUserId(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.sub
}

export const notificationsController = {
  async list(req: Request, res: Response) {
    const userId = requireUserId(req)
    const query = (req.validated?.query ?? {}) as ListNotificationsQuery

    const result = await notificationsService.list(userId, query)

    sendSuccess(
      res,
      result.items,
      200,
      buildPaginationMeta(result.total, {
        page: result.page,
        limit: result.limit,
      })
    )
  },

  async getById(req: Request, res: Response) {
    const userId = requireUserId(req)
    sendSuccess(res, await notificationsService.getById(req.params.id, userId))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateNotificationBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Note the asymmetry: this is the one operation where `userId` in the
    // body IS the recipient, not the caller. Access control is enforced by
    // the route (admin-only). See notifications.routes.ts.
    sendCreated(res, await notificationsService.create(body))
  },

  async update(req: Request, res: Response) {
    const userId = requireUserId(req)
    const body = req.validated?.body as UpdateNotificationBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await notificationsService.update(req.params.id, userId, body)
    )
  },

  async remove(req: Request, res: Response) {
    const userId = requireUserId(req)
    await notificationsService.remove(req.params.id, userId)
    res.status(204).end()
  },
}