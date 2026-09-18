import { Router } from 'express'

// -----------------------------------------------------------------------------
// Module imports — every router below is mounted exactly once, at its natural
// path. Do not create aggregate routers that re-mount these elsewhere; that
// pattern caused duplicate reachability in an earlier version of this file.
// -----------------------------------------------------------------------------
import authRoutes from '@/modules/auth/auth.routes'
import usersRoutes from '@/modules/users/users.routes'
import rolesRoutes from '@/modules/roles/roles.routes'
import permissionsRoutes from '@/modules/permissions/permissions.routes'

import dashboardRoutes from '@/modules/dashboard/dashboard.routes'
import schoolRoutes from '@/modules/school/school.routes'
import academicYearsRoutes from '@/modules/academicYears/academicYears.routes'
import roomsRoutes from '@/modules/rooms/rooms.routes'
import gradeLevelsRoutes from '@/modules/gradeLevels/gradeLevels.routes'
import termsRoutes from '@/modules/terms/terms.routes'

import studentsRoutes from '@/modules/students/students.routes'
import teachersRoutes from '@/modules/teachers/teachers.routes'

import classesRoutes from '@/modules/classes/classes.routes'
import subjectsRoutes from '@/modules/subjects/subjects.routes'
import schedulesRoutes from '@/modules/schedules/schedules.routes'
import lessonsRoutes from '@/modules/lessons/lessons.routes'
import homeworkRoutes from '@/modules/homework/homework.routes'
import quizzesRoutes from '@/modules/quizzes/quizzes.routes'

import examsRoutes from '@/modules/exams/exams.routes'
import gradesRoutes from '@/modules/grades/grades.routes'

import attendanceRoutes from '@/modules/attendance/attendance.routes'
import leaveRequestsRoutes from '@/modules/leaveRequests/leaveRequests.routes'

import announcementsRoutes from '@/modules/announcements/announcements.routes'
import notificationsRoutes from '@/modules/notifications/notifications.routes'

import reportsRoutes from '@/modules/reports/reports.routes'

import languagesRoutes from '@/modules/languages/languages.routes'
import translationsRoutes from '@/modules/translations/translations.routes'

const router = Router()

// 1. Auth & RBAC
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/roles', rolesRoutes)
router.use('/permissions', permissionsRoutes)

// 2. Administration
router.use('/dashboard', dashboardRoutes)
router.use('/schools', schoolRoutes)
router.use('/academic-years', academicYearsRoutes)
router.use('/rooms', roomsRoutes)
router.use('/grade-levels', gradeLevelsRoutes)
router.use('/terms', termsRoutes)

// 3. People
router.use('/students', studentsRoutes)
router.use('/teachers', teachersRoutes)

// 4. Academics
router.use('/classes', classesRoutes)
router.use('/subjects', subjectsRoutes)
router.use('/schedules', schedulesRoutes)
router.use('/lessons', lessonsRoutes)
router.use('/homeworks', homeworkRoutes)
router.use('/quizzes', quizzesRoutes)

// 5. Examinations & grading
router.use('/exams', examsRoutes)
router.use('/grades', gradesRoutes)

// 6. Attendance & leaves
router.use('/attendance', attendanceRoutes)
router.use('/leaves', leaveRequestsRoutes)

// 7. Communication
router.use('/announcements', announcementsRoutes)
router.use('/notifications', notificationsRoutes)

// 8. Reports
router.use('/reports', reportsRoutes)

// 9. i18n
router.use('/languages', languagesRoutes)
router.use('/translations', translationsRoutes)

export default router

// -----------------------------------------------------------------------------
// Module metadata — kept for tooling / docs generation. This mirrors the
// mount list above; keep them in sync, or delete this if nothing consumes it.
// -----------------------------------------------------------------------------
export interface ModuleRouteDefinition {
  domain: string
  path: string
  description: string
}

export const moduleRoutes: ModuleRouteDefinition[] = [
  // 1. Auth & RBAC
  { domain: 'Auth & RBAC', path: '/auth', description: 'Authentication, tokens, sessions' },
  { domain: 'Auth & RBAC', path: '/users', description: 'User account management' },
  { domain: 'Auth & RBAC', path: '/roles', description: 'Role-based access control' },
  { domain: 'Auth & RBAC', path: '/permissions', description: 'Permission registry' },

  // 2. Administration
  { domain: 'Administration', path: '/dashboard', description: 'Overview metrics & summary data' },
  { domain: 'Administration', path: '/schools', description: 'School profile & settings' },
  { domain: 'Administration', path: '/academic-years', description: 'Academic year lifecycle' },
  { domain: 'Administration', path: '/rooms', description: 'Room and facility management' },
  { domain: 'Administration', path: '/grade-levels', description: 'Grade level lifecycle' },
  { domain: 'Administration', path: '/terms', description: 'Academic terms' },

  // 3. People
  { domain: 'People', path: '/students', description: 'Student directory & records' },
  { domain: 'People', path: '/teachers', description: 'Faculty roster & assignments' },

  // 4. Academics
  { domain: 'Academics', path: '/classes', description: 'Class sections & grade levels' },
  { domain: 'Academics', path: '/subjects', description: 'Curriculum subjects' },
  { domain: 'Academics', path: '/schedules', description: 'Timetable slots' },
  { domain: 'Academics', path: '/lessons', description: 'Lesson plans & resources' },
  { domain: 'Academics', path: '/homeworks', description: 'Homework & submissions' },
  { domain: 'Academics', path: '/quizzes', description: 'Quizzes & auto-grading' },

  // 5. Examinations & grading
  { domain: 'Examinations', path: '/exams', description: 'Exams, schedules, mark entry & report cards' },
  { domain: 'Examinations', path: '/grades', description: 'Gradebook records & transcripts' },

  // 6. Attendance & leaves
  { domain: 'Attendance', path: '/attendance', description: 'Daily student attendance' },
  { domain: 'Attendance', path: '/leaves', description: 'Leave request processing & approvals' },

  // 7. Communication
  { domain: 'Communication', path: '/announcements', description: 'School announcements' },
  { domain: 'Communication', path: '/notifications', description: 'In-app notifications' },

  // 8. Reports
  { domain: 'Reports', path: '/reports', description: 'Analytics & reporting' },

  // 9. i18n
  { domain: 'Localization', path: '/languages', description: 'Supported languages & locale config' },
  { domain: 'Localization', path: '/translations', description: 'Translation dictionary' },
]