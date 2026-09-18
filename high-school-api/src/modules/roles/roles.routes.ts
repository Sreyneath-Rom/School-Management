import { Router } from 'express'
import { rolesController } from './roles.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission, requireRole } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createRoleSchema,
  updateRolePermissionsSchema,
  updateRoleSchema,
} from './roles.validation'

const router = Router()
router.use(authenticate)

/**
 * ROUTE ORDER: `/:roleId` before `/:roleId/permissions` is fine because the
 * latter has two segments. But adding a single-segment literal such as
 * `/system` in the future requires registering it ABOVE `/:roleId`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY `requireRole('admin')` ON EVERY WRITE
 *
 * The `roles.*` permissions are themselves held by whoever the admin grants
 * them to. If write access were gated on `roles.edit` alone, any role editor
 * could:
 *
 *   1. Add any permission (including `users.edit`) to their own role.
 *   2. Then assign themselves a higher role, or strip the admin role's
 *      permissions to lock admins out.
 *
 * That's a straight privilege-escalation path. Restricting writes to admin
 * (via role name, not permission) closes it. The permission checks remain
 * as a second gate — defense in depth if the seed's grants change.
 *
 * Reads stay on `roles.view` because a role-editor UI needs the list to
 * render, and reads don't change who can do what.
 * ─────────────────────────────────────────────────────────────────────────
 */

router.get(
  '/',
  requirePermission('roles', 'view'),
  asyncHandler(rolesController.list)
)

router.post(
  '/',
  requireRole('admin'),
  requirePermission('roles', 'create'),
  validateBody(createRoleSchema),
  asyncHandler(rolesController.create)
)

router.patch(
  '/:roleId',
  requireRole('admin'),
  requirePermission('roles', 'edit'),
  validateBody(updateRoleSchema),
  asyncHandler(rolesController.update)
)

router.delete(
  '/:roleId',
  requireRole('admin'),
  requirePermission('roles', 'delete'),
  asyncHandler(rolesController.remove)
)

router.patch(
  '/:roleId/permissions',
  requireRole('admin'),
  requirePermission('roles', 'edit'),
  validateBody(updateRolePermissionsSchema),
  asyncHandler(rolesController.updatePermissions)
)

export default router