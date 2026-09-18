```markdown
# High School Management System — API

REST API backend for the High School Management System.

Built with **Express.js, TypeScript, Prisma 7, and PostgreSQL**.

The API provides authentication, role-based access control, school management,
academic management, attendance, lessons, homework, quizzes, grades, and
reporting functionality.

---

# Tech Stack

| Technology       | Purpose            |
| ---------------- | ------------------ |
| Node.js          | Runtime            |
| Express.js       | REST API framework |
| TypeScript       | Type safety        |
| Prisma 7         | ORM                |
| PostgreSQL       | Database           |
| JWT              | Authentication     |
| Swagger          | API documentation  |
| bcrypt           | Password hashing   |
| Zod              | Request validation |
| Multer           | File uploads       |
| Winston          | Logging            |
| tsc-alias        | Path-alias rewrite |

---

# Requirements

```text
Node.js 20+ (22 recommended)
npm 10+
PostgreSQL 16+
Docker + Docker Compose v2 (for the containerized workflow)
```

---

# Local Development

## 1. Install

```bash
cd high-school-api
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`. For local development, only these usually need changing:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/high_school_db?schema=public
JWT_ACCESS_SECRET=<generate a 32+ char secret>
JWT_REFRESH_SECRET=<generate a different 32+ char secret>
```

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Start Postgres

Either use a local Postgres, or start one with Docker:

