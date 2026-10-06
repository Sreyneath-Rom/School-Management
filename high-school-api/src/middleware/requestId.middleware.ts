import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header('x-request-id')
  req.id =
    incoming && incoming.length > 0 && incoming.length <= 128
      ? incoming
      : randomUUID()

  res.setHeader('x-request-id', req.id)
  next()
}