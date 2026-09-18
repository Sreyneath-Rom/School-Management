import { Router } from 'express'
import { studentsController } from './students.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody, validateQuery } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createStudentSchema,
  enrollStudentSchema,
  listStudentsQuerySchema,
  updateStudentSchema,
} from './students.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER — literal paths before `/:id`, per method.
 *
 * `/enroll` is a single-segment literal and MUST be registered before
 * `/:id`, or a POST to `/enroll` is routed to `update` with
 * `params.id = "enroll"`.
 */

/**
 * List — staff and parents see the list; the controller doesn't scope it
 * because a parent's list should be filtered by their link, which is a
 * concern for the parent module. Until that exists, the permission check
 * is the only gate. When the parent module lands, add scoping here.
 */
router.get(
  '/',
  requirePermission('students', 'view'),
  validateQuery(listStudentsQuerySchema),
  asyncHandler(studentsController.list)
)

/**
 * Enroll — creates User + Student in one transaction.
 *
 * Registered above `/:id`, so the two-segment `POST /` handler and this
 * single-segment literal don't collide.
 */
router.post(
  '/enroll',
  requirePermission('students', 'create'),
  validateBody(enrollStudentSchema),
  asyncHandler(studentsController.enroll)
)

router.post(
  '/',
  requirePermission('students', 'create'),
  validateBody(createStudentSchema),
  asyncHandler(studentsController.create)
)

/**
 * Detail — ownership enforced in the controller. A student with
 * `students.view` (uncommon but possible if the seed changes) is scoped to
 * their own row.
 */
router.get(
  '/:id',
  requirePermission('students', 'view'),
  asyncHandler(studentsController.getById)
)

router.get(
  '/:id/profile',
  requirePermission('students', 'view'),
  asyncHandler(studentsController.getProfile)
)

router.patch(
  '/:id',
  requirePermission('students', 'edit'),
  validateBody(updateStudentSchema),
  asyncHandler(studentsController.update)
)

router.delete(
  '/:id',
  requirePermission('students', 'delete'),
  asyncHandler(studentsController.remove)
)

export default router