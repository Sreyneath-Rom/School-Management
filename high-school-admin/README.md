# High School Management System — Frontend

A modern role-based **High School Management System** frontend built for **Varin High School**.

The application provides separate workflows for **Administrators, Teachers, and Students**, with centralized authentication, school configuration, academic management, attendance, schedules, homework, quizzes, grades, reports, and communication.

---

## 1. Technology Stack

| Technology      | Purpose                                |
| --------------- | -------------------------------------- |
| React 19        | Frontend UI                            |
| TypeScript      | Type-safe development                  |
| Vite            | Development server and build tool      |
| Tailwind CSS 4  | Styling and responsive UI              |
| React Router    | Application routing                    |
| Context API     | Authentication and theme state         |
| Redux Toolkit   | Global state management where required |
| Lucide React    | Icons                                  |
| Fetch API       | Backend communication                  |
| Express.js      | Backend REST API                       |
| MySQL / MariaDB | Database                               |

---

## 2. System Architecture

```text
┌──────────────────────────────────────────────┐
│                  Browser                     │
│                                              │
│            React + TypeScript                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 AppRoutes                    │
│                                              │
│  Public Routes       Protected Routes        │
│  └── Login           ├── Admin               │
│                      ├── Teacher             │
│                      └── Student             │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   Layouts                    │
│                                              │
│ AdminLayout | TeacherLayout | StudentLayout  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                    Pages                     │
│                                              │
│ Dashboard | Users | Classes | Subjects       │
│ Schedule | Attendance | Lessons | Homework   │
│ Quiz | Grades | Reports | Communication      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  Services                    │
│                                              │
│ authService | userService | classService     │
│ subjectService | scheduleService             │
│ attendanceService | gradeService             │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  apiClient                   │
│                                              │
│ Authorization | Refresh Token | Error Handle │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Express REST API                │
│                  /api/v1                     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                MySQL / MariaDB               │
└──────────────────────────────────────────────┘
```

---

## 3. User Roles

### Administrator

The administrator manages the entire school system.

```text
Admin
├── Dashboard
├── School Setup
├── Roles & Permissions
├── Users
├── Teachers
├── Students
├── Classes
├── Subjects
├── Schedules
├── Attendance
├── Academic Management
├── Reports
└── Communication
```

### Teacher

Teachers manage academic activities and students assigned to their classes.

```text
Teacher
├── Dashboard
├── My Classes
├── Lessons
├── Homework
├── Quiz & Tests
├── Attendance
├── Grades
└── Student Progress
```

### Student

Students can access their academic information and assigned activities.

```text
Student
├── Dashboard
├── My Classes
├── Timetable
├── Lessons
├── Homework
├── Quiz & Tests
├── Grades
└── Attendance
```

---

## 4. Project Structure

```text
src/
│
├── app/
│   ├── App.tsx
│   └── providers/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── tables/
│   ├── modals/
│   ├── charts/
│   └── ui/
│
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── data/
│   └── mock/
│
├── features/
│   ├── dashboard/
│   └── attendance/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFetch.ts
│   ├── useForm.ts
│   └── usePagination.ts
│
├── layouts/
│   ├── AdminLayout.tsx
│   ├── TeacherLayout.tsx
│   ├── StudentLayout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Footer.tsx
│
├── lib/
│   └── apiClient.ts
│
├── pages/
│   ├── auth/
│   │   └── Login.tsx
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── school/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── subjects/
│   │   ├── classes/
│   │   ├── schedules/
│   │   ├── attendance/
│   │   └── reports/
│   │
│   ├── teacher/
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── lessons/
│   │   ├── homework/
│   │   ├── quizzes/
│   │   ├── attendance/
│   │   └── grades/
│   │
│   └── student/
│       ├── dashboard/
│       ├── classes/
│       ├── timetable/
│       ├── lessons/
│       ├── homework/
│       ├── quizzes/
│       ├── grades/
│       └── attendance/
│
├── routes/
│   ├── AppRoutes.tsx
│   ├── AdminRoutes.tsx
│   ├── TeacherRoutes.tsx
│   └── StudentRoutes.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── school.service.ts
│   ├── role.service.ts
│   ├── subject.service.ts
│   ├── class.service.ts
│   ├── schedule.service.ts
│   ├── attendance.service.ts
│   ├── lesson.service.ts
│   ├── homework.service.ts
│   ├── quiz.service.ts
│   └── grade.service.ts
│
├── store/
│   └── slices/
│
├── styles/
│   └── globals.css
│
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── role.ts
│   ├── class.ts
│   ├── subject.ts
│   ├── schedule.ts
│   ├── attendance.ts
│   ├── homework.ts
│   ├── quiz.ts
│   └── grade.ts
│
└── utils/
    ├── constants.ts
    ├── validators.ts
    ├── formatters.ts
    └── rolePermissions.ts
```

