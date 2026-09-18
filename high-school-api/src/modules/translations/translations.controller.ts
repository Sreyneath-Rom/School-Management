import type { Request, Response } from 'express'
import { translationsService } from './translations.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  AutoTranslateBody,
  TranslationCodeParam,
  TranslationKeyParam,
  UpsertTranslationsBody,
} from './translations.validation'

/**
 * Controllers read validated input from `req.validated` — never from
 * `req.body` or `req.params` directly. The `code` and `key` path params
 * are validated by `validateParams` on the corresponding routes.
 */
export const translationsController = {
  async get(req: Request, res: Response) {
    const { code } = req.validated?.params as TranslationCodeParam
    sendSuccess(res, await translationsService.get(code))
  },

  async upsert(req: Request, res: Response) {
    const { code } = req.validated?.params as TranslationCodeParam
    const body = req.validated?.body as UpsertTranslationsBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await translationsService.upsert(code, body.translations))
  },

  async autoTranslate(req: Request, res: Response) {
    const { code } = req.validated?.params as TranslationCodeParam
    const body = req.validated?.body as AutoTranslateBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await translationsService.autoTranslate(code, body.entries))
  },

  async removeKey(req: Request, res: Response) {
    const { code, key } = req.validated?.params as TranslationKeyParam
    await translationsService.removeKey(code, key)
    res.status(204).end()
  },
}