import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
].filter((filePath) => fs.existsSync(filePath))

for (const filePath of envPaths) {
  expand(dotenv.config({ path: filePath }))
}

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    schema
  )

// Boolean env vars MUST go through an enum, not z.coerce.boolean().
// `Boolean("false") === true`, so a plain coercion would ENABLE features
// the operator thought they had disabled.
const boolFromEnv = z
  .enum(['true', 'false'])
  .default('false')
  .transform((v) => v === 'true')

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65535).default(5000),
    LOG_LEVEL: emptyToUndefined(
      z.enum(['error', 'warn', 'info', 'http', 'debug']).optional()
    ),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_ISSUER: z.string().default('high-school-api'),
    JWT_AUDIENCE: z.string().default('high-school-clients'),

    UPLOAD_PATH: z.string().default('uploads'),
    MAX_UPLOAD_MB: z.coerce.number().int().positive().max(100).default(10),

    CORS_ORIGIN: z.array(z.string()).default(['http://localhost:3000']),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

    SWAGGER_ENABLED: boolFromEnv,
    SWAGGER_SERVER_URL: emptyToUndefined(z.string().url().optional()),

    EMAIL_HOST: emptyToUndefined(z.string().optional()),
    EMAIL_PORT: emptyToUndefined(z.coerce.number().int().positive().optional()),
    EMAIL_USER: emptyToUndefined(z.string().optional()),
    EMAIL_PASSWORD: emptyToUndefined(z.string().optional()),

    REDIS_URL: emptyToUndefined(z.string().url().optional()),
  })
  .superRefine((value, ctx) => {
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
  console.error('❌ Invalid environment configuration:')
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export const env = parsed.data

export const swaggerServerUrl =
  env.SWAGGER_SERVER_URL ?? `http://localhost:${env.PORT}/api/v1`

export const swaggerEnabled =
  env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED