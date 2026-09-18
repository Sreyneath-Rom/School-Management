import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { comparePassword, hashPassword } from '@/utils/password'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/config/jwt'
import { ApiError } from '@/utils/ApiError'
import { logger } from '@/config/logger'

interface RequestMeta {
  userAgent?: string
  ipAddress?: string
}

/**
 * Refresh tokens are stored hashed with SHA-256. bcrypt would be wrong here:
 * it's intentionally slow to make offline brute-force of low-entropy human
 * passwords expensive, but refresh tokens are 200+ bits of random-looking
 * JWT output — brute force is already infeasible. A fast hash is correct,
 * and a fast hash is what lets us look up by `tokenHash` (unique index)
 * rather than scanning and comparing.
 */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Reads the `exp` claim off a JWT we just signed, so the row's `expiresAt`
 * column matches the token itself. The previous version re-parsed the
 * duration string ("7d", "15m", …) with a hand-rolled function that could
 * drift from what jsonwebtoken actually does with the same string.
 */
function expiresAtFromToken(token: string): Date {
  const decoded = jwt.decode(token) as { exp?: number } | null
  if (decoded?.exp) return new Date(decoded.exp * 1000)

  // Fallback: if for some reason the token has no `exp` (misconfiguration),
  // default to 7 days so the row isn't accidentally immortal.
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

async function issueTokenPair(
  userId: string,
  roleId: string,
  roleName: string,
  meta: RequestMeta
) {
  const accessToken = signAccessToken({ sub: userId, roleId, roleName })
  const refreshToken = signRefreshToken({ sub: userId, jti: crypto.randomUUID() })

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: expiresAtFromToken(refreshToken),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  })

  return { accessToken, refreshToken }
}

export const authService = {
  async login(email: string, password: string, meta: RequestMeta) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    })

    // Same generic error for "user not found", "deleted", "inactive", and
    // "wrong password". A distinct message for any of them would turn login
    // into an account-enumeration oracle.
    const invalid = ApiError.unauthorized('Invalid email or password')
    if (!user || user.deletedAt || !user.isActive) throw invalid

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) throw invalid

    // Fire-and-forget; a slow write shouldn't block the response. If it
    // fails, it's not worth failing the login over.
    prisma.user
      .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
      .catch((err) => logger.warn('Failed to update lastLoginAt', { err, userId: user.id }))

    const tokens = await issueTokenPair(user.id, user.roleId, user.role.name, meta)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        permissionKeys: user.role.permissions.map(
          (p: { permission: { key: string } }) => p.permission.key
        ),
      },
    }
  },

  async refresh(refreshToken: string, meta: RequestMeta) {
    let payload: { sub: string; jti: string }
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token')
    }

    const tokenHash = hashToken(refreshToken)

    return prisma.$transaction(async (tx) => {
      const stored = await tx.refreshToken.findUnique({ where: { tokenHash } })

      if (
        !stored ||
        stored.revokedAt ||
        stored.expiresAt < new Date() ||
        stored.userId !== payload.sub
      ) {
        throw ApiError.unauthorized('Refresh token is no longer valid')
      }

      // Atomic compare-and-swap. `updateMany` with `revokedAt: null` in the
      // where clause means only ONE of two concurrent refresh requests with
      // the same token gets a non-zero count. The other sees count === 0 and
      // fails, closing the race where both would issue new token pairs.
      const revoked = await tx.refreshToken.updateMany({
        where: { id: stored.id, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      if (revoked.count === 0) {
        // Someone else already rotated this token between our read and our
        // write. Treat as invalid rather than retrying — a legitimate client
        // would only hit this if it fired two refresh calls in parallel,
        // which the client shouldn't do.
        throw ApiError.unauthorized('Refresh token is no longer valid')
      }

      const user = await tx.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      })

      if (!user || user.deletedAt || !user.isActive) {
        throw ApiError.unauthorized('Account is inactive or no longer exists')
      }

      const accessToken = signAccessToken({
        sub: user.id,
        roleId: user.roleId,
        roleName: user.role.name,
      })
      const newRefreshToken = signRefreshToken({
        sub: user.id,
        jti: crypto.randomUUID(),
      })

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(newRefreshToken),
          expiresAt: expiresAtFromToken(newRefreshToken),
          userAgent: meta.userAgent,
          ipAddress: meta.ipAddress,
        },
      })

      return { accessToken, refreshToken: newRefreshToken }
    })
  },

  async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken)
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },

  async logoutAll(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true, deletedAt: true },
    })
    if (!user || user.deletedAt) throw ApiError.notFound('User not found')

    const isValid = await comparePassword(currentPassword, user.passwordHash)
    if (!isValid) throw ApiError.badRequest('Current password is incorrect')

    const passwordHash = await hashPassword(newPassword)

    // Both operations in one transaction: a partial success would leave the
    // user either logged in with an old password hash, or locked out with
    // no way to refresh.
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    // Always resolve without error. Never log the raw email at info level —
    // it's PII and would leak into combined.log on every request.
    if (!user) return

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = hashToken(resetToken)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // NOTE: requires `passwordResetTokenHash` and `passwordResetExpiresAt`
    // nullable columns on User. When those exist, replace this log statement
    // with:
    //
    //   await prisma.user.update({
    //     where: { id: user.id },
    //     data: { passwordResetTokenHash: resetTokenHash, passwordResetExpiresAt: expiresAt },
    //   })
    //   await emailService.sendPasswordReset(user.email, resetToken)
    //
    // The hash is what's persisted; the raw `resetToken` goes in the email
    // link only. That way a DB leak doesn't grant password-reset ability.
    logger.info('Password reset token generated', { userId: user.id, expiresAt })
  },

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashToken(token)

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!user) {
      throw ApiError.badRequest('Reset link is invalid or has expired')
    }

    const passwordHash = await hashPassword(newPassword)

    // Same transaction shape as changePassword: update hash, clear the reset
    // fields, revoke every session.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ])
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    })

    if (!user || user.deletedAt || !user.isActive) {
      throw ApiError.unauthorized('Account is inactive or no longer exists')
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      permissionKeys: user.role.permissions.map(
        (p: { permission: { key: string } }) => p.permission.key
      ),
    }
  },
}