import type { Request, Response } from 'express'
import { roomsService } from './rooms.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateRoomBody,
  ListRoomsQuery,
  UpdateRoomBody,
} from './rooms.validation'

export const roomsController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListRoomsQuery

    const result = await roomsService.list(query)

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

  async getById(req: Request, res: Response) {
    sendSuccess(res, await roomsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateRoomBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await roomsService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateRoomBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await roomsService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await roomsService.remove(req.params.id)
    res.status(204).end()
  },
}