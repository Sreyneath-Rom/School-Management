# High School Management System — Frontend

A modern web-based High School Management System frontend built with React, TypeScript, Vite, Tailwind CSS, and React Router.

The system provides separate interfaces for **Administrators, Teachers, and Students**, with role-based navigation, permissions, authentication, academic management, attendance, lessons, homework, quizzes, and grades.

---

## Tech Stack

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| React 19        | UI framework                          |
| TypeScript      | Type safety                           |
| Vite            | Development/build tool                |
| Tailwind CSS 4  | Styling                               |
| React Router    | Routing                               |
| Context API     | Authentication and application state  |
| Redux Toolkit   | Complex global UI state when required |
| Lucide React    | Icons                                 |
| Fetch API       | HTTP communication                    |
| React Hook Form | Form management                       |
| Zod             | Validation                            |

---

## Architecture

```text
Browser
   │
   ▼
AppRoutes
   │
   ├── Login
   │
   ├── AdminRoutes
   │      └── AdminLayout
   │
   ├── TeacherRoutes
   │      └── TeacherLayout
   │
   └── StudentRoutes
          └── StudentLayout
                │
                ▼
              Pages
                │
                ▼
             Services
                │
                ▼
             apiClient
                │
                ▼
        Express REST API
                │
                ▼
             Prisma 7
                │
                ▼
           PostgreSQL
```

---

## Project Structure

```text
high-school-admin/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   └── App.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── charts/
│   │   └── users/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── TeacherLayout.tsx
│   │   └── StudentLayout.tsx
│   │
│   ├── lib/
│   │   └── apiClient.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard/
│   │   │   ├── School/
│   │   │   ├── People/
│   │   │   ├── Academics/
│   │   │   ├── Attendance/
│   │   │   ├── Reports/
│   │   │   └── Communication/
│   │   │
│   │   ├── teacher/
│   │   │   ├── Dashboard/
│   │   │   ├── Classes/
│   │   │   ├── Lessons/
│   │   │   ├── Homework/
│   │   │   ├── Quizzes/
│   │   │   ├── Attendance/
│   │   │   └── Grades/
│   │   │
│   │   └── student/
│   │       ├── Dashboard/
│   │       ├── Classes/
│   │       ├── Timetable/
│   │       ├── Lessons/
│   │       ├── Homework/
│   │       ├── Quizzes/
│   │       ├── Grades/
│   │       └── Attendance/
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── AdminRoutes.tsx
│   │   ├── TeacherRoutes.tsx
│   │   └── StudentRoutes.tsx
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── role.service.ts
│   │   ├── school.service.ts
│   │   ├── academicYear.service.ts
│   │   ├── term.service.ts
│   │   ├── grade.service.ts
│   │   ├── class.service.ts
│   │   ├── subject.service.ts
│   │   ├── schedule.service.ts
│   │   ├── attendance.service.ts
│   │   ├── lesson.service.ts
│   │   ├── homework.service.ts
│   │   ├── quiz.service.ts
│   │   └── gradebook.service.ts
│   │
│   ├── store/
│   │
│   ├── styles/
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── school.ts
│   │   ├── academic.ts
│   │   ├── attendance.ts
│   │   ├── homework.ts
│   │   ├── quiz.ts
│   │   └── grade.ts
│   │
│   └── utils/
│       ├── rolePermissions.ts
│       ├── errors.ts
│       └── validation.ts
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# User Roles

## Administrator

Administrators manage the entire school system.

```text
Dashboard

School
├── School Profile
├── Academic Years
└── Terms

People
├── Users
├── Teachers
├── Students
└── Roles & Permissions

Academics
├── Grades / Levels
├── Classes
├── Subjects
└── Schedules

Attendance
├── Attendance
└── Attendance Reports

Reports
├── Academic Reports
└── Student Reports

Communication
├── Announcements
└── Notifications

Settings
```

---

## Teacher

Teachers manage classroom activities and student assessment.

```text
Dashboard

Teaching
├── My Classes
├── Lessons
├── Homework
└── Quizzes & Tests

Assessment
├── Attendance
├── Grades
└── Student Progress
```

---

## Student

Students access their academic information and learning activities.

```text
Dashboard

Learning
├── My Classes
├── Timetable
├── Lessons
├── Homework
└── Quizzes & Tests

Academic
├── Grades
└── Attendance
```

---

# Authentication

Authentication is handled through the backend API.

```text
Login
  │
  ▼
POST /api/v1/auth/login
  │
  ├── accessToken
  └── refreshToken
        │
        ▼
   AuthContext
        │
        ▼
GET /api/v1/auth/me
        │
        ▼
User + Role + Permissions
        │
        ▼
