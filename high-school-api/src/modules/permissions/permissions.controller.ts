import type { Request, Response } from 'express'
import { permissionsService } from './permissions.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const permissionsController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await permissionsService.list())
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await permissionsService.create(req.body.key))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await permissionsService.update(req.params.permissionId, req.body.key))
  },

  async remove(req: Request, res: Response) {
    await permissionsService.remove(req.params.permissionId)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}