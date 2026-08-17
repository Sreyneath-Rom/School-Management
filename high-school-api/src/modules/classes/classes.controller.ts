import type { Request, Response } from 'express'
import { classesService } from './classes.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const classesController = {
  async list(req: Request, res: Response) {
    const { gradeLevel } = req.query as { gradeLevel?: string }
    sendSuccess(res, await classesService.list({ gradeLevel: gradeLevel ? Number(gradeLevel) : undefined }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await classesService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await classesService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await classesService.update(req.params.id, req.body))
  },

  async remove(req: Request, res: Response) {
    await classesService.remove(req.params.id)
    // Soft delete under the hood, but the response contract is the same
    // empty 204 as every other module's remove.
    res.status(204).end()
  },
}