```bash
docker run -d --name hs-postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=high_school_db \
  -p 127.0.0.1:5432:5432 \
  -v hs-postgres-dev-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

## 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 5. Run

```bash
npm run dev
```

The dev server uses `tsx watch` — saving a file under `src/` restarts the
process automatically. Path aliases (`@/config/env`) are resolved by `tsx`
during development; the production build uses `tsc-alias` (see Build).

API:

```text
http://localhost:5000
```

## Useful commands

```bash
npm run dev              # dev server with hot reload
npm run build            # tsc + tsc-alias + copy Prisma assets
npm start                # run the built output (dist/server.js)
npm run lint             # tsc --noEmit
npm test                 # vitest
npx prisma studio        # browser UI for the database
npx prisma migrate reset # drop, re-migrate, re-seed
```

---

# Docker

The full stack runs through `docker compose`:

```text
API       →  http://localhost:5000
Nginx     →  http://localhost          (reverse proxy in front of the API)
pgAdmin   →  http://localhost:5050     (loopback only)
Postgres  →  127.0.0.1:5432            (loopback only)
```

## First run

The `.env` file must contain `PGADMIN_EMAIL` and `PGADMIN_PASSWORD` — the
Compose file uses `:?` to fail fast if they're missing.

```bash
docker compose up --build
```

The API container's entrypoint runs `prisma migrate deploy` automatically
before starting the server. Migrations apply on every container boot; they're
a no-op when nothing is pending.

Seed the database once, on first run:

```bash
docker compose exec api npx prisma db seed
```

If you want the seed to run automatically on every container start, set
`SEED_ON_BOOT=true` in `docker-compose.yml` and uncomment the corresponding
block in `docker-entrypoint.sh`. **Not recommended beyond initial setup** —
re-seeding on every restart will overwrite any admin edits to role
permissions.

## Common commands

```bash
docker compose up                # foreground
docker compose up -d             # background
docker compose logs -f api       # follow API logs
docker compose exec api sh       # shell into the API container
docker compose down              # stop (keeps volumes)
docker compose down -v           # stop and delete volumes (full reset)
docker compose build --no-cache api
```

---

# Important: Prisma 7

The project uses the Prisma 7 `prisma-client` generator (not the legacy
`prisma-client-js`), which outputs a self-contained client:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Import the client from the generated path:

```ts
import { PrismaClient } from "@/generated/prisma/client";
```

The datasource URL is configured through `prisma.config.ts` (which reads
`DATABASE_URL` from `.env` via `dotenv-expand`), not from `schema.prisma`.

Prisma 7 also requires a driver adapter:

```text
@prisma/adapter-pg
```

Database initialization lives in `src/config/database.ts`.

---

# Path Aliases

Source files import via `@/*` mapped to `src/*` in `tsconfig.json`.

- **Development** — `tsx` resolves aliases natively.
- **Production build** — `tsc` does NOT rewrite aliases in the emitted JS,
  so the build pipeline includes `tsc-alias`, which rewrites `@/foo` into
  the correct relative path.

If the `build` script in `package.json` doesn't include `tsc-alias` between
`tsc` and `copy:prisma-assets`, the resulting `dist/server.js` will contain
`require("@/config/env")` and Node will fail to start with
`ERR_MODULE_NOT_FOUND`.

---

# Environment Variables

See `.env.example` for the full list with descriptions. Key variables:

| Variable | Purpose | Notes |
|---|---|---|
| `NODE_ENV` | `development` / `test` / `production` | |
| `PORT` | HTTP port | default `5000` |
| `DATABASE_URL` | PostgreSQL connection string | required |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Compose credentials | read by `docker-compose.yml` |
| `JWT_ACCESS_SECRET` | Signing key for access tokens | 32+ chars in prod |
| `JWT_REFRESH_SECRET` | Signing key for refresh tokens | must differ from access |
| `JWT_ACCESS_EXPIRES_IN` | Access-token TTL | default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token TTL | default `7d` |
| `CORS_ORIGIN` | Comma-separated origin allowlist | no wildcard in prod |
| `UPLOAD_PATH` | Disk path for uploads | default `uploads` |
| `MAX_UPLOAD_MB` | Per-file upload cap | default `10` |
| `SWAGGER_ENABLED` | Expose `/api-docs` in prod | default `false` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Global rate limit | default 15 min / 300 |
| `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` | pgAdmin login (Compose) | required |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASSWORD` | SMTP for password reset | optional until reset flow is enabled |
| `REDIS_URL` | Reserved for future caching | optional |

`env.ts` validates on boot via Zod and refuses to start with an
invalid configuration. In production it additionally rejects short JWT
secrets, placeholder values, identical access/refresh secrets, and a
wildcard `CORS_ORIGIN`.

---

# API URLs

Base API:

```text
http://localhost:5000/api/v1
```

Health check (no authentication, no rate limit, does not touch the DB):

```text
http://localhost:5000/health
```

Swagger documentation (dev/test always; prod only when `SWAGGER_ENABLED=true`):

```text
http://localhost:5000/api-docs
```

Every response includes an `X-Request-Id` header. If the client sends one,
it's echoed back; otherwise a UUID is generated. The same ID appears in
every log line for that request, so client-reported errors are easy to trace.

---

# Authentication

## Login flow

```text
Client
  │
  ▼
POST /api/v1/auth/login  { email, password }
  │
  ├── accessToken      (short-lived, ~15m)
  └── refreshToken     (long-lived, ~7d, stored hashed in DB)
        │
        ▼
Client stores session
        │
        ▼
Authorization: Bearer <accessToken>
```

Failed login returns the same generic message regardless of whether the
email exists, so login can't be used to enumerate accounts.

## Refresh tokens

Refresh tokens are:

- Stored hashed (SHA-256) in the `RefreshToken` table
- Rotated on every use — the used token is revoked and a new pair is issued
  atomically (Postgres serializable isolation + retry on `P2034`; two
  concurrent refreshes with the same token: exactly one wins)
- Revoked on logout
- Revoked on password change or admin-triggered password reset

## Auth endpoints

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all           (revoke every session for the caller)
GET  /api/v1/auth/me
POST /api/v1/auth/change-password      (revokes all sessions)
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

Login and forgot/reset are rate-limited more aggressively than other
endpoints. Successful requests are exempt from the auth-specific limiter so
a legitimate client refreshing tokens doesn't lock itself out.

**Password reset** — the `User` model has `passwordResetTokenHash` and
`passwordResetExpiresAt` columns, and `resetPassword` fully implements
lookup + expiry check + password update + session revocation. What's still
missing is **email delivery**: `forgotPassword` generates the token and logs
it at `info` level instead of sending it. Configure SMTP (`EMAIL_*` vars)
and wire it into `authService.forgotPassword` before production.

---

# Role-Based Access Control

Permissions are strings in the form `<module>.<action>`:

```text
users.view      users.create      users.edit      users.delete
classes.view    classes.create    classes.edit    classes.delete
grades.view     grades.create     grades.edit     grades.delete
...
```

Modules covered: `dashboard, school, academicYears, rooms, gradeLevels,
terms, users, roles, permissions, classes, students, teachers, subjects,
schedules, lessons, homework, quizzes, grades, attendance, leaveRequests,
announcements, notifications, reports, translations, exams`.

## Enforcement

`authenticate` middleware verifies the JWT, then loads the user's current
permission keys fresh from the database on every request. `requirePermission
("grades", "edit")` checks that the caller's role holds `grades.edit`.

Because permissions are read from the DB on every request, a permission
change takes effect immediately — no waiting for tokens to expire.

## Rules of thumb

- **Read endpoints** — scoped to the caller's own data unless they're staff.
  Students see their own grades and attendance; teachers see their classes;
  parents see their children.
- **Write endpoints** — require the corresponding `<module>.edit` or
  `<module>.create` permission, and often an ownership check on top (a
  teacher can only grade their own homework, a student can only submit as
  themselves).
- **Actor identity is never client-supplied.** Teacher-authored resources
  resolve `teacherId` from `req.user.sub`, not from the request body.
  Same for student submissions and announcement authorship.

---

# Roles

The seed creates four roles:

| Role | Description |
|---|---|
| `admin` | Full access to every module |
| `teacher` | View + edit classroom-facing modules (classes, subjects, schedules, lessons, homework, quizzes, grades, attendance, leave requests); no access to users, roles, or school settings |
| `student` | View own academic data; submit homework, take quizzes, file leave requests |
| `parent` | View own children's data; file leave requests on their behalf |

All four are seeded as system roles — their names are load-bearing (matched
by `requireRole('admin')` checks in code) and cannot be renamed or deleted
via the API.

---

# Main API Modules

```text
Auth               Users              Roles             Permissions
School             Academic Years     Terms             Rooms
Grade Levels       Classes            Subjects          Schedules
Lessons            Homework           Quizzes           Grades
Exams (stub)       Attendance         Leave Requests    Announcements
Notifications      Reports            Languages         Translations
```

## Resource scoping

Every read is scoped by the caller's identity where applicable:

- `GET /grades/me` — the caller's own grades (student)
- `GET /students/:id` — the student's own profile, a parent's own child, or
  any student for staff
- `GET /teachers/:id` — staff-only in the current build (a `/me` variant for
  teachers is on the roadmap)
- `GET /leaves/:id` — the student's own request, or any for staff
- `GET /notifications/:id` — the caller's own

Cross-user access is impossible by construction — the ownership check is
folded into the Prisma `where` clause rather than applied after the fetch.

---

# Academic Flow

```text
School
   │
   ▼
Academic Year
   │
   ▼
Term
   │
   ▼
Grade / Level
   │
   ▼
Class ──── Students
   │      └ Teachers (homeroom)
   │      └ Subjects
   │           │
   │           ▼
   │        Schedule
   │           │
   │           ▼
   │        Lessons
   │           ├── Homework
   │           └── Quizzes
   │                  │
   ▼                  ▼
 Grades ──────────────┘
```

---

# Attendance Flow

```text
Teacher → Select Class → Select Date → Load Students → Mark Attendance
  │
  ├── Present
  ├── Absent
  ├── Late
  └── Excused
  │
  ▼
Submit → API → PostgreSQL
```

Attendance rows are unique per `(studentId, date)` — re-marking the same
student on the same day updates the existing row rather than inserting a
duplicate.

---

# Homework Flow

```text
Teacher → Select Class + Subject → Create Homework
  │
  ├── Title, Description
  ├── File attachment (optional)
  ├── Due Date, Max Score
  └── allowLateSubmissions flag
  │
  ▼
Publish → Students in that class view
  │
  ▼
Student Submission (text content, file attachment, or both)
  │
  ▼
Teacher Review → Grade + Feedback
```

**Enrollment is verified on submit** — a student cannot submit homework
assigned to a class they aren't in. **Resubmission is not allowed** on the
same `(homeworkId, studentId)` — the first submission stands, and a second
attempt gets a 409.

---

# Quiz Flow

```text
Teacher → Create Quiz
  │
  ├── Title, Subject, Class
  ├── Questions (text, options, correct answer, points)
  ├── timeLimitMin
  └── isAutoGrade flag
  │
  ▼
Publish → Students in that class view
  │
  ▼
Student Takes Quiz → Submit answers
  │
  ▼
Evaluate (auto-grade if enabled, otherwise teacher grades manually)
  │
  ▼
Result
```

## Quiz Security

`GET /quizzes/:id` is role-aware:

- **Staff** (admin, teacher) — receive `correctAnswer` on every question.
- **Students** — questions arrive with `id`, `questionText`, `options`,
  `points`, and **no `correctAnswer`**.

The projection is enforced at the Prisma `select` level, so there is no
code path where the answer leaves the process for a student caller.

Submission is one-shot: a second submission for the same
`(quizId, studentId)` returns 409. If resubmission becomes a requirement,
model it explicitly (`Quiz.allowResubmission` + an attempt counter) rather
than via the current upsert-free path.

---

# File Uploads

Uploads are validated by:

```text
MIME type (whitelist — PDF, PNG, JPEG, WEBP, DOCX, PPTX, XLSX)
File size (MAX_UPLOAD_MB, default 10 MB)
```

Filenames are generated as UUIDs, and the extension is derived from the
MIME type — never from the client-supplied filename.

## Public vs. gated

- **`/uploads/logos/*`** — publicly served via `express.static`. The school
  logo renders in the site header for every visitor, including anonymous
  users on the login page, so this path is intentionally public.
- **Everything else** — not exposed via HTTP at all. Lesson materials,
  homework attachments, and submissions are stored on disk but there is no
  static route for them. To make them downloadable, add an authenticated
  route (`GET /api/v1/uploads/:id` with a permission check) or use
  short-lived signed URLs.

## Production hardening

Before exposing uploads to real users:

```text
[ ] Magic-byte content sniffing (a file-type check after multer writes the file)
[ ] ClamAV or equivalent antivirus scanning
[ ] S3-compatible object storage if running more than one replica
```

The last point matters: disk storage means a file uploaded to pod A is
invisible to pod B. Any multi-replica deployment needs shared storage or
object storage.

---

# Database

```text
PostgreSQL 16+
```

Schema: `prisma/schema.prisma`
Migrations: `prisma/migrations/`

```bash
npx prisma generate             # regenerate the client
npx prisma migrate dev          # create a new migration (dev)
npx prisma migrate deploy       # apply pending migrations (prod / container)
npx prisma db seed              # run prisma/seed.ts
npx prisma studio               # browser UI
```


# Seed Data

Running `npx prisma db seed` populates:

```text
Permission catalog     — 100 permissions across 25 modules
Four roles             — admin, teacher, student, parent
Full permission grants for each role
Two languages          — Khmer (km), French (fr)
One school             — "Sample High School" / 2026-2027
One academic year      — 2026-2027 with two terms
Three grade levels     — G10, G11, G12
Six rooms              — classrooms, science lab, computer lab, library
Four demo users        — one per role
Sample academic data   — class, subjects, schedule, lesson, homework,
                         quiz, grade, attendance, submission, parent link
```

## Demo accounts

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `password` | admin |
| `teacher@example.com` | `password` | teacher |
| `student@example.com` | `password` | student |
| `parent@example.com` | `password` | parent |

**Change these before any real deployment** — or delete the demo users
entirely. The password is literal, in the seed file, and public.

The seed is idempotent: re-running it updates the existing demo rows
(including reviving soft-deleted accounts) without creating duplicates.

---

# Build

```bash
npm run build
```

The build runs three steps in order:

```text
1. tsc -p tsconfig.json          compile TypeScript to dist/
2. tsc-alias -p tsconfig.json    rewrite @/* aliases to relative paths
3. copy:prisma-assets            copy non-TS Prisma assets into dist/
```

Step 2 is required — `tsc` alone leaves `@/foo` in the emitted JS, which
Node can't resolve. Step 3 copies any `.wasm` / `.d.ts` / schema assets the
generated Prisma client needs at runtime.

---

# Production Checklist

```text
[ ] Change every default password (demo users, pgAdmin)
[ ] Generate fresh 32+ char JWT secrets — do not reuse dev ones
[ ] Set NODE_ENV=production
[ ] Point DATABASE_URL at the production database
[ ] Restrict CORS_ORIGIN to the real frontend host (no wildcard)
[ ] Enable HTTPS (terminate at the load balancer or a reverse proxy)
[ ] Configure SMTP and wire it into forgotPassword
[ ] Add magic-byte validation + antivirus scanning for uploads
[ ] Move uploads to object storage if running >1 replica
[ ] Review RATE_LIMIT_MAX against expected traffic
[ ] Verify database backup + restore procedure
[ ] Protect Swagger (keep SWAGGER_ENABLED=false or gate /api-docs behind auth)
[ ] Verify the exam-answer guard still holds after any quiz change
[ ] Run npx prisma migrate deploy on the production database
[ ] Delete demo users if they aren't wanted in production
```

---

# Known Gaps

## Password reset — email delivery

The token columns exist, `resetPassword` is fully implemented, and
`forgotPassword` generates + hashes the token. Only the actual sending step
is missing — the raw token is logged instead. Wire SMTP in
`authService.forgotPassword` before production.

## File content scanning

Uploads validate MIME type (client-declared) and size but do not verify the
file's actual contents. A `.exe` uploaded with a `.pdf` Content-Type passes.
Add magic-byte detection (`file-type` package) after multer writes the file,
and antivirus scanning (ClamAV) before the file becomes downloadable.

## Uploads on multi-replica deployments

Disk-backed uploads live on the container filesystem. Files uploaded to one
replica aren't visible to the others. Move to S3-compatible object storage
or a shared volume before scaling horizontally.

## Exams module

Currently a stub. Reads return empty lists; writes return `501 Not
Implemented`. The API shape is stable, so a frontend can be built against
it today. Implementing requires adding `Exam`, `ExamSchedule`, `MarkEntry`,
and `ReportCard` models to the schema, then filling in
`exams.service.ts` — the controller and routes don't need to change.

## Billing / Fees

Not implemented. A future module can follow the existing architecture:

```text
routes → controller → service → Prisma → PostgreSQL
```

with permissions namespaced under `billing.*` added to `MODULES` in
`seed.ts`.

## Redis permission caching

Permissions are read from the database on every authenticated request. This
is deliberate — it makes permission changes take effect immediately, and the
query is indexed on `roleId`. If traffic grows to the point where it's a
bottleneck, add a Redis-backed cache keyed by `userId` with a short TTL.
Invalidate on role/permission change.

---

# Development Principles

## Routes

Routes handle HTTP concerns: path, method, permission gate, body/query
validation. Nothing else.

```text
Request → Route → Controller → Service → Prisma
```

## Middleware

Applied in `app.ts`, in this order:

```text
requestId            — correlation ID on every request
helmet               — security headers
cors                 — origin allowlist
express.json         — body parser (1 MB limit)
express.urlencoded   — form parser
morgan               — HTTP access log
/health              — liveness probe (before rate limit)
rateLimit            — global limiter
/api-docs            — Swagger UI (dev/test; gated in prod)
/api/v1/*            — application routes
notFoundHandler      — 404 for unmatched
errorHandler         — centralized error mapping
```

Per-route middleware:

```text
authenticate         — verifies JWT, loads permissions
requirePermission    — checks <module>.<action>
requireRole          — role-name check for admin-only operations
validateBody         — Zod parse of req.body → req.validated.body
validateQuery        — Zod parse of req.query → req.validated.query
validateParams       — Zod parse of req.params → req.validated.params
asyncHandler         — routes rejections to the error handler
upload / logoUpload  — multer with MIME + size validation
```

Validation writes to `req.validated`, leaving the raw `req.body` untouched.
Handlers read from `req.validated.body` — the distinction makes it
unambiguous whether a value came from the client or from a schema default.

## Services

Business logic, ownership checks, existence checks, transactions.

```text
Controller → Service → Prisma
```

Rules of thumb:

- **Every FK reference is validated before the write**, so a bad id gives a
  400 with the field name rather than a P2003 mapped to a generic 500.
- **Multi-row writes run in a transaction.** Where concurrent writes could
  violate an invariant (one active term per year, one teacher profile per
  user, one refresh-token rotation per token), the transaction uses
  `isolationLevel: 'Serializable'` with a small retry loop on P2034.
- **Actor identity comes from `req.user.sub`**, never from the request body.
- **Soft delete by default** for models with historical references.

## Error handling

Every error response has the same envelope:

```json
{
  "success": false,
  "message": "Human-readable summary",
  "errors": { "field": ["detail"] },
  "requestId": "..."
}
```

`errorHandler` maps known error classes to HTTP status codes:

| Error | Status |
|---|---|
| `ZodError` | 400 with field-level errors |
| `TokenExpiredError` | 401 |
| `JsonWebTokenError` | 401 |
| `MulterError` (file too large) | 413 |
| Body parser `entity.too.large` | 413 |
| Malformed JSON | 400 |
| `Prisma.PrismaClientKnownRequestError` P2002 | 409 (unique violation) |
| `Prisma.PrismaClientKnownRequestError` P2025 | 404 (not found) |
| `Prisma.PrismaClientKnownRequestError` P2003 | 409 (FK constraint) |
| `ApiError` | its own status |
| Anything else | 500 (with stack in dev) |

---

# Security Principles

Never commit:

```text
.env
JWT secrets
database passwords
private keys
production credentials
```

Never trust client input for:

```text
Actor identity (userId, teacherId, studentId, authorId)
Timestamps (createdAt, readAt, submittedAt, gradedAt)
Counters (totalClasses, examCount)
Role assignment (on self)
```

Passwords are hashed with bcrypt (12 rounds). Refresh tokens are stored
hashed with SHA-256. Authorization is enforced by the backend; the frontend
is not a security boundary.

---

# API ↔ Frontend

```text
React Frontend (high-school-admin)
http://localhost:5173
       │
       │ REST + JSON
       │ Authorization: Bearer <accessToken>
       ▼
Express API (high-school-api)
http://localhost:5000/api/v1
       │
       ▼
Prisma 7 + @prisma/adapter-pg
       │
       ▼
PostgreSQL 16
```

Every response carries `X-Request-Id`. If the frontend captures and includes
it in error reports, traces through the API logs are one grep away.

---

# Project Status

## Completed

- Express API foundation, TypeScript, Prisma 7, PostgreSQL
- Authentication: JWT access + refresh tokens with rotation and revocation
- RBAC: permission catalog, four roles, per-request DB lookup
- All primary modules: users, roles, permissions, school, academic years,
  terms, rooms, grade levels, classes, subjects, schedules, lessons,
  homework, quizzes, grades, attendance, leave requests, announcements,
  notifications, reports, languages, translations
- Auth header, request ID, error envelope, validation middleware
- Swagger docs, Docker Compose stack, seed with realistic demo data
- Role-aware quiz projection (students never see `correctAnswer`)
- Cascade delete policy (User ↔ profile)
- Serialization-conflict retry on high-contention invariants
- Pagination + filtering + sorting on list endpoints
- Centralized error mapping for Zod / Prisma / JWT / Multer errors



