import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from './env'
import { ApiError } from '@/utils/ApiError'

export interface AccessTokenPayload {
  sub: string // userId
  roleId: string
  roleName: string
}

export interface RefreshTokenPayload {
  sub: string
  // jti is required so refresh-token rotation can invalidate a specific token
  // without invalidating every other session for the same user.
  jti: string
}

// Common signing options for both token kinds. `iss`/`aud` are enforced on
// verify — this matters because a token minted for a different service that
// happens to share a signing secret won't be accepted here.
const commonSignOptions = {
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
} satisfies SignOptions

// ---------------------------------------------------------------------------
// Access tokens
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Refresh tokens
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------
//
// `jwt.verify` returns a value typed as `string | JwtPayload`. A blind
// `as AccessTokenPayload` cast asserts a shape that isn't checked — a token
// minted by another service with the same secret and a differently-shaped
// payload would slip through and then crash something far from this file.
// A runtime guard keeps the failure local and legible.

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