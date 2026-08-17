import { Router } from 'express'
import { subjectsController } from './subjects.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createSubjectSchema, updateSubjectSchema } from './subjects.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('subjects', 'view'), asyncHandler(subjectsController.list))
router.get('/:id', requirePermission('subjects', 'view'), asyncHandler(subjectsController.getById))
router.post('/', requirePermission('subjects', 'create'), validateBody(createSubjectSchema), asyncHandler(subjectsController.create))
router.patch('/:id', requirePermission('subjects', 'edit'), validateBody(updateSubjectSchema), asyncHandler(subjectsController.update))
router.delete('/:id', requirePermission('subjects', 'delete'), asyncHandler(subjectsController.remove))

export default router