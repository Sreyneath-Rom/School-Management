import type { Request, Response } from 'express'
import { termsService } from './terms.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'

export const termsController = {
  async list(req: Request, res: Response) {
    sendSuccess(res, await termsService.list((req.query as { academicYearId?: string }).academicYearId))
  },
  async getById(req: Request, res: Response) { sendSuccess(res, await termsService.getById(req.params.id)) },
  async create(req: Request, res: Response) { sendCreated(res, await termsService.create(req.body)) },
  async update(req: Request, res: Response) { sendSuccess(res, await termsService.update(req.params.id, req.body)) },
  async setActive(req: Request, res: Response) { sendSuccess(res, await termsService.setActive(req.params.id)) },
  async remove(req: Request, res: Response) { await termsService.remove(req.params.id); res.status(204).end() },
}
