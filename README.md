# High School Management System

A full-stack school management platform with separate role-based web applications for administrators, teachers, and students, backed by an Express REST API and PostgreSQL database.

## Applications

| Application | Purpose | Development command |
| --- | --- | --- |
| `high-school-admin-UI` | School administration, users, roles, setup, academics, attendance, reports, and communication | `npm run dev:admin` |
| `high-school-teacher-UI` | Classes, lessons, homework, quizzes, grades, attendance, and teacher communication | `npm run dev:teacher` |
| `high-school-student-UI` | Student dashboard, classes, calendar, lessons, homework, quizzes, grades, and attendance | `npm run dev:student` |
| `high-school-api` | Authentication, authorization, school data, academic workflows, reports, uploads, and integrations | `npm run dev:api` |

## Technology

### Frontend

- React 19 and TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API and Redux Toolkit
- React Hook Form and Zod
- Fetch-based API client with access-token refresh

### Backend

- Node.js and Express
- TypeScript
- Prisma 7 with the PostgreSQL adapter
- PostgreSQL 16
- JWT access and refresh tokens
- Zod validation
- Helmet, CORS, rate limiting, Morgan, and Winston logging
- Swagger API documentation

## Architecture

```text
Administrator UI ─┐
Teacher UI       ─┼── Vite proxy ── Express API ── Services ── Prisma ── PostgreSQL
Student UI       ─┘                    │
                                       ├── JWT authentication and RBAC
                                       ├── Request validation and error handling
                                       ├── File uploads at /uploads
                                       └── Swagger documentation at /api-docs
```

All frontend applications use the same API contract. In development, requests to `/api` are proxied to `http://localhost:5000`; the API base path is `/api/v1`.

## Repository Structure

```text
School-Management/
├── high-school-admin-UI/       # Administrator frontend
├── high-school-teacher-UI/     # Teacher frontend
├── high-school-student-UI/     # Student frontend
├── high-school-api/             # Express and Prisma backend
├── .env.example                 # Shared environment template
├── package.json                 # Root workspace commands
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 16 or Docker Desktop

## Local Setup

Install all workspace dependencies from the repository root:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Set at least these values in `.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/high_school_db
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

Generate the Prisma client, apply migrations, and seed development data:

```bash
npm run prisma:generate --workspace=high-school-api
npm run prisma:migrate --workspace=high-school-api
npm run prisma:seed --workspace=high-school-api
```

Start the API:

```bash
npm run dev:api
```

Start one frontend in a second terminal:

```bash
npm run dev:admin
# or: npm run dev:teacher
# or: npm run dev:student
```

The selected frontend runs at `http://localhost:3000`. The API runs at `http://localhost:5000`.

The three frontend scripts use port `3000` by default, so run one frontend at a time unless you assign another Vite port.

## Docker Setup

The API directory includes Docker Compose services for PostgreSQL, the API, pgAdmin, and Nginx.

```bash
cd high-school-api
cp ../.env.example .env
docker compose up --build
```

Services:

- API: `http://localhost:5000`
- API health check: `http://localhost:5000/health`
- Swagger: `http://localhost:5000/api-docs`
- pgAdmin: `http://localhost:5050`
- Nginx: `http://localhost`
- PostgreSQL: `localhost:5432`

## Root Commands

```bash
npm run dev                 # Start the administrator UI
npm run dev:admin           # Start the administrator UI
npm run dev:teacher         # Start the teacher UI
npm run dev:student         # Start the student UI
npm run dev:api             # Start the API in watch mode
npm run build               # Build all workspaces
npm run lint                # Lint all workspaces
npm run test                # Run API tests
```

API-specific commands can also be run from `high-school-api`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run build
npm run start
npm run test
```

## API Flow

Authentication endpoints are mounted below `/api/v1/auth`:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Other API modules include users, roles, permissions, schools, students, teachers, classes, subjects, schedules, lessons, homework, quizzes, grades, attendance, leaves, announcements, notifications, languages, translations, and reports.

Successful responses use an envelope like:

```json
{
  "success": true,
  "data": {}
}
```

The frontend API client attaches bearer tokens, refreshes expired access tokens, unwraps the response envelope, and preserves API errors for the calling feature to display.

## Frontend Mock Mode

The real API is used by default. To work on a UI without starting the backend, enable the Vite mock middleware explicitly:

```bash
VITE_USE_MOCK_API=true npm run dev:admin
```

Use the corresponding workspace command for the teacher or student UI. Mock mode is intended for UI-only work and should be disabled when testing API integration.

## Configuration

Common variables are documented in `.env.example`, including database credentials, JWT secrets, CORS, uploads, rate limiting, email, Redis, and `VITE_API_URL`.

Frontend development proxy target can be changed with:

```bash
VITE_API_PROXY_TARGET=http://localhost:5000 npm run dev:admin
```

For a deployed frontend, set `VITE_API_URL` to the public API base URL, including `/api/v1`.

## Security Notes

- Replace all development JWT secrets before deployment.
- Set `CORS_ORIGIN` to the exact deployed frontend origin.
- Do not enable mock mode in production.
- Do not commit `.env`, database credentials, uploaded files, or generated logs.
- Change seeded development passwords immediately.
