import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'

/**
 * Validation results land on `req.validated` rather than overwriting the raw
 * request. Handlers read from `req.validated.body` / `.query` / `.params`.
 *
 * Reasons:
 *   - Express 5 makes `req.query` read-only; reassigning it throws.
 *   - Keeping the raw input and the parsed output distinct makes it obvious
 *     whether a value came from the client or from a schema default/transform.
 *   - One storage site means one place to look when debugging what a handler
 *     actually received.
 *
 * BREAKING CHANGE: handlers that previously read `req.body` after
 * `validateBody(...)` must now read `req.validated.body`.
 */
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

/**
 * Escape hatch for gradual migration. Behaves like the old validateBody —
 * parsed output is written back onto `req.body` — while ALSO being available
 * on `req.validated.body`. Use in routes whose handlers haven't been updated
 * yet; prefer `validateBody` for new routes.
 */
export function validateBodyMutating<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body)
    req.validated ??= {}
    req.validated.body = parsed
    req.body = parsed
    next()
  }
}