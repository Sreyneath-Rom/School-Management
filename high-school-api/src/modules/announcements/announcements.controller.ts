import type { Request, Response } from 'express'
import { announcementsService } from './announcements.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateAnnouncementBody,
  UpdateAnnouncementBody,
} from './announcements.validation'

/**
 * `authenticate` runs on every route in announcements.routes.ts, so
 * `req.user` is set by the time any handler here runs. The guard exists so
 * TypeScript can narrow the type without a non-null assertion at every call.
 */
function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const announcementsController = {
  async list(req: Request, res: Response) {
    const user = requireUser(req)
    sendSuccess(res, await announcementsService.list(user.roleName))
  },

  async getById(req: Request, res: Response) {
    const user = requireUser(req)
    sendSuccess(
      res,
      await announcementsService.getById(req.params.id, user.roleName)
    )
  },

  async create(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as CreateAnnouncementBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Author comes from the authenticated token, NOT from the request body.
    // This is the fix for the previous version, which accepted `authorId`
    // from client input and let any caller forge authorship.
    sendCreated(
      res,
      await announcementsService.create({ ...body, authorId: user.sub })
    )
  },

  async update(req: Request, res: Response) {
    requireUser(req) // ensures the caller is authenticated before proceeding
    const body = req.validated?.body as UpdateAnnouncementBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await announcementsService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    requireUser(req)
    await announcementsService.remove(req.params.id)
    // 204 must not include a body. Bypassing sendSuccess here is intentional —
    // the JSON envelope helper always writes a JSON body.
    res.status(204).end()
  },
}