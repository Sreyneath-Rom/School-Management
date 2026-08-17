import type { Request, Response } from 'express'
import { studentsService } from './students.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { paginationQuerySchema } from '@/utils/pagination'

export const studentsController = {
  async list(req: Request, res: Response) {
    const pagination = paginationQuerySchema.parse(req.query)
    const { classId } = req.query as { classId?: string }
    const { items, meta } = await studentsService.list(pagination, classId)
    sendSuccess(res, items, 200, meta)
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await studentsService.getProfile(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await studentsService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await studentsService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await studentsService.remove(req.params.id)
    res.status(204).send()
  },
}