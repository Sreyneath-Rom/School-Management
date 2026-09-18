import type { Request, Response } from 'express'
import { academicYearsService } from './academicYears.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateAcademicYearBody,
  UpdateAcademicYearBody,
} from './academicYears.validation'

/**
 * Controllers read validated input from `req.validated.body` — never from
 * `req.body` directly. The validation middleware leaves `req.body` untouched
 * so it's unambiguous whether a value was supplied by the client or produced
 * by a schema default/transform.
 */
export const academicYearsController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.list())
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateAcademicYearBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await academicYearsService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateAcademicYearBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await academicYearsService.update(req.params.id, body))
  },

  async setCurrent(req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.setCurrent(req.params.id))
  },

  async remove(req: Request, res: Response) {
    await academicYearsService.remove(req.params.id)
    res.status(204).end()
  },
}