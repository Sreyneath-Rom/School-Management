import type { Request, Response } from 'express'
import { academicYearsService } from './academicYears.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const academicYearsController = {
  async list(_req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.list())
  },
  async getById(req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.getById(req.params.id))
  },
  async create(req: Request, res: Response) {
    sendCreated(res, await academicYearsService.create(req.body))
  },
  async update(req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.update(req.params.id, req.body))
  },
  async setCurrent(req: Request, res: Response) {
    sendSuccess(res, await academicYearsService.setCurrent(req.params.id))
  },
  async remove(req: Request, res: Response) {
    await academicYearsService.remove(req.params.id)
    res.status(204).end()
  },
}
