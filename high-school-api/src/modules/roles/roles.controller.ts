import type { Request, Response } from 'express'
import { rolesService } from './roles.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const rolesController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await rolesService.list())
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await rolesService.create(req.body.name, req.body.label))
  },

  async update(req: Request, res: Response) {
    sendSuccess(
      res,
      await rolesService.update(req.params.roleId, { name: req.body.name, label: req.body.label })
    )
  },

  async remove(req: Request, res: Response) {
    await rolesService.remove(req.params.roleId)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },

  async updatePermissions(req: Request, res: Response) {
    sendSuccess(res, await rolesService.replacePermissions(req.params.roleId, req.body.permissionIds))
  },
}