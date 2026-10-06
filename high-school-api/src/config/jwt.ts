import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from './env'
import { ApiError } from '@/utils/ApiError'

export interface AccessTokenPayload {
  sub: string
  roleId: string
  roleName: string
}

export interface RefreshTokenPayload {
  sub: string
  jti: string
}

const commonSignOptions = {
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
} satisfies SignOptions

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    ...commonSignOptions,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  })
  if (!isAccessTokenPayload(decoded)) {
    throw ApiError.unauthorized('Invalid authentication token')
  }
  return decoded
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    ...commonSignOptions,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions)
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  })
  if (!isRefreshTokenPayload(decoded)) {
    throw ApiError.unauthorized('Invalid refresh token')
  }
  return decoded
}

function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.sub === 'string' &&
    typeof v.roleId === 'string' &&
    typeof v.roleName === 'string'
  )
}

function isRefreshTokenPayload(value: unknown): value is RefreshTokenPayload {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.sub === 'string' && typeof v.jti === 'string'
}