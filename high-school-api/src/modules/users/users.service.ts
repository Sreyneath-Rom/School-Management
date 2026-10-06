import { prisma } from '@/config/database'
import { hashPassword } from '@/utils/password'
import { ApiError } from '@/utils/ApiError'
import { toSkipTake, buildPaginationMeta } from '@/utils/pagination'
import type { Prisma } from '@/generated/prisma/client'
import type {
  BulkStatusBody,
  CreateUserBody,
  ListUsersQuery,
  UpdateUserBody,
} from './users.validation'

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
      studentCode: true,
      dateOfBirth: true,
      gender: true,
      enrolledAt: true,
      class: { select: { id: true, name: true } },
    },
  },
  teacher: {
    select: {
      teacherCode: true,
      hiredAt: true,
      subjects: {
        select: { subject: { select: { name: true, department: true } } },
      },
      classesLed: { select: { name: true } },
    },
  },
} as const

async function resolveRoleId(input: {
  roleId?: string
  role?: string
}): Promise<string> {
  if (input.roleId) {
    const role = await prisma.role.findUnique({
      where: { id: input.roleId },
      select: { id: true },
    })
    if (!role) {
      throw ApiError.badRequest('roleId does not refer to an existing role')
    }
    return role.id
  }

  if (input.role) {
    const role = await prisma.role.findUnique({
      where: { name: input.role },
      select: { id: true },
    })
    if (!role) {
      throw ApiError.badRequest(`No role named "${input.role}" exists`)
    }
    return role.id
  }

  throw ApiError.badRequest('roleId or role is required')
}

export const usersService = {
  async list(query: ListUsersQuery) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(query.status === 'active' ? { isActive: true } : {}),
      ...(query.status === 'inactive' ? { isActive: false } : {}),
      ...(query.role ? { role: { name: query.role } } : {}),
      ...(query.classId ? { student: { classId: query.classId } } : {}),
      ...(query.department
        ? {
            teacher: {
              subjects: { some: { subject: { department: query.department } } },
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
              {
                student: {
                  studentCode: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                teacher: {
                  teacherCode: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    }

    const primarySort = query.sortBy ?? 'createdAt'
    const orderBy = [
      { [primarySort]: query.sortOrder },
      { id: 'asc' as const },
    ]

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy,
        ...toSkipTake(query),
      }),
      prisma.user.count({ where }),
    ])

    return { items, meta: buildPaginationMeta(total, query) }
  },

  async getById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: publicUserSelect,
    })
    if (!user) throw ApiError.notFound('User not found')
    return user
  },

  async create(input: CreateUserBody) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    })
    if (existing) {
      throw ApiError.conflict('A user with this email already exists')
    }

    const roleId = await resolveRoleId(input)
    const passwordHash = await hashPassword(input.password)

    return prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        roleId,
      },
      select: publicUserSelect,
    })
  },

  async update(id: string, changes: UpdateUserBody, actorId: string) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, roleId: true },
    })
    if (!existing) throw ApiError.notFound('User not found')

    const nextRoleId =
      changes.roleId !== undefined || changes.role !== undefined
        ? await resolveRoleId(changes)
        : undefined

    if (
      id === actorId &&
      nextRoleId !== undefined &&
      nextRoleId !== existing.roleId
    ) {
      throw ApiError.badRequest(
        'You cannot change your own role. Ask another admin to do it.'
      )
    }

    const isActive =
      changes.isActive !== undefined
        ? changes.isActive
        : changes.status !== undefined
          ? changes.status === 'active'
          : undefined

    const data: Prisma.UserUpdateInput = {
      ...(changes.firstName !== undefined ? { firstName: changes.firstName } : {}),
      ...(changes.lastName !== undefined ? { lastName: changes.lastName } : {}),
      ...(changes.phone !== undefined ? { phone: changes.phone } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(nextRoleId !== undefined
        ? { role: { connect: { id: nextRoleId } } }
        : {}),
    }

    return prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    })
  },

  async softDelete(id: string, actorId: string) {
    if (id === actorId) {
      throw ApiError.badRequest(
        'You cannot delete your own account. Ask another admin to do it.'
      )
    }

    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, roleId: true },
    })
    if (!user) throw ApiError.notFound('User not found')

    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
      select: { id: true },
    })
    if (adminRole && user.roleId === adminRole.id) {
      const otherAdmins = await prisma.user.count({
        where: {
          roleId: adminRole.id,
          deletedAt: null,
          isActive: true,
          id: { not: id },
        },
      })
      if (otherAdmins === 0) {
        throw ApiError.conflict(
          'Cannot delete the last active admin account. Promote another user first.'
        )
      }
    }

    const now = new Date()

    // Cascade to every profile kind. `updateMany` is a no-op when the
    // where clause matches nothing, so it's safe to run all of them
    // unconditionally.
    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { deletedAt: now, isActive: false },
      }),
      prisma.teacher.updateMany({
        where: { userId: id, deletedAt: null },
        data: { deletedAt: now },
      }),
      prisma.student.updateMany({
        where: { userId: id, deletedAt: null },
        data: { deletedAt: now },
      }),
      prisma.parent.updateMany({
        where: { userId: id, deletedAt: null },
        data: { deletedAt: now },
      }),
    ])
  },

  async resetPassword(id: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    })
    if (!user) throw ApiError.notFound('User not found')

    const passwordHash = await hashPassword(newPassword)

    await prisma.$transaction([
      prisma.user.update({ where: { id }, data: { passwordHash } }),
      prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])
  },

  async bulkUpdateStatus(input: BulkStatusBody, actorId: string) {
    const { ids, status } = input

    if (ids.includes(actorId)) {
      throw ApiError.badRequest(
        'Cannot change the status of your own account in a bulk operation'
      )
    }

    if (status === 'inactive') {
      const adminRole = await prisma.role.findUnique({
        where: { name: 'admin' },
        select: { id: true },
      })
      if (adminRole) {
        const survivingAdmins = await prisma.user.count({
          where: {
            roleId: adminRole.id,
            deletedAt: null,
            isActive: true,
            id: { notIn: ids },
          },
        })
        if (survivingAdmins === 0) {
          throw ApiError.conflict(
            'This batch would deactivate every admin account. At least one active admin must remain.'
          )
        }
      }
    }

    const result = await prisma.user.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { isActive: status === 'active' },
    })
    return { updated: result.count }
  },
}