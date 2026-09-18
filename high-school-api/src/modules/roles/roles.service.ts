import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import {
  SYSTEM_ROLE_NAMES,
  type CreateRoleBody,
  type UpdateRoleBody,
} from './roles.validation'

/**
 * Permissions that, if stripped from every role with users, would leave the
 * system unrecoverable via the API:
 *
 *   - `roles.edit`  → required to re-grant any permission to any role
 *   - `users.edit`  → required to assign a role to a user
 *
 * If both are absent from every role that has a user, there is no API path
 * back to a working admin. Removing them requires direct DB access.
 *
 * The guard in `replacePermissions` refuses any update that would leave
 * `roles.edit` absent from every user-bearing role. That's the minimum for
 * recovery — from `roles.edit` alone, an admin can restore every other
 * permission.
 */
const RECOVERY_PERMISSION_KEY = 'roles.edit'

function isSystemRole(name: string): boolean {
  return (SYSTEM_ROLE_NAMES as readonly string[]).includes(name)
}

const roleInclude = {
  permissions: { include: { permission: { select: { id: true, key: true } } } },
  _count: { select: { users: true } },
} as const

interface RoleRow {
  id: string
  name: string
  description: string | null
  permissions: { permission: { id: string; key: string } }[]
  _count?: { users: number }
}

/**
 * Shapes a Prisma Role row for the API.
 *
 * Prisma stores the display name in `description`; the frontend calls it
 * `label`. The mapping lives here so every response uses the same vocabulary.
 * `isSystem` is derived from the name, not stored — a role can't be
 * accidentally marked as built-in or vice versa.
 */
function toRoleDef(role: RoleRow) {
  return {
    id: role.id,
    name: role.name,
    label: role.description ?? role.name,
    initial: role.name.slice(0, 2).toUpperCase(),
    isSystem: isSystemRole(role.name),
    permissionIds: role.permissions.map((rp) => rp.permission.id),
    permissionKeys: role.permissions.map((rp) => rp.permission.key),
    userCount: role._count?.users ?? 0,
  }
}

export const rolesService = {
  async list() {
    const roles = await prisma.role.findMany({
      include: roleInclude,
      orderBy: { name: 'asc' },
    })
    return roles.map(toRoleDef)
  },

  async create(input: CreateRoleBody) {
    const existing = await prisma.role.findUnique({
      where: { name: input.name },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict(`Role "${input.name}" already exists`)
    }

    const role = await prisma.role.create({
      data: { name: input.name, description: input.label },
      include: roleInclude,
    })
    return toRoleDef(role)
  },

  async update(roleId: string, changes: UpdateRoleBody) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: { id: true, name: true },
    })
    if (!role) throw ApiError.notFound('Role not found')

    if (isSystemRole(role.name) && changes.name !== undefined && changes.name !== role.name) {
      throw ApiError.forbidden(
        `The name of the built-in role "${role.name}" cannot be changed — code paths depend on it`
      )
    }

    if (changes.name && changes.name !== role.name) {
      const collision = await prisma.role.findUnique({
        where: { name: changes.name },
        select: { id: true },
      })
      if (collision) {
        throw ApiError.conflict(`Role "${changes.name}" already exists`)
      }
    }

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...(changes.name !== undefined ? { name: changes.name } : {}),
        ...(changes.label !== undefined ? { description: changes.label } : {}),
      },
      include: roleInclude,
    })
    return toRoleDef(updated)
  },

  async remove(roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: { id: true, name: true },
    })
    if (!role) throw ApiError.notFound('Role not found')

    if (isSystemRole(role.name)) {
      throw ApiError.forbidden(`The built-in role "${role.name}" cannot be deleted`)
    }

    const assignedUserCount = await prisma.user.count({ where: { roleId } })
    if (assignedUserCount > 0) {
      throw ApiError.conflict(
        `Cannot delete role "${role.name}": ${assignedUserCount} user(s) are still assigned to it`
      )
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.role.delete({ where: { id: roleId } }),
    ])
  },

  /**
   * Full replace of a role's permission set. Matches the frontend's
   * "save the whole matrix" flow — the client sends the complete desired set,
   * the service computes the diff implicitly.
   *
   * Recovery guard: after applying the change, at least one role with users
   * must still hold `roles.edit`. Without it, no API caller can restore
   * permissions to any role, and the system requires direct DB access to
   * recover. See `RECOVERY_PERMISSION_KEY` above.
   *
   * All checks and writes run inside a single transaction so a concurrent
   * call can't observe an intermediate state. Without this, two admins
   * simultaneously stripping permissions from different roles could each
   * pass the recovery check individually but leave the system without any
   * role holding `roles.edit`.
   */
  async replacePermissions(roleId: string, permissionIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { id: roleId },
        select: { id: true, name: true },
      })
      if (!role) throw ApiError.notFound('Role not found')

      // Validate every permission id in one query. If any is missing, the
      // caller sent a stale or typo'd id.
      if (permissionIds.length > 0) {
        const validCount = await tx.permission.count({
          where: { id: { in: permissionIds } },
        })
        if (validCount !== permissionIds.length) {
          throw ApiError.badRequest(
            'One or more permissionIds do not refer to existing permissions'
          )
        }
      }

      // Apply the change inside the transaction.
      await tx.rolePermission.deleteMany({ where: { roleId } })
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
        })
      }

      // Post-condition check: at least one user-bearing role holds
      // `roles.edit`. If not, roll back — the transaction throws, and the
      // earlier deletes/creates are discarded.
      const rolesWithRecoveryPermission = await tx.role.count({
        where: {
          permissions: {
            some: { permission: { key: RECOVERY_PERMISSION_KEY } },
          },
          users: { some: {} },
        },
      })
      if (rolesWithRecoveryPermission === 0) {
        throw ApiError.conflict(
          `This change would remove "${RECOVERY_PERMISSION_KEY}" from every role with assigned users, ` +
            'leaving no way to restore permissions through the API. ' +
            'Grant it to at least one other role first.'
        )
      }

      const updated = await tx.role.findUniqueOrThrow({
        where: { id: roleId },
        include: roleInclude,
      })
      return toRoleDef(updated)
    })
  },
}