import type { AccessTokenPayload } from '@/config/jwt'

declare global {
  namespace Express {
    interface Request {
      /**
       * Correlation ID set unconditionally by requestId.middleware. Non-optional
       * because that middleware is mounted first in app.ts.
       */
      id: string

      /**
       * Populated by auth.middleware after a successful Bearer token check.
       * Undefined on public routes.
       */
      user?: AccessTokenPayload & { permissionKeys: string[] }

      /**
       * Output of the validation middleware. Raw request properties (body,
       * query, params) are left untouched so handlers can tell client input
       * apart from schema output.
       */
      validated?: {
        body?: unknown
        query?: unknown
        params?: unknown
      }
    }
  }
}

export {}