import type { Request, Response } from 'express'
import { authService } from './auth.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  LoginBody,
  RefreshBody,
  ResetPasswordBody,
} from './auth.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

function requestMeta(req: Request) {
  return { userAgent: req.headers['user-agent'], ipAddress: req.ip }
}

/**
 * Controllers read validated input from `req.validated.body` — never from
 * `req.body` directly. The validation middleware leaves the raw request
 * untouched so it's unambiguous whether a value was supplied by the client
 * or produced by a schema default/transform.
 */
export const authController = {
  async login(req: Request, res: Response) {
    const body = req.validated?.body as LoginBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await authService.login(body.email, body.password, requestMeta(req))
    )
  },

  async refresh(req: Request, res: Response) {
    const body = req.validated?.body as RefreshBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await authService.refresh(body.refreshToken, requestMeta(req))
    )
  },

  async logout(req: Request, res: Response) {
    const body = req.validated?.body as RefreshBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    await authService.logout(body.refreshToken)
    res.status(204).end()
  },

  async logoutAll(req: Request, res: Response) {
    const user = requireUser(req)
    await authService.logoutAll(user.sub)
    res.status(204).end()
  },

  async me(req: Request, res: Response) {
    const user = requireUser(req)
    sendSuccess(res, await authService.getCurrentUser(user.sub))
  },

  async changePassword(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as ChangePasswordBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    await authService.changePassword(user.sub, body.currentPassword, body.newPassword)
    // 204 — the response is intentionally empty. The caller must log in
    // again with the new password, since every refresh token was revoked.
    res.status(204).end()
  },

  async forgotPassword(req: Request, res: Response) {
    const body = req.validated?.body as ForgotPasswordBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    await authService.forgotPassword(body.email)

    // Same 200 response regardless of whether the email exists. Anything
    // else turns this endpoint into an account-enumeration oracle.
    sendSuccess(res, {
      message: 'If that email is registered, a reset link has been sent.',
    })
  },

  async resetPassword(req: Request, res: Response) {
    const body = req.validated?.body as ResetPasswordBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    await authService.resetPassword(body.token, body.newPassword)
    res.status(204).end()
  },
}