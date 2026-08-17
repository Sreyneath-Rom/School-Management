import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

// `key` is stored as "<module>.<action>" — moduleId/action are derived here
// so the frontend doesn't have to parse it, matching the original route's comment.
function toPermissionDef(permission: { id: string; key: string }) {
  const [moduleId, action] = permission.key.split('.')
  return { id: permission.id, key: permission.key, moduleId, action }
}

export const permissionsService = {
  async list() {
    const permissions = await prisma.permission.findMany({ orderBy: { key: 'asc' } })
    return permissions.map(toPermissionDef)
  },

  async create(key: string) {
    const existing = await prisma.permission.findUnique({ where: { key } })
    if (existing) throw ApiError.conflict(`Permission "${key}" already exists`)

    const permission = await prisma.permission.create({ data: { key } })
    return toPermissionDef(permission)
  },

  async update(permissionId: string, key: string) {
    const permission = await prisma.permission.findUnique({ where: { id: permissionId } })
    if (!permission) throw ApiError.notFound('Permission not found')

    if (key !== permission.key) {
      const existing = await prisma.permission.findUnique({ where: { key } })
      if (existing) throw ApiError.conflict(`Permission "${key}" already exists`)
    }

    const updated = await prisma.permission.update({ where: { id: permissionId }, data: { key } })
    return toPermissionDef(updated)
  },

  /** Deletes a permission. Refuses if it's still assigned to any role — renaming
   *  a key is safe (roles keep pointing at the same id), but deleting one out
   *  from under an assigned role would silently strip that access. */
  async remove(permissionId: string) {
    const permission = await prisma.permission.findUnique({ where: { id: permissionId } })
    if (!permission) throw ApiError.notFound('Permission not found')

    const assignedRoleCount = await prisma.rolePermission.count({ where: { permissionId } })
    if (assignedRoleCount > 0) {
      throw ApiError.conflict(
        `Cannot delete permission "${permission.key}": it is still assigned to ${assignedRoleCount} role(s)`
      )
    }

    await prisma.permission.delete({ where: { id: permissionId } })
  },
}