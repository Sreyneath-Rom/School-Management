import type { Request, Response } from 'express'
import path from 'path'
import { schoolService } from './school.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

export const schoolController = {
  async get(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.get())
  },

  async create(req: Request, res: Response) {
    sendCreated(res, await schoolService.create(req.body))
  },

  async update(req: Request, res: Response) {
    sendSuccess(res, await schoolService.update(req.body))
  },

  async upsert(req: Request, res: Response) {
    sendSuccess(res, await schoolService.upsert(req.body))
  },

  async remove(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.remove())
  },

  async uploadLogo(req: Request, res: Response) {
    if (!req.file) throw ApiError.badRequest('No logo file provided')
    const logoUrl = `/uploads/${path.basename(req.file.path)}`
    sendSuccess(res, await schoolService.updateLogo(logoUrl))
  },

  async removeLogo(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.removeLogo())
  },
}