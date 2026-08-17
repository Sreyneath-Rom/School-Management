import type { Request, Response } from 'express'
import { subjectsService } from './subjects.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const subjectsController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await subjectsService.list())
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await subjectsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await subjectsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await subjectsService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await subjectsService.remove(req.params.id)
    res.status(204).send()
  },
}