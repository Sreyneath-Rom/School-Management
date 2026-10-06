import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '@/utils/ApiError'

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export function requirePermission(moduleKey: string, action: PermissionAction) {
  const required = `${moduleKey}.${action}`

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized())

    if (!req.user.permissionKeys.includes(required)) {
      return next(ApiError.forbidden(`Missing permission: ${required}`))
    }

    next()
  }
}

export function requireRole(...roleNames: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized())

    if (!roleNames.includes(req.user.roleName)) {
      return next(ApiError.forbidden('Insufficient role'))
    }

    next()
  }
}