import { Router } from 'express'
import { subjectsController } from './subjects.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createSubjectSchema,
  listSubjectsQuerySchema,
  updateSubjectSchema,
} from './subjects.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method. Currently no
 * single-segment literals besides `/`, so the ordering below is safe. Add
 * new literals (e.g. `GET /departments`) ABOVE `/:id` when they appear.
 */

router.get(
  '/',
  requirePermission('subjects', 'view'),
  validateQuery(listSubjectsQuerySchema),
  asyncHandler(subjectsController.list)
)

router.get(
  '/:id',
  requirePermission('subjects', 'view'),
  asyncHandler(subjectsController.getById)
)

router.post(
  '/',
  requirePermission('subjects', 'create'),
  validateBody(createSubjectSchema),
  asyncHandler(subjectsController.create)
)

router.patch(
  '/:id',
  requirePermission('subjects', 'edit'),
  validateBody(updateSubjectSchema),
  asyncHandler(subjectsController.update)
)

router.delete(
  '/:id',
  requirePermission('subjects', 'delete'),
  asyncHandler(subjectsController.remove)
)

export default router