---

## 5. Route Architecture

### Public Routes

```text
/login
```

### Admin Routes

```text
/dashboard

/school
/school/setup

/roles
/roles/permissions

/users
/users/:id

/teachers
/teachers/:id

/students
/students/:id

/classes
/classes/:id

/subjects

/schedules

/attendance

/reports
```

### Teacher Routes

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
```

### Student Routes

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

## 6. Authentication Flow

```text
User
 │
 ▼
Login Page
 │
 ▼
POST /auth/login
 │
 ▼
Backend validates credentials
 │
 ▼
Access Token + Refresh Token
 │
 ▼
AuthContext
 │
 ▼
localStorage
 │
 ▼
GET /auth/me
 │
 ▼
Identify User Role
 │
 ├── admin   → AdminRoutes
 ├── teacher → TeacherRoutes
 └── student → StudentRoutes
```

### Token Flow

```text
Request
   │
   ▼
apiClient
   │
   ├── Access Token exists
   │
   ▼
Authorization: Bearer <token>
   │
   ▼
API
   │
   ├── 200 → return data
   │
   └── 401
        │
        ▼
POST /auth/refresh-token
        │
        ▼
New Access Token
        │
        ▼
Retry Original Request
```

---

## 7. API Configuration

The frontend communicates with the backend through:

```text
/api/v1
```

Development proxy:

```text
Frontend
http://localhost:5173

        │
        ▼

Vite Proxy

        │
        ▼

Backend
http://localhost:5000
```

---

## 8. Environment Variables

Create a `.env` file:

```env
VITE_API_URL=/api/v1
```

If the backend runs on another server:

```env
VITE_API_URL=https://api.example.com/api/v1
```

Do not commit secrets or private credentials to `.env`.

Use `.env.example` for safe default configuration.

---

## 9. API Client

All API requests should go through:

```text
src/lib/apiClient.ts
```

Responsibilities:

```text
apiClient
├── Base URL
├── Authorization Header
├── JSON Request
├── JSON Response
├── API Error Handling
├── 401 Detection
├── Token Refresh
└── Request Retry
```

Pages should not directly implement authentication headers or token-refresh logic.

Example:

```text
Page
  ↓
Service
  ↓
apiClient
  ↓
Express API
```

---

## 10. Service Architecture

Each business domain should have its own service.

Example:

```text
pages/classes/
       │
       ▼
class.service.ts
       │
       ▼
apiClient
       │
       ▼
GET /classes
```

Recommended services:

```text
auth.service.ts
user.service.ts
school.service.ts
role.service.ts
subject.service.ts
class.service.ts
schedule.service.ts
attendance.service.ts
lesson.service.ts
homework.service.ts
quiz.service.ts
grade.service.ts
```

This keeps API logic outside UI components.

---

## 11. Feature Status

| Feature              | Status                   |
| -------------------- | ------------------------ |
| Authentication       | ✅ Implemented            |
| Role-based routing   | ✅ Implemented            |
| Admin Dashboard      | ✅ Implemented            |
| Dashboard statistics | ✅ API-backed             |
| Dashboard charts     | 🟡 Mock data             |
| School Setup         | ✅ Implemented            |
| Roles & Permissions  | ✅ Implemented            |
| User Management      | 🟡 Partially implemented |
| Subjects             | 🟡 Mock data             |
| Classes              | 🚧 Planned               |
| Schedules            | 🟡 Local state           |
| Attendance           | 🟡 Mock service          |
| Lessons              | 🚧 Planned               |
| Homework             | 🚧 Planned               |
| Quiz & Tests         | 🚧 Planned               |
| Grades               | 🚧 Planned               |
| Reports              | 🚧 Planned               |
| Communication        | 🚧 Planned               |
| Student Portal       | 🚧 Planned               |
| Teacher Portal       | 🚧 Planned               |

Legend:

```text
✅ Implemented
🟡 Partially implemented / Mock
🚧 Planned
```

---

## 12. School Academic Flow

The core academic workflow should follow this structure:

```text
School
 │
 ▼
