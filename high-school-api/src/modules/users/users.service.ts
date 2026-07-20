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
}

export const usersService = {
  async list(pagination: PaginationQuery) {
    const where = { deletedAt: null }
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

  async create(input: { email: string; password: string; firstName: string; lastName: string; phone?: string; roleId: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) throw ApiError.conflict('A user with this email already exists')

    const passwordHash = await hashPassword(input.password)
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        roleId: input.roleId,
      },
      select: publicUserSelect,
    })
    return user
  },

  async update(id: string, input: Partial<{ firstName: string; lastName: string; phone: string; roleId: string; isActive: boolean }>) {
    await usersService.getById(id) // 404s if missing/soft-deleted
    return prisma.user.update({ where: { id }, data: input, select: publicUserSelect })
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
}
