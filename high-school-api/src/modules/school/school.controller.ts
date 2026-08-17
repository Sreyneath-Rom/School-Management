import type { Request, Response } from 'express'
import path from 'path'
import { schoolService } from './school.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

export const schoolController = {
  async get(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.get())
  },

  async upsert(req: Request, res: Response) {
    sendSuccess(res, await schoolService.upsert(req.body))
  },

  async uploadLogo(req: Request, res: Response) {
    if (!req.file) throw ApiError.badRequest('No logo file provided')
    const logoUrl = `/uploads/${path.basename(req.file.path)}`
    sendSuccess(res, await schoolService.updateLogo(logoUrl))
  },
}