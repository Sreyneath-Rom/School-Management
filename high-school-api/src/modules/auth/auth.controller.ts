import type { Request, Response } from 'express'
import { authService } from './auth.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

function requestMeta(req: Request) {
  return { userAgent: req.headers['user-agent'], ipAddress: req.ip }
}

export const authController = {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.password, requestMeta(req))
    sendSuccess(res, result)
  },

  async refresh(req: Request, res: Response) {
    const result = await authService.refresh(req.body.refreshToken, requestMeta(req))
    sendSuccess(res, result)
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.body.refreshToken)
    res.status(204).send()
  },

  async me(req: Request, res: Response) {
    if (!req.user) throw ApiError.unauthorized()
    sendSuccess(res, req.user)
  },

  async changePassword(req: Request, res: Response) {
    if (!req.user) throw ApiError.unauthorized()
    await authService.changePassword(req.user.sub, req.body.currentPassword, req.body.newPassword)
    res.status(204).send()
  },

  async forgotPassword(req: Request, res: Response) {
    await authService.forgotPassword(req.body.email)
    sendSuccess(res, { message: 'If that email exists, a reset link has been sent.' })
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body.token, req.body.newPassword)
    res.status(204).send()
  },
}
