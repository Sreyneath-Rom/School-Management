import type { Request, Response } from 'express'
import path from 'node:path'
import fs from 'node:fs/promises'
import { schoolService } from './school.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { env } from '@/config/env'
import type { CreateSchoolBody, UpdateSchoolBody } from './school.validation'

export const schoolController = {
  async get(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.get())
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateSchoolBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendCreated(res, await schoolService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateSchoolBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await schoolService.update(body))
  },

  async upsert(req: Request, res: Response) {
    const body = req.validated?.body as UpdateSchoolBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await schoolService.upsert(body))
  },

  async remove(_req: Request, res: Response) {
    await schoolService.remove()
    res.status(204).end()
  },

  async uploadLogo(req: Request, res: Response) {
    if (!req.file) throw ApiError.badRequest('No logo file provided')

    const filename = path.basename(req.file.path)
    const logoUrl = `/uploads/logos/${filename}`

    try {
      const previous = await schoolService.get()
      if (previous.logoUrl?.startsWith('/uploads/logos/')) {
        const prevPath = path.resolve(
          env.UPLOAD_PATH,
          'logos',
          path.basename(previous.logoUrl)
        )
        await fs.unlink(prevPath).catch(() => undefined)
      }
    } catch {
      // school not configured yet, or previous logo was an external URL
    }

    sendSuccess(res, await schoolService.updateLogo(logoUrl))
  },

  async removeLogo(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.removeLogo())
  },
}