Academic Year
 │
 ▼
Grade / Level
 │
 ▼
Class
 │
 ├── Students
 └── Teacher
       │
       ▼
    Subjects
       │
       ▼
    Schedule
       │
       ▼
    Lessons
       │
       ├── Homework
       │
       └── Quiz / Tests
              │
              ▼
            Grades
```

---

## 13. Attendance Flow

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
Attendance API
   │
   ▼
Database
```

---

## 14. Homework Flow

```text
Teacher
   │
   ▼
Select Class
   │
   ▼
Select Subject
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
Students
   │
   ▼
View Homework
   │
   ▼
Submit Assignment
   │
   ▼
Teacher Reviews
   │
   ▼
Grade / Feedback
```

---

## 15. Quiz & Test Flow

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
Student
   │
   ▼
Take Quiz
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

---

## 16. Grade Flow

```text
Teacher
   │
   ▼
Select Class
   │
   ▼
Select Subject
   │
   ▼
Select Assessment
   │
   ├── Assignment
   ├── Quiz
   ├── Midterm
   └── Final
   │
   ▼
Enter Grades
   │
   ▼
Calculate Result
   │
   ▼
Save
   │
   ▼
Student Portal
   │
   ▼
View Grades
```

---

## 17. Role-Based Permissions

Permissions should be centralized instead of being hardcoded throughout components.

Example:

```text
Admin
├── school.manage
├── users.manage
├── roles.manage
├── classes.manage
├── subjects.manage
├── schedules.manage
├── attendance.view
└── reports.view

Teacher
├── classes.view
├── lessons.manage
├── homework.manage
├── quizzes.manage
├── attendance.manage
└── grades.manage

Student
├── classes.view
├── timetable.view
├── lessons.view
├── homework.view
├── homework.submit
├── quizzes.take
├── grades.view
└── attendance.view
```

Recommended location:

```text
src/utils/rolePermissions.ts
```

---

## 18. UI Architecture

Shared UI components should be reusable across all roles.

```text
components/
├── common/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Modal
│   ├── Badge
│   └── EmptyState
│
├── tables/
│   ├── DataTable
│   ├── Pagination
│   └── TableActions
│
├── forms/
│   ├── FormInput
│   ├── FormSelect
│   └── FormDatePicker
│
├── charts/
│   ├── AttendanceChart
│   ├── GradeChart
│   └── StudentChart
│
└── users/
    ├── UserList
    ├── UserForm
    └── UserDetail
```

---

## 19. Layout Architecture

Each role should have its own navigation configuration.

```text
AdminLayout
├── Header
├── AdminSidebar
├── Main Content
└── Footer

TeacherLayout
├── Header
├── TeacherSidebar
├── Main Content
└── Footer

StudentLayout
├── Header
├── StudentSidebar
├── Main Content
└── Footer
```

Do not expose administrator navigation items to teachers or students.

---

## 20. State Management

Authentication currently uses:

```text
AuthContext
```

Theme management uses:

```text
ThemeContext
```

Redux Toolkit is available for application-wide state where necessary.

Avoid maintaining the same state in both Context and Redux.

Recommended rule:

```text
Authentication
      ↓
AuthContext

Theme
      ↓
ThemeContext

Server/API Data
      ↓
Services + local component state

Complex Global UI State
      ↓
Redux Toolkit
```

If Redux is adopted for authentication later, remove the unused authentication implementation from Context rather than maintaining two sources of truth.

---

## 21. Path Alias

The project uses:

```text
@/*
```

for:

```text
src/*
```

Example:

