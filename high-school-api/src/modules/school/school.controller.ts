import type { Request, Response } from 'express'
import path from 'node:path'
import { schoolService } from './school.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { env } from '@/config/env'
import type {
  CreateSchoolBody,
  UpdateSchoolBody,
} from './school.validation'

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
    // 204 for consistency with every other module's DELETE.
    res.status(204).end()
  },

  /**
   * The upload middleware writes the file to `${env.UPLOAD_PATH}/logos/` and
   * hands the path to us via `req.file.path`. The URL we store is
   * `/uploads/logos/<basename>` — the static mount in app.ts serves that
   * prefix from the same directory.
   *
   * `path.basename` strips any directory components the middleware may have
   * added, so a compromised or unexpected `req.file.path` can't produce a
   * URL that escapes the mount.
   */
  async uploadLogo(req: Request, res: Response) {
    if (!req.file) throw ApiError.badRequest('No logo file provided')

    const filename = path.basename(req.file.path)
    const logoUrl = `/uploads/logos/${filename}`

    sendSuccess(res, await schoolService.updateLogo(logoUrl))
  },

  async removeLogo(_req: Request, res: Response) {
    sendSuccess(res, await schoolService.removeLogo())
  },
}