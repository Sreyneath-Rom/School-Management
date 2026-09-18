# Admin Sidebar Implementation Order

This is the implementation contract for the admin frontend. Work from top to bottom so every sidebar item has a persistent API resource before the next dependent screen is built.

## 1. Setup

| Sidebar item | Frontend | Backend status | Required work |
| --- | --- | --- | --- |
| School Setup | `high-school-admin-UI/src/pages/Setup/SchoolSetup.tsx` | Persistent `School` CRUD exists | Finish form field validation and logo/upload error states. |
| Academic Years | `pages/Setup/AcademicYears.tsx` | Local fixture only | Add `AcademicYear` Prisma model, CRUD routes, service, and migration. |
| Grade Levels | `pages/Setup/GradeLevels.tsx` | Local fixture only | Add `GradeLevel` model and CRUD; reference it from classes. |
| Terms | `pages/Setup/Terms.tsx` | Local fixture only | Add `Term` model scoped to an academic year; enforce one active term. |
| Subjects | `features/setup/subjects` | Persistent CRUD exists | Add persisted credits, weekly hours, grade level, and teacher assignments; current API strips those fields. |
| Rooms | `pages/Setup/Rooms.tsx` | Local fixture only | Add `Room` model and CRUD; reference rooms from schedules. |
| Roles & Permissions | `features/setup/roles` | Persistent CRUD exists | Verify permission seeding and add integration tests for assignment updates. |
| Users | `features/setup/users` | Persistent CRUD exists | Search, role, status, class, and department filters are connected. |
| Translations | `features/setup/translations` | Persistent CRUD exists | Add language deletion protection when translations or users depend on it. |

## 2. Academic

Classes, subjects, schedules, lessons, homework, quizzes, and grades already have modular API routes. Each frontend screen must use its service for list, create, update, and delete; local fixture fallback should be removed after the corresponding API contract is verified.

Required dependency order:

1. Classes and subjects.
2. Teacher-subject and class-subject assignment.
3. Rooms and schedules.
4. Lessons, homework, and quizzes.
5. Grades and report-card aggregation.

## 3. Exams

Exam list, schedules, mark entry, and report cards need one shared exam model and transaction boundaries for marks. Mark entry must reject students outside the exam class and prevent duplicate marks for the same exam/student/subject tuple.

## 4. Students and teachers

Student and teacher CRUD is persistent. Attendance and leave requests must reference those records by ID and must never use display names as identifiers. Profile and assignment pages should consume the same service responses as the list pages.

## 5. Communication, calendar, and reports

Finance, library, transport, hostel, and inventory are intentionally excluded from this application. Their frontend pages and backend routes have been removed.

Announcements, notifications, messages, calendar, and reports should then be connected to those durable resources. Remove `mockData.ts` and `attendanceMockData.ts` only after the relevant screen has a loading, empty, error, and mutation state.

## Definition of done for each sidebar item

1. A Prisma model and migration exist for durable data.
2. API routes provide authenticated list/get/create/update/delete operations where applicable.
3. Zod validation rejects empty or invalid payloads.
4. Frontend service types match the API response exactly.
5. The page loads from the API and handles loading, empty, error, and success states.
6. Create, edit, delete, and any domain action refresh local state from the API response.
7. An API test covers the permission boundary and the primary mutation.
