import type { Request, Response } from 'express'
import { subjectsService } from './subjects.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateSubjectBody,
  ListSubjectsQuery,
  UpdateSubjectBody,
} from './subjects.validation'

export const subjectsController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListSubjectsQuery

    const result = await subjectsService.list(query)

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
    sendSuccess(res, await subjectsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateSubjectBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await subjectsService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateSubjectBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await subjectsService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await subjectsService.remove(req.params.id)
    res.status(204).end()
  },
}