import { Router } from 'express'
import { translationsController } from './translations.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateParams } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  autoTranslateSchema,
  translationCodeParamSchema,
  translationKeyParamSchema,
  upsertTranslationsSchema,
} from './translations.validation'

const router = Router()
router.use(authenticate)

/**
 * Every route is scoped to a specific language code, so there is no
 * top-level GET / — the frontend fetches each language by code as needed
 * and the whole catalogue isn't useful in one response.
 *
 * ROUTE ORDER — literal paths before param paths, per method:
 *   - `/:code/auto-translate` (POST) has two segments; a hypothetical
 *     `POST /foo` (single literal) would need to sit above it. No such
 *     route exists today.
 *   - `/:code/:key` (DELETE) has two segments; both params, no literal
 *     shadowing risk.
 *   - `/:code` (GET/PATCH) has one segment; a future `GET /stats` would
 *     need to be registered ABOVE it.
 */

router.get(
  '/:code',
  requirePermission('translations', 'view'),
  validateParams(translationCodeParamSchema),
  asyncHandler(translationsController.get)
)

router.patch(
  '/:code',
  requirePermission('translations', 'edit'),
  validateParams(translationCodeParamSchema),
  validateBody(upsertTranslationsSchema),
  asyncHandler(translationsController.upsert)
)

router.post(
  '/:code/auto-translate',
  requirePermission('translations', 'edit'),
  validateParams(translationCodeParamSchema),
  validateBody(autoTranslateSchema),
  asyncHandler(translationsController.autoTranslate)
)

router.delete(
  '/:code/:key',
  requirePermission('translations', 'edit'),
  validateParams(translationKeyParamSchema),
  asyncHandler(translationsController.removeKey)
)

export default router