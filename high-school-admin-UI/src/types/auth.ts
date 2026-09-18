// src/types/auth.ts

import type { CurrentUser, UserRole } from './user'

/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login response — returned by `POST /auth/login`.
 *
 * The `user` field is a trimmed projection of the full user record with
 * the role as a bare name (not the `{ id, name }` object that `GET /users`
 * returns) and `permissionKeys` attached.
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: CurrentUser
}

/**
 * Refresh response — returned by `POST /auth/refresh-token`.
 *
 * The refresh token is rotated on every call: the one you sent is revoked,
 * and this new one replaces it. Store it before making any further
 * requests.
 */
export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Change-password request — used by `POST /auth/change-password` for a
 * user changing their own password.
 *
 * Not to be confused with the admin-triggered reset at
 * `POST /users/:id/reset-password`, which takes a `newPassword` alone.
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Forgot-password request.
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * Reset-password request — sent to `POST /auth/reset-password` after the
 * user clicks the link in the reset email. The token is the raw value from
 * the email; the backend hashes it before comparing.
 */
export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

/**
 * Role labels for the login-time role display. Trimmed version of the map
 * in `./user` — the login response only carries the role name, not the
 * full user object.
 */
export type { UserRole }