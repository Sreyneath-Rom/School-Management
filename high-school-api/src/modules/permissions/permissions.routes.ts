import { Router } from 'express'
import { permissionsController } from './permissions.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { requireRole } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  createPermissionSchema,
  updatePermissionSchema,
} from './permissions.validation'

const router = Router()
router.use(authenticate)

/**
 * Permissions are part of the roles domain — there's no `permissions.*` key
 * in the catalog itself (chicken-and-egg: you'd need permission to manage
 * permissions). Reads are gated on `roles.view`, writes on `roles.edit`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WARNING: writes are DISCOURAGED and admin-only.
 *
 * The seed (prisma/seed.ts) is the source of truth for which permission keys
 * exist. The API exposes writes because a dev environment sometimes wants to
 * add a key without re-running the seed. In production:
 *
 *   - Creating a key that matches a `requirePermission('X', 'Y')` check in
 *     code grants whoever gets assigned that permission access to that code
 *     path. That's privilege escalation by API call.
 *
 *   - Renaming a key (disallowed by the schema) would silently break every
 *     check that referenced the old name — a permissions change with no
 *     permissions-change event to audit.
 *
 *   - Deleting a key that's still in code but no longer in the seed is fine;
 *     deleting one that IS in code but was unassigned from all roles means
 *     the corresponding `requirePermission` check now denies everyone. That
 *     may be intended, but it's a destructive change with no code-review
 *     trail.
 *
 * If you want to close the write surface entirely, delete the three routes
 * below and the write methods on the controller/service. The catalog then
 * becomes a read-only projection of the seed, which is the safer default.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Read — anyone with role-viewing access can see the catalog (e.g. a
// role-editor UI needs to render permission checkboxes).
router.get(
  '/',
  requirePermission('roles', 'view'),
  asyncHandler(permissionsController.list)
)

// Writes — admin-only, and gated on `roles.edit` for consistency with the
// roles module. The role check is on top of the permission check: an admin
// is the only role the seed grants `roles.edit`, so this is effectively a
// belt-and-braces guard that survives a future permission reshuffle.

router.post(
  '/',
  requireRole('admin'),
  requirePermission('roles', 'edit'),
  validateBody(createPermissionSchema),
  asyncHandler(permissionsController.create)
)

router.patch(
  '/:permissionId',
  requireRole('admin'),
  requirePermission('roles', 'edit'),
  validateBody(updatePermissionSchema),
  asyncHandler(permissionsController.update)
)

router.delete(
  '/:permissionId',
  requireRole('admin'),
  requirePermission('roles', 'edit'),
  asyncHandler(permissionsController.remove)
)

export default router