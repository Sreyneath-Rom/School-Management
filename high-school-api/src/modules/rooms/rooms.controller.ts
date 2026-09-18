import type { Request, Response } from 'express'
import { roomsService } from './rooms.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const roomsController = {
  async list(req: Request, res: Response) {
    const { type, status, search } = req.query as { type?: string; status?: string; search?: string }
    sendSuccess(res, await roomsService.list({ type, status, search }))
  },
  async getById(req: Request, res: Response) {
    sendSuccess(res, await roomsService.getById(req.params.id))
  },
  async create(req: Request, res: Response) {
    sendCreated(res, await roomsService.create(req.body))
  },
  async update(req: Request, res: Response) {
    sendSuccess(res, await roomsService.update(req.params.id, req.body))
  },
  async remove(req: Request, res: Response) {
    await roomsService.remove(req.params.id)
    res.status(204).end()
  },
}
