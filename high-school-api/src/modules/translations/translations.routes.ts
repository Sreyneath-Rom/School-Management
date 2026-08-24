import { Router } from 'express'
import { translationsController } from './translations.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { upsertTranslationsSchema, autoTranslateSchema } from './translations.validation'

const router = Router()
router.use(authenticate)

router.get('/:code', requirePermission('translations', 'view'), asyncHandler(translationsController.get))
router.patch('/:code', requirePermission('translations', 'edit'), validateBody(upsertTranslationsSchema), asyncHandler(translationsController.upsert))
router.post('/:code/auto-translate', requirePermission('translations', 'edit'), validateBody(autoTranslateSchema), asyncHandler(translationsController.autoTranslate))
router.delete('/:code/:key', requirePermission('translations', 'edit'), asyncHandler(translationsController.removeKey))

export default router