import 'dotenv/config'
import { expand } from 'dotenv-expand'
import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Same expansion concern as src/config/env.ts: DATABASE_URL in .env
// references ${POSTGRES_USER} etc., which plain dotenv doesn't expand.
expand(dotenv.config())

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
