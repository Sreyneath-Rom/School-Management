import type { Request, Response } from 'express'
import { lessonsService } from './lessons.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const lessonsController = {
  async list(req: Request, res: Response) {
    const { subjectId, teacherId } = req.query as { subjectId?: string; teacherId?: string }
    sendSuccess(res, await lessonsService.list({ subjectId, teacherId }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await lessonsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await lessonsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await lessonsService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await lessonsService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}