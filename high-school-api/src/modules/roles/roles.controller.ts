import type { Request, Response } from 'express'
import { rolesService } from './roles.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateRoleBody,
  UpdateRoleBody,
  UpdateRolePermissionsBody,
} from './roles.validation'

export const rolesController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await rolesService.list())
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateRoleBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await rolesService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateRoleBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await rolesService.update(req.params.roleId, body))
  },

  async remove(req: Request, res: Response) {
    await rolesService.remove(req.params.roleId)
    res.status(204).end()
  },

  async updatePermissions(req: Request, res: Response) {
    const body = req.validated?.body as UpdateRolePermissionsBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await rolesService.replacePermissions(req.params.roleId, body.permissionIds)
    )
  },
}