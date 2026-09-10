import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

// Plain `dotenv` does NOT expand "${VAR}" references inside .env values —
// that requires dotenv-expand. Without this, DATABASE_URL="...${POSTGRES_USER}..."
// would be read as a literal string containing "${POSTGRES_USER}".
// Load the API-local file first, then fill any missing values from the
// repository root so both `cd high-school-api && npm run dev` and monorepo
// root workflows use the same configuration.
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

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  UPLOAD_PATH: z.string().default('uploads'),
  MAX_UPLOAD_MB: z.coerce.number().default(10),

  CORS_ORIGIN: z.array(z.string()).default(['http://localhost:3000']),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(300),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),

  REDIS_URL: z.string().optional(),
})

const parsed = envSchema.safeParse({
  ...process.env,
  CORS_ORIGIN: corsOrigins,
})

if (!parsed.success) {
  // Fail fast and loud — a misconfigured env is worse than a crash at boot.
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
