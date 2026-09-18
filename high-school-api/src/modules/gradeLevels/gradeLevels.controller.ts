import type { Request, Response } from 'express'
import { gradeLevelsService } from './gradeLevels.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const gradeLevelsController = {
  async list(req: Request, res: Response) {
    const { search, status } = req.query as { search?: string; status?: string }
    sendSuccess(res, await gradeLevelsService.list({ search, status }))
  },
  async getById(req: Request, res: Response) {
    sendSuccess(res, await gradeLevelsService.getById(req.params.id))
  },
  async create(req: Request, res: Response) {
    sendCreated(res, await gradeLevelsService.create(req.body))
  },
  async update(req: Request, res: Response) {
    sendSuccess(res, await gradeLevelsService.update(req.params.id, req.body))
  },
  async remove(req: Request, res: Response) {
    await gradeLevelsService.remove(req.params.id)
    res.status(204).end()
  },
}
