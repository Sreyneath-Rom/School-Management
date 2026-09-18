import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '@/config/jwt'
import { ApiError } from '@/utils/ApiError'
import { prisma } from '@/config/database'
import { asyncHandler } from '@/utils/asyncHandler'
import { logger } from '@/config/logger'

/**
 * Verifies the JWT, then loads the user's current permission keys fresh from
 * the DB on every request. This costs one indexed query per request but
 * means a permission change takes effect immediately, rather than only
 * after the user's token expires.
 *
 * Wrapped in asyncHandler so a thrown ApiError reaches the central error
 * handler instead of becoming an unhandled rejection.
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header')
    }

    const token = header.slice('Bearer '.length).trim()
    if (!token) throw ApiError.unauthorized('Missing authentication token')

    // Throws JsonWebTokenError / TokenExpiredError on failure — both are
    // mapped to 401 in error.middleware.ts.
    const payload = verifyAccessToken(token)

    // Defensive: reject a token without a subject before it reaches Prisma.
    // The current signAccessToken always includes `sub`, but a hand-crafted
    // or legacy token might not.
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
      // Debug-level: a valid token for a deactivated user is a routine
      // operational event (session outlived the account), not a security
      // incident worth a full error log.
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