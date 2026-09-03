# High School Management System — API

REST API backend for the High School Management System.

Built with **Express.js, TypeScript, Prisma 7, and PostgreSQL**.

The API provides authentication, role-based access control, school management, academic management, attendance, lessons, homework, quizzes, grades, and reporting functionality.

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
| Zod / validation | Request validation |
| Multer           | File uploads       |

---

# Architecture

```text
Client
  │
  ▼
Express Router
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Authorization
  ├── Validation
  ├── Rate Limiting
  └── Upload Validation
  │
  ▼
Routes
  │
  ▼
Services
  │
  ▼
Prisma 7
  │
  ▼
PostgreSQL
```

---

# Project Structure

```text
high-school-api/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   ├── controllers/
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── roles.routes.ts
│   │   ├── school.routes.ts
│   │   ├── classes.routes.ts
│   │   ├── subjects.routes.ts
│   │   ├── schedules.routes.ts
│   │   ├── attendance.routes.ts
│   │   ├── lessons.routes.ts
│   │   ├── homework.routes.ts
│   │   ├── quizzes.routes.ts
│   │   └── grades.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── roles.service.ts
│   │   ├── school.service.ts
│   │   ├── classes.service.ts
│   │   ├── subjects.service.ts
│   │   ├── schedules.service.ts
│   │   ├── attendance.service.ts
│   │   ├── lessons.service.ts
│   │   ├── homework.service.ts
│   │   ├── quizzes.service.ts
│   │   └── grades.service.ts
│   │
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── docker-compose.yml
├── prisma.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# Requirements

Install the following:

```text
Node.js
npm
PostgreSQL
Docker (optional)
```

Recommended:

```text
Node.js 20+
PostgreSQL 16+
```

---

# Local Development

Clone the project and enter the API directory:

```bash
cd high-school-api
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Configure the database and application secrets in `.env`.

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npm run prisma:migrate
```

If the seed was not executed automatically:

```bash
npx prisma db seed
```

Start development server:

```bash
npm run dev
```

API:

```text
http://localhost:5000
```

---

# Important: Prisma 7

This project uses **Prisma 7**.

The project uses:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

The generated client is imported from:

```ts
import { PrismaClient } from "@/generated/prisma/client";
```

The datasource URL is configured through:

```text
prisma.config.ts
```

rather than directly in `schema.prisma`.

Prisma 7 also requires a driver adapter.

This project uses:

```text
@prisma/adapter-pg
```

Database initialization is handled in:

```text
src/config/database.ts
```

---

# Environment Variables

Example:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/high_school_db

JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173

UPLOAD_PATH=uploads
MAX_UPLOAD_MB=10

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300

EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
```

Never commit real secrets.

---

# API URLs

Base API:

```text
http://localhost:5000/api/v1
```

Health check:

```text
http://localhost:5000/health
```

Swagger documentation:

```text
http://localhost:5000/api-docs
```

---

# Authentication

Authentication uses JWT access and refresh tokens.

```text
POST /api/v1/auth/login
```

Login flow:

```text
Client
  │
  ▼
POST /auth/login
  │
  ├── accessToken
  └── refreshToken
        │
        ▼
    Client stores session
        │
        ▼
Authorization: Bearer <accessToken>
```

---

# Refresh Tokens

Refresh tokens are:

* Hashed before storage
* Stored in the `RefreshToken` table
* Rotated on use
* Revoked during logout
* Revoked when passwords are changed

This prevents previously issued refresh tokens from remaining permanently valid.

---

# Authentication Endpoints

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me

POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

Password reset is currently a stub and requires:

```text
passwordResetTokenHash
passwordResetExpiresAt
```

plus email delivery before production use.

---

# Role-Based Access Control

The API uses permission strings:

```text
<module>.<action>
```

Supported actions:

```text
view
create
edit
delete
```

Examples:

```text
users.view
users.create
users.edit
users.delete

classes.view
classes.create
classes.edit
classes.delete

subjects.view
subjects.create
subjects.edit
subjects.delete

grades.view
grades.create
grades.edit
```

---

# Roles

The seed creates three roles:

```text
admin
teacher
student
```

## Admin

Full system access.

## Teacher

Classroom-facing permissions such as:

```text
classes
lessons
homework
quizzes
attendance
grades
```

## Student

View and submission permissions such as:

```text
classes.view
lessons.view
homework.view
homework.submit
quizzes.view
quizzes.take
grades.view
attendance.view
```

---

# Permission Checking

Permissions are loaded from the database during authenticated requests.

Example:

```text
GET /grades
       │
       ▼
Authenticate user
       │
       ▼
Load role
       │
       ▼
Load permissions
       │
       ▼
Check grades.view
       │
       ▼
Allow / Reject request
```

Permission changes therefore take effect immediately.

If traffic becomes large, permissions can later be cached using Redis.

---

# Main API Modules

```text
Auth
Users
Roles
School
Academic Years
Terms
Grades / Levels
Classes
Subjects
Schedules
Attendance
Lessons
Homework
Quizzes
Grades
Reports
```

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
Class
   │
   ├── Students
   ├── Teachers
   └── Subjects
          │
          ▼
       Schedule
          │
          ▼
       Lessons
          │
          ├── Homework
          └── Quizzes
                 │
                 ▼
               Grades
```

---

# Attendance Flow

```text
Teacher
   │
   ▼
Select Class
   │
   ▼
Select Date
   │
   ▼
Load Students
   │
   ▼
Mark Attendance
   │
   ├── Present
   ├── Absent
   ├── Late
   └── Permission
   │
   ▼
Submit
   │
   ▼
API
   │
   ▼
PostgreSQL
```

---

# Homework Flow

```text
Teacher
   │
   ▼
