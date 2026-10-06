import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '@/config/jwt'
import { ApiError } from '@/utils/ApiError'
import { prisma } from '@/config/database'
import { asyncHandler } from '@/utils/asyncHandler'
import { logger } from '@/config/logger'

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header')
    }

    const token = header.slice('Bearer '.length).trim()
    if (!token) throw ApiError.unauthorized('Missing authentication token')

    const payload = verifyAccessToken(token)

    if (!payload.sub) {
      throw ApiError.unauthorized('Invalid authentication token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        isActive: true,
        deletedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: { select: { permission: { select: { key: true } } } },
          },
        },
      },
    })

    if (!user || user.deletedAt || !user.isActive) {
      logger.debug('Rejecting token for inactive/deleted user', {
        requestId: req.id,
        userId: payload.sub,
        exists: !!user,
        isActive: user?.isActive,
        deleted: !!user?.deletedAt,
      })
      throw ApiError.unauthorized('Account is inactive or no longer exists')
    }

    req.user = {
      sub: user.id,
      roleId: user.role.id,
      roleName: user.role.name,
      permissionKeys: user.role.permissions.map(
        (rp: { permission: { key: string } }) => rp.permission.key
      ),
    }

    next()
  }
)