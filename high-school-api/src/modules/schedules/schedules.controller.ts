import type { Request, Response } from 'express'
import { schedulesService } from './schedules.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const schedulesController = {
  async list(req: Request, res: Response) {
    const { classId, teacherId } = req.query as { classId?: string; teacherId?: string }
    sendSuccess(res, await schedulesService.list({ classId, teacherId }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await schedulesService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await schedulesService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await schedulesService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await schedulesService.remove(req.params.id)
    res.status(204).send()
  },
}