import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

function toRoleDef(role: {
  id: string
  name: string
  label: string | null
  permissions: { permission: { id: string } }[]
}) {
  return {
    id: role.id,
    name: role.name,
    label: role.label ?? role.name,
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
