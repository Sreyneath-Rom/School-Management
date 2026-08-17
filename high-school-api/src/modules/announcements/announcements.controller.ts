import type { Request, Response } from 'express'
import { announcementsService } from './announcements.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

// Same pattern as notifications.controller.ts's requireUserId — req.user is
// only possibly-undefined to TypeScript, not in practice, since `authenticate`
// runs on every route in announcements.routes.ts.
//
// NOTE: `.roleName` is assumed to be the role-name claim on AccessTokenPayload
// (per your answer that audience is determined by role name). If your token
// payload names this differently, change it ONLY here.
function requireRoleName(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.roleName
}

export const announcementsController = {
  async list(req: Request, res: Response) {
    sendSuccess(res, await announcementsService.list(requireRoleName(req)))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await announcementsService.getById(req.params.id, requireRoleName(req)))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await announcementsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await announcementsService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await announcementsService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}