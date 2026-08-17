import type { Request, Response } from 'express'
import { gradesService } from './grades.service'
import { sendSuccess } from '@/utils/apiResponse'

export const gradesController = {
  async list(req: Request, res: Response) {
    const { studentId, subjectId, period } = req.query as {
      studentId?: string
      subjectId?: string
      period?: string
    }
    sendSuccess(res, await gradesService.list({ studentId, subjectId, period }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await gradesService.getById(req.params.id))
  },

  async upsert(req: Request, res: Response) {
    sendSuccess(res, await gradesService.upsert(req.body))
  },

  async remove(req: Request, res: Response) {
    await gradesService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}