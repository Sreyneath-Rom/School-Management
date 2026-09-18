import { Router } from 'express'
import { termsController } from './terms.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createTermSchema, updateTermSchema } from './terms.validation'

const router = Router()
router.use(authenticate)
router.get('/', requirePermission('terms', 'view'), asyncHandler(termsController.list))
router.get('/:id', requirePermission('terms', 'view'), asyncHandler(termsController.getById))
router.post('/', requirePermission('terms', 'create'), validateBody(createTermSchema), asyncHandler(termsController.create))
router.patch('/:id', requirePermission('terms', 'edit'), validateBody(updateTermSchema), asyncHandler(termsController.update))
router.post('/:id/active', requirePermission('terms', 'edit'), asyncHandler(termsController.setActive))
router.delete('/:id', requirePermission('terms', 'delete'), asyncHandler(termsController.remove))
export default router
