import type { Request, Response } from 'express'
import { usersService } from './users.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { paginationQuerySchema } from '@/utils/pagination'

export const usersController = {
  async list(req: Request, res: Response) {
    const pagination = paginationQuerySchema.parse(req.query)
    const { items, meta } = await usersService.list(pagination)
    sendSuccess(res, items, 200, meta)
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await usersService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await usersService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await usersService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await usersService.softDelete(req.params.id)
    res.status(204).send()
  },

  async resetPassword(req: Request, res: Response) {
    await usersService.resetPassword(req.params.id, req.body.newPassword)
    res.status(204).send()
  },
}
