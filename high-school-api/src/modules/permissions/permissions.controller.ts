import type { Request, Response } from 'express'
import { permissionsService } from './permissions.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreatePermissionBody,
  UpdatePermissionBody,
} from './permissions.validation'

export const permissionsController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await permissionsService.list())
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreatePermissionBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await permissionsService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdatePermissionBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await permissionsService.update(req.params.permissionId, body)
    )
  },

  async remove(req: Request, res: Response) {
    await permissionsService.remove(req.params.permissionId)
    res.status(204).end()
  },
}