Select Class + Subject
   │
   ▼
Create Homework
   │
   ├── Title
   ├── Description
   ├── Materials
   ├── Due Date
   └── Status
   │
   ▼
Publish
   │
   ▼
Students View
   │
   ▼
Student Submission
   │
   ▼
Teacher Review
   │
   ▼
Grade + Feedback
```

---

# Quiz Flow

```text
Teacher
   │
   ▼
Create Quiz
   │
   ├── Title
   ├── Subject
   ├── Class
   ├── Questions
   ├── Duration
   └── Schedule
   │
   ▼
Publish
   │
   ▼
Student Takes Quiz
   │
   ▼
Submit
   │
   ▼
Evaluate
   │
   ▼
Result
   │
   ▼
Grade
```

## Quiz Security

Students must never receive:

```text
correctAnswer
```

before completing the quiz.

Teacher/admin responses may include answer keys, but student responses should return only the information required to take the quiz.

---

# File Uploads

Uploads are validated by:

```text
MIME type
File size
```

Current upload configuration:

```env
UPLOAD_PATH=uploads
MAX_UPLOAD_MB=10
```

Production deployments should add antivirus/content scanning.

Recommended:

```text
ClamAV
```

This is particularly important for:

```text
Lesson materials
Homework attachments
Homework submissions
```

---

# Database

Database:

```text
PostgreSQL
```

Example:

```text
high_school_db
```

Prisma schema:

```text
prisma/schema.prisma
```

Migrations:

```text
prisma/migrations/
```

Generate client:

```bash
npx prisma generate
```

Create development migration:

```bash
npm run prisma:migrate
```

Deploy migrations:

```bash
npx prisma migrate deploy
```

Seed:

```bash
npx prisma db seed
```

---

# Seed Data

The seed creates:

```text
Permission catalog
Admin role
Teacher role
Student role
Admin user
```

Development admin account:

```text
Email:
admin@school.local

Password:
ChangeMe123!
```

**Change this password immediately for any real deployment.**

---

# Docker

Start all services:

```bash
docker compose up --build
```

Services:

```text
API
PostgreSQL
pgAdmin
Nginx
```

Default development endpoints:

```text
API
http://localhost:5000

Swagger
http://localhost:5000/api-docs

Health
http://localhost:5000/health

pgAdmin
http://localhost:5050

Nginx
http://localhost
```

Run migrations inside the API container:

```bash
docker compose exec api npx prisma migrate deploy
```

The API container uses the PostgreSQL service name rather than `localhost`.

```text
api
 │
 └── DATABASE_URL
          │
          ▼
      postgres
```

---

# Build

Generate Prisma Client:

```bash
npx prisma generate
```

Build the API:

```bash
npm run build
```

The build also copies required Prisma non-TypeScript assets.

---

# Production Checklist

Before production:

```text
[ ] Change default admin password
[ ] Use strong JWT secrets
[ ] Configure production DATABASE_URL
[ ] Configure CORS
[ ] Configure email service
[ ] Enable HTTPS
[ ] Add file antivirus scanning
[ ] Review rate limits
[ ] Verify database backups
[ ] Remove development credentials
[ ] Protect Swagger if necessary
[ ] Verify quiz answer security
[ ] Implement password reset
[ ] Run production migrations
```

---

# Known Gaps

## Password Reset

Currently stubbed.

Required:

```text
passwordResetTokenHash
passwordResetExpiresAt
```

and an email delivery service.

---

## File Scanning

Current upload middleware validates:

```text
MIME type
File size
```

but does not scan the file contents.

Production should add antivirus scanning.

---

## Quiz Answer Exposure

`GET /quizzes/:id` must be role-aware.

Teachers/admins may receive:

```text
correctAnswer
```

Students must not.

---

## Billing

Fee/billing functionality is not currently implemented.

A future module can follow the existing architecture:

```text
routes
   ↓
services
   ↓
Prisma
   ↓
PostgreSQL
```

Example:

```text
billing
├── fees
├── invoices
├── payments
└── reports
```

---

# Development Principles

## Routes

Routes handle HTTP concerns.

```text
Request
 ↓
Route
```

## Middleware

Middleware handles:

```text
Authentication
Authorization
Validation
Rate limiting
File validation
Errors
```

## Services

Business logic belongs in services.

```text
Route
 ↓
Service
 ↓
Prisma
```

Avoid putting large business rules directly inside routes.

---

# Error Handling

API errors should return consistent responses.

Example:

```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

Validation errors should clearly identify invalid fields.

---

# Security Principles

Never commit:

```text
.env
JWT secrets
database passwords
private keys
production credentials
user passwords
```

Passwords must always be securely hashed.

Refresh tokens must never be stored as plaintext.

Authorization must always be enforced by the backend.

The frontend should never be treated as a security boundary.

---

# API ↔ Frontend

The frontend project is:

```text
high-school-admin
```

The backend project is:

```text
high-school-api
```

Communication:

```text
React Frontend
http://localhost:5173
       │
       │ REST API
       ▼
Express API
http://localhost:5000/api/v1
       │
       ▼
Prisma 7
       │
       ▼
PostgreSQL
```

---

# Project Status

## Completed

* Express API foundation
* TypeScript
* Prisma 7 migration
* PostgreSQL integration
* Authentication
* JWT access tokens
* Refresh tokens
* RBAC
* Permission catalog
* Admin / Teacher / Student roles
* School setup
* Roles & permissions
* API documentation
* Docker configuration

## Partial

* Password reset
* File security
* Quiz security hardening

## Planned

* Fee / Billing
* Advanced Reports
* Communication
* Additional production security
* Redis permission caching if required

---

# License

This project is developed for school management and educational administration.
