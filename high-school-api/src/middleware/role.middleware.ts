import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '@/utils/ApiError'

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

/** Requires the caller's role to hold `${module}.${action}` (e.g. "grades.edit"). */
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

/** Requires the caller's role name to be one of the given roles — for a handful of
 *  admin-only endpoints (e.g. school settings) that don't fit the module.action model. */
export function requireRole(...roleNames: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized())
    if (!roleNames.includes(req.user.roleName)) {
      return next(ApiError.forbidden('Insufficient role'))
    }
    next()
  }
}
