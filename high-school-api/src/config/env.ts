import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

/**
 * Load order: API-local `.env` first, then fall back to the repository-root
 * `.env`. Values already set in `process.env` win over both (dotenv's default
 * behavior), so a real environment variable always overrides a file entry.
 *
 * `dotenv-expand` is required — plain `dotenv` does NOT expand `${VAR}`
 * references inside .env values. Without it, a DATABASE_URL built from
 * `${POSTGRES_USER}` would be read as a literal string containing the
 * placeholder.
 */
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
].filter((filePath) => fs.existsSync(filePath))

for (const filePath of envPaths) {
  expand(dotenv.config({ path: filePath }))
}

/**
 * CORS_ORIGIN is a comma-separated list. Trim and drop empties so a stray
 * trailing comma doesn't produce an empty-string origin that would never match.
 */
const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

/**
 * Coerces an empty string to `undefined`.
 *
 * `.env` files commonly contain `REDIS_URL=` (key present, value empty) as a
 * "this is a thing you could configure" hint. Zod's `.optional()` treats that
 * as a defined string — `""` is not `undefined` — so `.url()` or `.email()`
 * validators fail on it. Wrapping every optional field with this preprocessor
 * makes empty-string and omitted behave identically.
 */
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    schema
  )

const envSchema = z
  .object({
    // ---- Runtime ----
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65535).default(5000),
    LOG_LEVEL: emptyToUndefined(
      z.enum(['error', 'warn', 'info', 'http', 'debug']).optional()
    ),

    // ---- Database ----
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // ---- Auth ----
    JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_ISSUER: z.string().default('high-school-api'),
    JWT_AUDIENCE: z.string().default('high-school-clients'),

    // ---- Uploads ----
    UPLOAD_PATH: z.string().default('uploads'),
    MAX_UPLOAD_MB: z.coerce.number().int().positive().max(100).default(10),

    // ---- HTTP ----
    CORS_ORIGIN: z.array(z.string()).default(['http://localhost:3000']),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

    // ---- Swagger ----
    // Swagger enumerates every endpoint and schema. Off by default in
    // production; turn on only behind an external gate (VPN, IP allowlist).
    SWAGGER_ENABLED: z.coerce.boolean().default(false),
    // Override the "Try it out" server URL. Falls back to localhost:{PORT}
    // when unset, which is fine for dev.
    SWAGGER_SERVER_URL: emptyToUndefined(z.string().url().optional()),

    // ---- Email (optional until password reset is implemented) ----
    EMAIL_HOST: emptyToUndefined(z.string().optional()),
    EMAIL_PORT: emptyToUndefined(z.coerce.number().int().positive().optional()),
    EMAIL_USER: emptyToUndefined(z.string().optional()),
    EMAIL_PASSWORD: emptyToUndefined(z.string().optional()),

    // ---- Redis (optional; used for permission caching if enabled) ----
    REDIS_URL: emptyToUndefined(z.string().url().optional()),
  })
  .superRefine((value, ctx) => {
    // Production-specific hardening. These are the mistakes that ship to prod
    // because nobody noticed until after the deploy.
    if (value.NODE_ENV !== 'production') return

    const forbidden = ['change-me', 'changeme', 'secret', 'password', 'test', 'dev']

    for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const) {
      const v = value[key]
      if (v.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} must be at least 32 characters in production`,
        })
      }
      if (forbidden.some((word) => v.toLowerCase().includes(word))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} contains a placeholder value — set a real secret`,
        })
      }
    }

    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_REFRESH_SECRET'],
        message:
          'JWT_REFRESH_SECRET must differ from JWT_ACCESS_SECRET — sharing them means a leaked access-token secret forges refresh tokens',
      })
    }

    if (value.CORS_ORIGIN.includes('*')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGIN'],
        message: 'Wildcard CORS origin is not allowed in production',
      })
    }
  })

const parsed = envSchema.safeParse({
  ...process.env,
  CORS_ORIGIN: corsOrigins,
})

if (!parsed.success) {
  // Fail fast and loud — a misconfigured env is worse than a crash at boot.
  console.error('❌ Invalid environment configuration:')
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export const env = parsed.data

// Resolved Swagger server URL. Prefer explicit override, then localhost with
// the actual configured port so docs work in dev without extra config.
export const swaggerServerUrl =
  env.SWAGGER_SERVER_URL ?? `http://localhost:${env.PORT}/api/v1`

// Whether Swagger should be mounted at all. Always on in dev/test; on in
// production only when explicitly enabled.
export const swaggerEnabled = env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED