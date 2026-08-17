import type { Request, Response } from 'express'
import { notificationsService } from './notifications.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

// req.user is typed as possibly-undefined (set by `authenticate`, which every
// route here already runs behind — see notifications.routes.ts — so in
// practice it's always present by the time these handlers run; this just
// satisfies TS and fails loudly instead of silently if that ever changes).
//
// NOTE: `.sub` is assumed to be the user-id claim on AccessTokenPayload
// (the standard JWT "subject" field). If your AccessTokenPayload uses a
// different property for the user's id, change it ONLY here.
function requireUserId(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.sub
}

export const notificationsController = {
  async list(req: Request, res: Response) {
    const { unreadOnly } = req.query as { unreadOnly?: string }
    sendSuccess(res, await notificationsService.list(requireUserId(req), { unreadOnly: unreadOnly === 'true' }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await notificationsService.getById(req.params.id, requireUserId(req)))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await notificationsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await notificationsService.update(req.params.id, requireUserId(req), req.body))
  },

  async remove(req: Request, res: Response) {
    await notificationsService.remove(req.params.id, requireUserId(req))
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}