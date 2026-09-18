import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreatePermissionBody,
  UpdatePermissionBody,
} from './permissions.validation'

interface PermissionRow {
  id: string
  key: string
  description: string | null
}

/**
 * Permission keys are stored as `<module>.<action>`. The service derives
 * `moduleId` and `action` for the response so a client (e.g. a role-editing
 * UI) doesn't have to parse the key itself.
 *
 * If a row somehow has a key without a dot — a legacy import, a direct DB
 * write, or a seed update that forgot the format — the split produces
 * `undefined` for `action`, and JSON.stringify drops the field. Returning
 * `null` explicitly is more honest: the client sees the malformed row and
 * can flag it, instead of a payload shape that varies by row.
 */
function toPermissionDef(permission: PermissionRow) {
  const dotIndex = permission.key.indexOf('.')
  const moduleId = dotIndex === -1 ? permission.key : permission.key.slice(0, dotIndex)
  const action = dotIndex === -1 ? null : permission.key.slice(dotIndex + 1)

  return {
    id: permission.id,
    key: permission.key,
    moduleId,
    action,
    description: permission.description,
  }
}

export const permissionsService = {
  /**
   * Returns the full permission catalog. There are roughly 100 entries after
   * the seed, so pagination isn't warranted — a role editor needs to see the
   * whole list to render its checkboxes.
   */
  async list() {
    const permissions = await prisma.permission.findMany({
      orderBy: { key: 'asc' },
    })
    return permissions.map(toPermissionDef)
  },

  /**
   * Creates a permission.
   *
   * WARNING — see the route file. Creating a permission that matches a
   * `requirePermission('X', 'Y')` check in code grants whoever gets assigned
   * that permission access to that code path. Since the seed is the source
   * of truth for what keys exist, creating new ones over HTTP should be a
   * rare, deliberate operation.
   */
  async create(input: CreatePermissionBody) {
    const existing = await prisma.permission.findUnique({
      where: { key: input.key },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict(`Permission "${input.key}" already exists`)
    }

    const permission = await prisma.permission.create({
      data: {
        key: input.key,
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
      },
    })
    return toPermissionDef(permission)
  },

  /**
   * Only `description` is mutable. See `updatePermissionSchema` for why the
   * key is immutable.
   */
  async update(permissionId: string, changes: UpdatePermissionBody) {
    const existing = await prisma.permission.findUnique({
      where: { id: permissionId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Permission not found')

    const updated = await prisma.permission.update({
      where: { id: permissionId },
      data: changes,
    })
    return toPermissionDef(updated)
  },

  /**
   * Deletes a permission. Refuses if any role still references it.
   *
   * The assignment check is a genuine guard, not a formality — silently
   * stripping a permission from a role (which is what happens if the FK has
   * `onDelete: Cascade`) would revoke access for every user with that role,
   * with no record of who made the change. A 409 forcing the operator to
   * unassign first is the right default.
   */
  async remove(permissionId: string) {
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
      select: { id: true, key: true },
    })
    if (!permission) throw ApiError.notFound('Permission not found')

    const assignedRoleCount = await prisma.rolePermission.count({
      where: { permissionId },
    })
    if (assignedRoleCount > 0) {
      throw ApiError.conflict(
        `Cannot delete permission "${permission.key}": it is still assigned to ${assignedRoleCount} role(s). Unassign it first.`
      )
    }

    await prisma.permission.delete({ where: { id: permissionId } })
  },
}