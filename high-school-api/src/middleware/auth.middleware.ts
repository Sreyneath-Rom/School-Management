import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '@/config/jwt'
import { ApiError } from '@/utils/ApiError'
import { prisma } from '@/config/database'
import { asyncHandler } from '@/utils/asyncHandler'

/**
 * Verifies the JWT, then loads the user's current permission keys fresh from
 * the DB on every request. This costs one indexed query per request but
 * means a permission change takes effect immediately, rather than only
 * after the user's token expires.
 */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or malformed Authorization header')
  }

  const token = header.slice('Bearer '.length)
  const payload = verifyAccessToken(token) // throws JsonWebTokenError / TokenExpiredError on failure

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
    throw ApiError.unauthorized('Account is inactive or no longer exists')
  }

  req.user = {
    sub: user.id,
    roleId: user.role.id,
    roleName: user.role.name,
    permissionKeys: user.role.permissions.map((rp: { permission: { key: string } }) => rp.permission.key),
  }

  next()
})
