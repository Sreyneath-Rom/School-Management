import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validated ??= {}
    req.validated.body = schema.parse(req.body)
    next()
  }
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validated ??= {}
    req.validated.query = schema.parse(req.query)
    next()
  }
}

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validated ??= {}
    req.validated.params = schema.parse(req.params)
    next()
  }
}

export function validateBodyMutating<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body)
    req.validated ??= {}
    req.validated.body = parsed
    req.body = parsed
    next()
  }
}