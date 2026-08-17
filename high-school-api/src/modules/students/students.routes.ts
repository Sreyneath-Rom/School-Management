import { Router } from 'express'
import { studentsController } from './students.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { createStudentSchema, updateStudentSchema } from './students.validation'

const router = Router()
router.use(authenticate)

router.get('/', requirePermission('students', 'view'), asyncHandler(studentsController.list))
router.get('/:id', requirePermission('students', 'view'), asyncHandler(studentsController.getById))
router.post('/', requirePermission('students', 'create'), validateBody(createStudentSchema), asyncHandler(studentsController.create))
router.patch('/:id', requirePermission('students', 'edit'), validateBody(updateStudentSchema), asyncHandler(studentsController.update))
router.delete('/:id', requirePermission('students', 'delete'), asyncHandler(studentsController.remove))

export default router