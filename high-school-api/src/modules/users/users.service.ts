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

/**
 * Fields safe to return from any user endpoint. Deliberately excludes
 * `passwordHash`, `passwordResetTokenHash`, and other credential material.
 * `select` (not `include`) because the defaults would leak the hash.
 */
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

/**
 * Resolves a role by id or name. Returns the id so the caller can write it
 * to `User.roleId` directly.
 *
 * Precedence: `roleId` wins when both are provided. A caller supplying a
 * name that doesn't resolve gets a 400.
 */
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

  /**
   * Creates a User. The route-level schema rejects `role: 'teacher'` and
   * `role: 'student'` because those accounts need a profile row that this
   * method doesn't create. See users.validation.ts for the reasoning.
   */
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

  /**
   * Partial update. `actorId` is the id of the authenticated caller — used
   * to prevent self-demotion.
   */
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

    // Guard: an admin cannot demote themselves.
    if (
      id === actorId &&
      nextRoleId !== undefined &&
      nextRoleId !== existing.roleId
    ) {
      throw ApiError.badRequest(
        'You cannot change your own role. Ask another admin to do it.'
      )
    }

    // Normalize status → isActive. When both are provided the schema
    // already rejected the request, so at most one is set here.
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

  /**
   * Soft delete. Cascades to the user's profile row (Teacher, Student, or
   * Parent) in the same transaction so no orphaned profiles remain.
   *
   * Refuses to delete the caller themselves, and refuses if the target is
   * the last active admin.
   *
   * The profile cascades use `updateMany` with `deletedAt: null` in the
   * where clause — a no-op for the two roles the user doesn't have. No
   * branching on role is needed; all three updates run unconditionally and
   * one of them will affect zero rows.
   */
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

    // Refuse if this is the last active admin.
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

    // Cascade in one transaction. Aligns both sides: after this, the User
    // and (if present) the Teacher/Student/Parent profile all carry the
    // same `deletedAt` timestamp.
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

  /**
   * Admin-triggered password reset. Two writes, both must succeed together:
   * the new hash and the revocation of every refresh token.
   */
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

  /**
   * Bulk enable/disable. Two guards:
   *
   *   1. The caller cannot include themselves in the batch.
   *   2. If deactivating, the batch cannot leave zero active admins.
   */
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