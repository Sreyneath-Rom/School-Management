import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

/**
 * Attaches a stable request identifier to every request and echoes it back in
 * the X-Request-Id response header.
 *
 * Honors an incoming X-Request-Id (so a request ID set by an upstream proxy or
 * the frontend is preserved end-to-end) but caps its length to prevent a
 * client from stuffing arbitrary bytes into log lines.
 *
 * The Express.Request.id declaration lives in src/types/express.d.ts — do not
 * add a second `declare global` block here or the two will drift.
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header('x-request-id')
  req.id =
    incoming && incoming.length > 0 && incoming.length <= 128
      ? incoming
      : randomUUID()

  res.setHeader('x-request-id', req.id)
  next()
}