import type { Request, Response } from 'express'
import { teachersService } from './teachers.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const teachersController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await teachersService.list())
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await teachersService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await teachersService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await teachersService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await teachersService.remove(req.params.id)
    res.status(204).send()
  },
}