import type { Request, Response } from 'express'
import { translationsService } from './translations.service'
import { sendSuccess } from '@/utils/apiResponse'

export const translationsController = {
  async get(req: Request, res: Response) {
    sendSuccess(res, await translationsService.get(req.params.code))
  },

  async upsert(req: Request, res: Response) {
    sendSuccess(res, await translationsService.upsert(req.params.code, req.body.translations))
  },

  async autoTranslate(req: Request, res: Response) {
    sendSuccess(res, await translationsService.autoTranslate(req.params.code, req.body.entries))
  },

  async removeKey(req: Request, res: Response) {
    await translationsService.removeKey(req.params.code, req.params.key)
    res.status(204).send()
  },
}