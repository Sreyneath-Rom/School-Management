import { Router } from 'express'
import { languagesController } from './languages.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createLanguageSchema, updateLanguageSchema } from './languages.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('translations', 'view'), asyncHandler(languagesController.list))
router.post('/', requirePermission('translations', 'create'), validateBody(createLanguageSchema), asyncHandler(languagesController.create))
router.patch('/:code', requirePermission('translations', 'edit'), validateBody(updateLanguageSchema), asyncHandler(languagesController.update))
router.delete('/:code', requirePermission('translations', 'delete'), asyncHandler(languagesController.remove))

export default router