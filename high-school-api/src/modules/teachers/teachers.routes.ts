import { Router } from 'express'
import { teachersController } from './teachers.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createTeacherSchema, updateTeacherSchema } from './teachers.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('teachers', 'view'), asyncHandler(teachersController.list))
router.get('/:id', requirePermission('teachers', 'view'), asyncHandler(teachersController.getById))
router.post('/', requirePermission('teachers', 'create'), validateBody(createTeacherSchema), asyncHandler(teachersController.create))
router.patch('/:id', requirePermission('teachers', 'edit'), validateBody(updateTeacherSchema), asyncHandler(teachersController.update))
router.delete('/:id', requirePermission('teachers', 'delete'), asyncHandler(teachersController.remove))

export default router