import type { Request, Response } from 'express'
import { leaveRequestsService } from './leaveRequests.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

// Same pattern as notifications.controller.ts's requireUserId — `.sub` is
// confirmed correct here since the original review handler already used
// req.user.sub directly.
function requireUserId(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.sub
}

export const leaveRequestsController = {
  async list(req: Request, res: Response) {
    const { studentId, status } = req.query as { studentId?: string; status?: string }
    sendSuccess(res, await leaveRequestsService.list({ studentId, status }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await leaveRequestsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await leaveRequestsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await leaveRequestsService.update(req.params.id, req.body))
  },

  async review(req: Request, res: Response) {
    sendSuccess(res, await leaveRequestsService.review(req.params.id, req.body.status, requireUserId(req)))
  },

  async remove(req: Request, res: Response) {
    await leaveRequestsService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}