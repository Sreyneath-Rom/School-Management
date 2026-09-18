import type { Request, Response } from 'express'
import { examsService } from './exams.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  BatchMarkBody,
  CreateExamBody,
  CreateScheduleBody,
  GenerateReportCardBody,
  ListExamsQuery,
  ListMarksQuery,
  ListReportCardsQuery,
  ListSchedulesQuery,
  UpdateExamBody,
} from './exams.validation'

/**
 * Controllers read validated input from `req.validated` and forward to the
 * service. Write routes currently skip `validateBody` — the service throws
 * 501 before inspecting the body, so there is nothing to validate yet. The
 * `req.validated?.body` reads below are written so that adding `validateBody`
 * to a route is the only change required to make validation live.
 */

export const examsController = {
  // ---- Exams ----

  async list(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListExamsQuery
    sendSuccess(res, await examsService.list(query))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await examsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateExamBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await examsService.create(body), 201)
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateExamBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await examsService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await examsService.remove(req.params.id)
    res.status(204).end()
  },

  // ---- Schedules ----

  async listSchedules(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListSchedulesQuery
    sendSuccess(res, await examsService.listSchedules(query))
  },

  async createSchedule(req: Request, res: Response) {
    const body = req.validated?.body as CreateScheduleBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await examsService.createSchedule(body), 201)
  },

  // ---- Marks ----

  async listMarks(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListMarksQuery
    sendSuccess(res, await examsService.listMarks(query))
  },

  async batchMark(req: Request, res: Response) {
    const body = req.validated?.body as BatchMarkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await examsService.batchMark(body))
  },

  // ---- Report cards ----

  async listReportCards(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as ListReportCardsQuery
    sendSuccess(res, await examsService.listReportCards(query))
  },

  async generateReportCard(req: Request, res: Response) {
    const body = req.validated?.body as GenerateReportCardBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await examsService.generateReportCard(body), 201)
  },
}