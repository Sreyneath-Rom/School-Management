import type { AccessTokenPayload } from '@/config/jwt'

declare global {
  namespace Express {
    interface Request {
      /**
       * Correlation ID. Optional on purpose — the runtime value is
       * undefined if requestId middleware is not mounted first.
       */
      id?: string

      user?: AccessTokenPayload & { permissionKeys: string[] }

      validated?: {
        body?: unknown
        query?: unknown
        params?: unknown
      }
    }
  }
}

export {}