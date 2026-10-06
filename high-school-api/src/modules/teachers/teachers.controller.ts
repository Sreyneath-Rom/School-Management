import type { Request, Response } from 'express'
import { teachersService } from './teachers.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateTeacherBody,
  ListTeachersQuery,
  UpdateTeacherBody,
} from './teachers.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const teachersController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListTeachersQuery
    const result = await teachersService.list(query)
    sendSuccess(
      res,
      result.items,
      200,
      buildPaginationMeta(result.total, {
        page: result.page,
        limit: result.limit,
      })
    )
  },

  async me(req: Request, res: Response) {
    const user = requireUser(req)
    sendSuccess(res, await teachersService.getByUserId(user.sub))
  },

  async getById(req: Request, res: Response) {
    requireUser(req)
    sendSuccess(res, await teachersService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as CreateTeacherBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendCreated(res, await teachersService.create(body))
  },

  async update(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as UpdateTeacherBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await teachersService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    requireUser(req)
    await teachersService.remove(req.params.id)
    res.status(204).end()
  },
}