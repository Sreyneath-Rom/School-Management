import type { Request, Response } from 'express'
import { schedulesService } from './schedules.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateScheduleBody,
  ListSchedulesQuery,
  UpdateScheduleBody,
} from './schedules.validation'

export const schedulesController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListSchedulesQuery

    const result = await schedulesService.list(query)

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
    sendSuccess(res, await schedulesService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateScheduleBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await schedulesService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateScheduleBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await schedulesService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await schedulesService.remove(req.params.id)
    res.status(204).end()
  },
}