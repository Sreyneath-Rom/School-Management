import type { Request, Response } from 'express'
import { termsService } from './terms.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateTermBody,
  ListTermsQuery,
  UpdateTermBody,
} from './terms.validation'

export const termsController = {
  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListTermsQuery
    sendSuccess(res, await termsService.list(query))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await termsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateTermBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await termsService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateTermBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await termsService.update(req.params.id, body))
  },

  async setActive(req: Request, res: Response) {
    sendSuccess(res, await termsService.setActive(req.params.id))
  },

  async remove(req: Request, res: Response) {
    await termsService.remove(req.params.id)
    res.status(204).end()
  },
}