# High School Management System — API

Express + TypeScript + Prisma 7 + PostgreSQL backend. Single-tenant (one deployment per school).

## Local development

```bash
cp .env.example .env          # fill in real secrets; POSTGRES_USER/PASSWORD/DB drive DATABASE_URL
npm install
npx prisma generate           # generates the client into src/generated/prisma
npm run prisma:migrate        # creates tables; also seeds via prisma.config.ts if migrate dev triggers it
npx prisma db seed            # run explicitly if the above didn't seed — see "Prisma 7 notes" below
npm run dev                   # http://localhost:5000
```

Swagger docs: `http://localhost:5000/api-docs`
Health check: `http://localhost:5000/health`

The seed script creates:
- Permission catalog (`<module>.<action>` for every module × [view, create, edit, delete])
- Three roles: `admin` (full access), `teacher` (classroom-facing modules), `student` (view-only + submit)
- One admin login: `admin@school.local` / `ChangeMe123!` — **change this immediately in any real deployment**

## Docker

```bash
docker compose up --build
```

Starts the API, Postgres, pgAdmin (`localhost:5050`), and an Nginx reverse proxy (`localhost:80`).
`DATABASE_URL` for the `api` container is set inside `docker-compose.yml` itself (pointed at the
`postgres` service, not `localhost`) — it reads the same `POSTGRES_USER`/`PASSWORD`/`DB` values from
`.env` that provision the Postgres container, so they can't drift out of sync.

Run migrations against the containerized DB with `docker compose exec api npx prisma migrate deploy`.

## Prisma 7 notes

This project targets Prisma 7 (generator `prisma-client`, not the old `prisma-client-js`):
- The client generates into `src/generated/prisma` (not `node_modules/.prisma`), imported as
  `@/generated/prisma/client`. It compiles into `dist/` along with the rest of the app; `npm run build`
  additionally copies non-`.ts` assets (e.g. WASM) that `tsc` doesn't handle — see `copy:prisma-assets`.
- The datasource URL moved out of `schema.prisma` into `prisma.config.ts` (required in v7).
- A driver adapter is now mandatory — this project uses `@prisma/adapter-pg`, wired up in
  `src/config/database.ts`.
- Seeding config moved from the old `package.json#prisma.seed` field into `prisma.config.ts`
  (`migrations.seed`). `prisma migrate dev` may still run it automatically, or you may need
  `npx prisma db seed` explicitly — I couldn't verify which in this sandbox (see note below); try
  `migrate dev` first and fall back to running `db seed` manually if nothing gets seeded.
- **Not verified end-to-end in this environment** — `prisma generate` needs to download engine binaries
  from `binaries.prisma.sh`, which isn't reachable from this sandbox's network. The schema, config, and
  code changes follow Prisma's official v7 upgrade guide, but you should run
  `npm install && npx prisma generate && npm run build` locally as the first step before relying on this.

## Architecture notes / known gaps

- **RBAC**: permission checks are `module.action` (e.g. `grades.edit`), loaded fresh from the DB on every
  request in `auth.middleware.ts`. This means permission changes take effect immediately, at the cost of
  one extra indexed query per request. If that becomes a bottleneck, cache permission sets in Redis keyed
  by roleId and invalidate on `roles.service.replacePermissions`.
- **Refresh tokens** are hashed and stored server-side (`RefreshToken` table) so logout / password-change
  actually revokes sessions, and rotate on every use.
- **Password reset** (`/auth/forgot-password`, `/auth/reset-password`) is stubbed — it needs a
  `passwordResetTokenHash` / `passwordResetExpiresAt` column added to `User` via migration, plus real
  email delivery, before it's usable. See the comments in `auth.service.ts`.
- **File uploads**: `upload.middleware.ts` restricts MIME type and size but does not scan file contents.
  Add virus scanning (e.g. ClamAV) before accepting uploads in production, especially for the
  `lessons` and `homework` submission endpoints.
- **Quiz answers**: `GET /quizzes/:id` currently returns `correctAnswer` for every question regardless of
  caller role — fine for teachers/admins, but strip it for students before shipping (noted inline in
  `quizzes.routes.ts`).
- Modules not yet built: fee/billing. Add as a new module following the same
  routes → service → Prisma pattern if needed.
