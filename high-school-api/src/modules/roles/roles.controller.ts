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

  async updatePermissions(req: Request, res: Response) {
    sendSuccess(res, await rolesService.replacePermissions(req.params.roleId, req.body.permissionIds))
  },
}
