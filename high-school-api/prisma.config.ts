import 'dotenv/config'
import { expand } from 'dotenv-expand'
import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'
import fs from 'node:fs'
import path from 'node:path'

// Keep Prisma CLI configuration aligned with the API runtime configuration:
// use an API-local .env first, then fill missing values from the repository root.
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
].filter((filePath) => fs.existsSync(filePath))

for (const filePath of envPaths) {
  expand(dotenv.config({ path: filePath }))
}

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