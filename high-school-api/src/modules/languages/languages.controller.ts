import type { Request, Response } from 'express'
import { languagesService } from './languages.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateLanguageBody,
  UpdateLanguageBody,
} from './languages.validation'

export const languagesController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await languagesService.list())
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateLanguageBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await languagesService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateLanguageBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await languagesService.update(req.params.code, body))
  },

  async remove(req: Request, res: Response) {
    await languagesService.remove(req.params.code)
    // 204 must not include a body. The service returns a summary object for
    // callers that want it (e.g. an admin audit log), but the HTTP contract
    // stays as an empty response.
    res.status(204).end()
  },
}