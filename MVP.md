# High School Management System — MVP

The repository now includes a usable admin MVP for the core school operations workflow described in the use-case document. The requirements are maintained in [`docs/USE_CASES.md`](docs/USE_CASES.md), including explicit CRUD use cases, preconditions, postconditions, permission mapping, and core security rules.

## Included workflow

The admin portal provides role-aware navigation and working screens for:

- Authentication and demo role sign-in
- Dashboard metrics, attendance trend, enrollment summary, announcements, activities, and leave requests
- Student roster management with search/filtering, create/edit/deactivate/delete, bulk status changes, details, and CSV export
- Academic setup for years, terms, subjects, classes, rooms, and schedules
- Attendance overview and student attendance operations
- Lessons, homework, quizzes, exams, grades, and report-card routes
- Teacher management and assignments
- Reports and communication screens

The dashboard now exposes four high-frequency MVP actions—**Enroll student**, **Take attendance**, **Manage classes**, and **Enter grades**—as direct links into the core workflow.

## Run locally

```bash
npm install --ignore-scripts
npm run dev
```

The frontend is served at `http://localhost:3000`.

## Build verification

```bash
npm run build
```

The frontend build passes with TypeScript and Vite, and the backend TypeScript/Prisma build passes after generating the Prisma client. A normal workspace install may attempt to download Prisma engines for the API; in restricted network environments, `--ignore-scripts` allows dependencies to install before running `npx prisma generate` with a configured `DATABASE_URL`.

## Production follow-up

The API and Prisma schema are already included in `high-school-api`. Before production use, configure PostgreSQL, run Prisma generation/migrations, seed the database, and point the admin app’s API base URL at the deployed Express service. Backend authorization remains the security boundary; the frontend role navigation is for user experience only.
