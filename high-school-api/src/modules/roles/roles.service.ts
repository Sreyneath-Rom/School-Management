import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

// Prisma's Role model stores the display name as `description`, not
// `label` — `label` is only the shape we expose to the frontend. Accepting
// `description` here (and renaming it to `label` in the returned object)
// keeps this function directly assignable from whatever Prisma returns,
// instead of needing a manual re-shape at every call site.
function toRoleDef(role: {
  id: string
  name: string
  description: string | null
  permissions: { permission: { id: string } }[]
}) {
  return {
    id: role.id,
    name: role.name,
    label: role.description ?? role.name,
    initial: role.name.slice(0, 2).toUpperCase(),
    permissionIds: role.permissions.map((rp) => rp.permission.id),
  }
}

const roleInclude = { permissions: { include: { permission: true } } }

export const rolesService = {
  async list() {
    const roles = await prisma.role.findMany({ include: roleInclude, orderBy: { name: 'asc' } })
    return roles.map(toRoleDef)
  },

  async create(name: string, label: string) {
    const existing = await prisma.role.findUnique({ where: { name } })
    if (existing) throw ApiError.conflict(`Role "${name}" already exists`)

    const role = await prisma.role.create({
      data: { name, description: label },
      include: roleInclude,
    })
    return toRoleDef(role)
  },

  /** Partial update of a role's name and/or label. */
  async update(roleId: string, changes: { name?: string; label?: string }) {
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) throw ApiError.notFound('Role not found')

    if (changes.name && changes.name !== role.name) {
      const existing = await prisma.role.findUnique({ where: { name: changes.name } })
      if (existing) throw ApiError.conflict(`Role "${changes.name}" already exists`)
    }

    const updated = await prisma.role.update({
      where: { id: roleId },
      // `label` is stored as `description` on the model, matching `create` above.
      data: {
        ...(changes.name !== undefined ? { name: changes.name } : {}),
        ...(changes.label !== undefined ? { description: changes.label } : {}),
      },
      include: roleInclude,
    })
    return toRoleDef(updated)
  },

  /** Deletes a role. Refuses if the role still has users assigned to it. */
  async remove(roleId: string) {
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) throw ApiError.notFound('Role not found')

    // Adjust this if your User model names the relation/field differently
    // (e.g. `roleId` vs a join table) — the intent is just "don't delete a
    // role that's actively assigned to someone."
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

  /** Full replace of a role's permission set (matches the frontend's save-the-whole-matrix flow). */
  async replacePermissions(roleId: string, permissionIds: string[]) {
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) throw ApiError.notFound('Role not found')

    if (permissionIds.length > 0) {
      const validCount = await prisma.permission.count({ where: { id: { in: permissionIds } } })
      if (validCount !== permissionIds.length) {
        throw ApiError.badRequest('One or more permissionIds are invalid')
      }
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      }),
    ])

    const updated = await prisma.role.findUniqueOrThrow({ where: { id: roleId }, include: roleInclude })
    return toRoleDef(updated)
  },
}