import type { Request, Response } from 'express'
import { usersService } from './users.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  BulkStatusBody,
  CreateUserBody,
  ListUsersQuery,
  ResetUserPasswordBody,
  UpdateUserBody,
} from './users.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const usersController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListUsersQuery

    const { items, meta } = await usersService.list(query)
    sendSuccess(res, items, 200, meta)
  },

  async getById(req: Request, res: Response) {
    requireUser(req)
    sendSuccess(res, await usersService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as CreateUserBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await usersService.create(body))
  },

  async update(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpdateUserBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await usersService.update(req.params.id, body, user.sub))
  },

  async remove(req: Request, res: Response) {
    const user = requireUser(req)
    await usersService.softDelete(req.params.id, user.sub)
    res.status(204).end()
  },

  async resetPassword(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as ResetUserPasswordBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    await usersService.resetPassword(req.params.id, body.newPassword)
    // 204: the caller must not be able to distinguish "reset happened" from
    // "reset happened but the user was already logged out" — no state to return.
    res.status(204).end()
  },

  async bulkUpdateStatus(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as BulkStatusBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await usersService.bulkUpdateStatus(body, user.sub))
  },
}