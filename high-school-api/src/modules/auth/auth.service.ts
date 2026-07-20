import crypto from 'crypto'
import { prisma } from '@/config/database'
import { comparePassword, hashPassword } from '@/utils/password'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/config/jwt'
import { ApiError } from '@/utils/ApiError'
import { logger } from '@/config/logger'

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function msFromExpiryString(expiresIn: string): number {
  // Supports simple "7d" / "15m" / "3600" style values from env config.
  const match = /^(\d+)([smhd])?$/.exec(expiresIn)
  if (!match) return 7 * 24 * 60 * 60 * 1000
  const value = Number(match[1])
  const unit = match[2] ?? 's'
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 1000
  return value * unitMs
}

async function issueTokenPair(userId: string, roleId: string, roleName: string, meta: { userAgent?: string; ipAddress?: string }) {
  const accessToken = signAccessToken({ sub: userId, roleId, roleName })
  const refreshToken = signRefreshToken({ sub: userId })

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + msFromExpiryString(process.env.JWT_REFRESH_EXPIRES_IN ?? '7d')),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  })

  return { accessToken, refreshToken }
}

export const authService = {
  async login(email: string, password: string, meta: { userAgent?: string; ipAddress?: string }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })

    // Same generic error whether the email doesn't exist or the password is
    // wrong, so login can't be used to enumerate valid accounts.
    if (!user || user.deletedAt || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const tokens = await issueTokenPair(user.id, user.roleId, user.role.name, meta)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    }
  },

  async refresh(refreshToken: string, meta: { userAgent?: string; ipAddress?: string }) {
    let payload: { sub: string }
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token')
    }

    const tokenHash = hashToken(refreshToken)
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } })

    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || stored.userId !== payload.sub) {
      throw ApiError.unauthorized('Refresh token is no longer valid')
    }

    // Rotate: revoke the used token and issue a new pair. Limits the damage
    // if a refresh token is ever stolen and replayed.
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } })

    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { role: true } })
    if (!user || user.deletedAt || !user.isActive) {
      throw ApiError.unauthorized('Account is inactive or no longer exists')
    }

    return issueTokenPair(user.id, user.roleId, user.role.name, meta)
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

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw ApiError.notFound('User not found')

    const isValid = await comparePassword(currentPassword, user.passwordHash)
    if (!isValid) throw ApiError.badRequest('Current password is incorrect')

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })

    // Changing password revokes all existing sessions.
    await authService.logoutAll(userId)
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    // Always resolve without error — don't reveal whether the email exists.
    if (!user) {
      logger.info('Password reset requested for unknown email', { email })
      return
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = hashToken(resetToken)

    // NOTE: requires a `passwordResetTokenHash` / `passwordResetExpiresAt`
    // column on User (not in the base schema) — add via migration, then
    // send `resetToken` (not the hash) to the user via email here.
    logger.info('Password reset token generated', { userId: user.id, resetTokenHash })
  },

  async resetPassword(_token: string, _newPassword: string) {
    // See note in forgotPassword — implement once the reset-token columns exist.
    throw ApiError.badRequest('Password reset is not yet configured on this server')
  },
}
