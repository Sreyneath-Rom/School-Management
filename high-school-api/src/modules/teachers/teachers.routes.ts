import { Router } from 'express'
import { teachersController } from './teachers.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createTeacherSchema,
  listTeachersQuerySchema,
  updateTeacherSchema,
} from './teachers.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('teachers', 'view'),
  validateQuery(listTeachersQuerySchema),
  asyncHandler(teachersController.list)
)

// Must be ABOVE `/:id` — otherwise `/me` is routed to getById with id="me".
router.get(
  '/me',
  asyncHandler(teachersController.me)
)

router.get(
  '/:id',
  requirePermission('teachers', 'view'),
  asyncHandler(teachersController.getById)
)

router.post(
  '/',
  requirePermission('teachers', 'create'),
  validateBody(createTeacherSchema),
  asyncHandler(teachersController.create)
)

router.patch(
  '/:id',
  requirePermission('teachers', 'edit'),
  validateBody(updateTeacherSchema),
  asyncHandler(teachersController.update)
)

router.delete(
  '/:id',
  requirePermission('teachers', 'delete'),
  asyncHandler(teachersController.remove)
)

export default router