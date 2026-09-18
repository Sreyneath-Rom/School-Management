import { prisma } from '@/config/database'
import { hashPassword } from '@/utils/password'
import { ApiError } from '@/utils/ApiError'
import type { PaginationQuery } from '@/utils/pagination'
import { toSkipTake, buildPaginationMeta } from '@/utils/pagination'

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
  student: {
    select: {
      studentCode: true, dateOfBirth: true, gender: true, enrolledAt: true,
      class: { select: { id: true, name: true } },
    },
  },
  teacher: {
    select: {
      teacherCode: true, hiredAt: true,
      subjects: { select: { subject: { select: { name: true, department: true } } } },
      classesLed: { select: { name: true } },
    },
  },
}

export const usersService = {
  async list(pagination: PaginationQuery, filters: { search?: string; role?: string; status?: string; classId?: string; department?: string } = {}) {
    const search = filters.search?.trim()
    const where = {
      deletedAt: null,
      ...(filters.status === 'active' ? { isActive: true } : {}),
      ...(filters.status === 'inactive' ? { isActive: false } : {}),
      ...(filters.role ? { role: { name: filters.role === 'mazer' ? 'student' : filters.role } } : {}),
      ...(filters.classId ? { student: { classId: filters.classId } } : {}),
      ...(filters.department ? { teacher: { subjects: { some: { subject: { department: filters.department } } } } } : {}),
      ...(search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { student: { studentCode: { contains: search, mode: 'insensitive' as const } } },
          { teacher: { teacherCode: { contains: search, mode: 'insensitive' as const } } },
        ],
      } : {}),
    }
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(pagination),
      }),
      prisma.user.count({ where }),
    ])
    return { items, meta: buildPaginationMeta(total, pagination) }
  },

  async getById(id: string) {
    const user = await prisma.user.findFirst({ where: { id, deletedAt: null }, select: publicUserSelect })
    if (!user) throw ApiError.notFound('User not found')
    return user
  },

  async create(input: { email: string; password: string; firstName: string; lastName: string; phone?: string; roleId?: string; role?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) throw ApiError.conflict('A user with this email already exists')

    // Without this check, an invalid roleId reaches Prisma as a raw FK
    // constraint violation (P2003) — an unhandled 500 instead of a clean
    // 400. Same reasoning as the permissionIds check in roles.service.
    const role = input.roleId
      ? await prisma.role.findUnique({ where: { id: input.roleId } })
      : await prisma.role.findUnique({ where: { name: input.role === 'mazer' ? 'student' : input.role } })
    if (!role) throw ApiError.badRequest('roleId does not refer to an existing role')

    const passwordHash = await hashPassword(input.password)
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        roleId: role.id,
      },
      select: publicUserSelect,
    })
    return user
  },

  async update(id: string, input: Partial<{ firstName: string; lastName: string; phone: string; roleId: string; role: string; isActive: boolean; status: 'active' | 'inactive' }>) {
    await usersService.getById(id) // 404s if missing/soft-deleted

    const roleId = input.roleId
      ? input.roleId
      : input.role
        ? (await prisma.role.findUnique({ where: { name: input.role === 'mazer' ? 'student' : input.role } }))?.id
        : undefined
    if ((input.roleId || input.role) && !roleId) {
      throw ApiError.badRequest('role does not refer to an existing role')
    }
    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } })
      if (!role) throw ApiError.badRequest('roleId does not refer to an existing role')
    }

    const { role, roleId: _roleId, status, ...profile } = input
    return prisma.user.update({
      where: { id },
      data: { ...profile, ...(roleId ? { roleId } : {}), ...(status ? { isActive: status === 'active' } : {}) },
      select: publicUserSelect,
    })
  },

  /** Soft delete — never hard-remove a user, since grades/attendance/audit logs reference them. */
  async softDelete(id: string) {
    await usersService.getById(id)
    await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
  },

  async resetPassword(id: string, newPassword: string) {
    await usersService.getById(id)
    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id }, data: { passwordHash } })
    // Force re-login everywhere after an admin-triggered reset.
    await prisma.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } })
  },

  async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive') {
    const result = await prisma.user.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { isActive: status === 'active' },
    })
    return { updated: result.count }
  },
}