Role-specific application
```

The frontend stores the authentication state and sends the access token with API requests.

---

# API Configuration

Create a `.env` file:

```env
VITE_API_URL=/api/v1
```

During development, Vite proxies API requests to:

```text
http://localhost:5000
```

Example:

```text
Frontend
http://localhost:5173

API
http://localhost:5000

API Base
http://localhost:5000/api/v1
```

---

# API Client

All API communication should go through:

```text
src/lib/apiClient.ts
```

Services should use the API client instead of calling `fetch()` directly inside pages.

Example:

```text
Page
  ↓
user.service.ts
  ↓
apiClient.ts
  ↓
GET /api/v1/users
```

This keeps API communication centralized and maintainable.

---

# Role-Based Permissions

Permissions use the following format:

```text
<module>.<action>
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

grades.view
grades.create
grades.edit
```

The frontend uses permissions to control UI visibility.

The backend remains the final authority for authorization.

---

# Academic Structure

The academic workflow follows:

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

# Main Features

## Authentication

* Login
* Logout
* Session validation
* Access token handling
* Refresh token handling
* Role detection
* Permission-based UI

## School Management

* School profile
* Academic years
* Terms
* School configuration

## User Management

* Users
* Teachers
* Students
* Roles
* Permissions

## Academic Management

* Grades / levels
* Classes
* Subjects
* Schedules

## Attendance

* View attendance
* Mark attendance
* Present
* Absent
* Late
* Permission

## Lessons

* Create lessons
* View lessons
* Lesson materials

## Homework

* Create homework
* Publish homework
* View assignments
* Submit homework
* Review submissions
* Grade submissions

## Quizzes & Tests

* Create quizzes
* Add questions
* Schedule quizzes
* Publish quizzes
* Student submissions
* Results

> Quiz answers must never expose `correctAnswer` to students.

## Grades

Supported assessments:

```text
Assignment
Quiz
Midterm
Final
```

---

# Routes

## Public

```text
/login
```

## Admin

```text
/admin/dashboard
/admin/school
/admin/school/academic-years
/admin/school/terms

/admin/users
/admin/users/:id

/admin/teachers
/admin/teachers/:id

/admin/students
/admin/students/:id

/admin/roles
/admin/roles/permissions

/admin/grades
/admin/classes
/admin/classes/:id
/admin/subjects
/admin/schedules

/admin/attendance
/admin/attendance/reports

/admin/reports/academic
/admin/reports/students

/admin/communication/announcements
/admin/communication/notifications
```

## Teacher

```text
/teacher/dashboard
/teacher/classes
/teacher/classes/:id
/teacher/lessons
/teacher/lessons/create
/teacher/homework
/teacher/homework/create
/teacher/quizzes
/teacher/quizzes/create
/teacher/attendance
/teacher/grades
/teacher/progress
```

## Student

```text
/student/dashboard
/student/classes
/student/timetable
/student/lessons
/student/homework
/student/quizzes
/student/grades
/student/attendance
```

---

# Development

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

---

# Frontend Development Rules

### 1. Keep pages focused on UI

Do not put API requests directly into large page components.

Use:

```text
Page
 ↓
Service
 ↓
apiClient
```

### 2. Reuse components

Use shared components for:

```text
Button
Input
Select
Modal
Badge
Table
Pagination
Form
Loading
EmptyState
ErrorState
```

### 3. Type API responses

Avoid:

```ts
const data: any = ...
```

Prefer:

```ts
const data: User[] = ...
```

### 4. Handle all UI states

Every API-driven page should support:

```text
Loading
Success
Empty
Error
```

### 5. Do not duplicate authentication state

Use `AuthContext` as the primary authentication source.

Avoid maintaining separate authentication state in both:

```text
AuthContext
+
Redux authSlice
```

unless there is a specific architectural reason.

---

# Security

Do not commit:

```text
.env
.env.local
API secrets
JWT secrets
private keys
production credentials
passwords
```

Use `.env.example` for safe configuration templates.

The frontend must never be trusted for security-sensitive authorization decisions.

---

# Backend Dependency

The frontend requires the High School Management API to be running.

```text
high-school-admin
        │
        │ HTTP
        ▼
high-school-api
        │
        ▼
    PostgreSQL
```

Start the backend first:

```bash
npm run dev
```

Then start the frontend:

```bash
npm run dev
```

---

# Project Status

## Completed

* Authentication
* Role-based routing
* Admin dashboard
* Dashboard API integration
* School setup
* Roles & permissions

## In Progress

* User management
* Subjects
* Schedules
* Attendance
* Dashboard charts

## Planned

* Classes
* Lessons
* Homework
* Quizzes & Tests
* Grades
* Reports
* Communication
* Teacher Portal
* Student Portal

---

# License

This project is developed for school management and educational administration.
