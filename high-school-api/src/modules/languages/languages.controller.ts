import type { Request, Response } from 'express'
import { languagesService } from './languages.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const languagesController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await languagesService.list())
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await languagesService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await languagesService.update(req.params.code, req.body))
  },

  async remove(req: Request, res: Response) {
    await languagesService.remove(req.params.code)
    res.status(204).send()
  },
}