```typescript
import { Button } from "@/components/common/Button";
```

instead of:

```typescript
import { Button } from "../../../components/common/Button";
```

---

## 22. Development

Install dependencies:

```bash
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

The backend should be running before testing API-dependent features.

---

## 23. Production Build

Build the application:

```bash
npm run build
```

The build performs:

```text
TypeScript Check
      ↓
Vite Build
      ↓
Production Bundle
```

Preview the production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

---

## 24. Recommended Development Rules

### Components

Keep components small and reusable.

Avoid putting API requests directly inside large UI components.

### Services

Keep API calls inside domain-specific services.

### Types

Every API response and important entity should have a TypeScript type.

### Forms

Use shared validation and reusable form components.

### Tables

Use one reusable table component for common list pages.

### Permissions

Always check permissions before rendering restricted actions.

### API Errors

Show user-friendly error messages instead of raw backend errors.

### Loading States

Every API-dependent page should handle:

```text
Loading
Success
Empty
Error
```

---

## 25. Known Gaps

### Teacher and Student Sidebars

Teacher and Student layouts must not use the full Admin sidebar.

Recommended solution:

```text
Sidebar
├── AdminSidebar
├── TeacherSidebar
└── StudentSidebar
```

or dynamically filter menu items using the authenticated role.

---

### Login Identifier

If the UI says:

```text
Student ID or Email
```

the backend and validation should support both formats.

If only email is supported, change the UI label to:

```text
Email
```

---

### Duplicate Authentication State

The application should have one authentication source of truth.

Current:

```text
AuthContext
+
Redux authSlice
```

Recommended:

```text
AuthContext
```

or migrate completely to Redux.

Do not maintain both.

---

### Mock Data

The following areas still require API integration:

```text
Subjects
Attendance
Users
Schedules
Dashboard Charts
```

Replace mock services gradually as backend endpoints become available.

---

## 26. Development Roadmap

### Phase 1 — Foundation

```text
[x] Authentication
[x] Role-based routing
[x] Admin layout
[x] Dashboard
[x] School setup
[x] Roles & permissions
```

### Phase 2 — Administration

```text
[ ] User management
[ ] Teacher management
[ ] Student management
[ ] Class management
[ ] Subject management
[ ] Schedule management
```

### Phase 3 — Academic Management

```text
[ ] Lessons
[ ] Homework
[ ] Quiz & Tests
[ ] Grades
[ ] Student progress
```

### Phase 4 — Student & Teacher Portals

```text
[ ] Teacher dashboard
[ ] Teacher class management
[ ] Student dashboard
[ ] Student timetable
[ ] Student assignments
[ ] Student grades
```

### Phase 5 — Reports & Communication

```text
[ ] Attendance reports
[ ] Grade reports
[ ] Student performance reports
[ ] Announcements
[ ] Notifications
[ ] Communication
```

---

## 27. Recommended Final Architecture

The final application should follow:

```text
                    HIGH SCHOOL MANAGEMENT SYSTEM
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
           ADMIN            TEACHER           STUDENT
             │                 │                 │
             ▼                 ▼                 ▼
        Management         Academic          Learning
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                         REST API /v1
                               │
                               ▼
                         Express Backend
                               │
                               ▼
                          MySQL Database
```

The frontend should remain responsible for:

```text
UI
Routing
Role Permissions
Form Validation
User Interaction
API Communication
Loading / Error States
```

The backend should remain responsible for:

```text
Authentication
Authorization
Business Rules
Data Validation
Database Operations
File Management
Reports
Security
```

---

## 28. Important Security Notes

Never commit:

```text
.env
API secrets
Database passwords
Private keys
Production credentials
Real user passwords
```

Development credentials should only be used for local development.

If seed credentials are documented, use a development-only account and change the password before deployment.

---

## 29. Project Goal

The goal of this project is to provide a centralized digital platform for managing high school operations and academic activities.

The system will allow:

```text
Administrators
    ↓
Manage School

Teachers
    ↓
Manage Teaching & Assessment

Students
    ↓
Access Learning & Academic Information
```

The final system should provide a clear, secure, maintainable, and scalable architecture that can support additional school modules in the future.
