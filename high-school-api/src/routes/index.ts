import { Router } from 'express'

// -----------------------------------------------------------------------------
// Individual Route Module Imports
// -----------------------------------------------------------------------------
import authRoutes from './auth.routes'
import dashboardRoutes from './dashboard.routes'
import setupRoutes from './setup.routes'
import academicRoutes from './academic.routes'
import studentsRoutes from './students.routes'
import teachersRoutes from './teachers.routes'
import examsRoutes from './exams.routes'
import attendanceRoutes from './attendance.routes'
import communicationRoutes from './communication.routes'
import reportsRoutes from './reports.routes'

// Individual sub-module direct routes for granular mounting
import classesRoutes from '@/modules/classes/classes.routes'
import subjectsRoutes from '@/modules/subjects/subjects.routes'
import schedulesRoutes from '@/modules/schedules/schedules.routes'
import lessonsRoutes from '@/modules/lessons/lessons.routes'
import homeworkRoutes from '@/modules/homework/homework.routes'
import quizzesRoutes from '@/modules/quizzes/quizzes.routes'
import gradesRoutes from '@/modules/grades/grades.routes'
import leaveRequestsRoutes from '@/modules/leaveRequests/leaveRequests.routes'
import usersRoutes from '@/modules/users/users.routes'
import rolesRoutes from '@/modules/roles/roles.routes'
import permissionsRoutes from '@/modules/permissions/permissions.routes'
import schoolRoutes from '@/modules/school/school.routes'
import announcementsRoutes from '@/modules/announcements/announcements.routes'
import notificationsRoutes from '@/modules/notifications/notifications.routes'
import languagesRoutes from '@/modules/languages/languages.routes'
import translationsRoutes from '@/modules/translations/translations.routes'
import academicYearsRoutes from '@/modules/academicYears/academicYears.routes'
import roomsRoutes from '@/modules/rooms/rooms.routes'
import gradeLevelsRoutes from '@/modules/gradeLevels/gradeLevels.routes'
import termsRoutes from '@/modules/terms/terms.routes'

// -----------------------------------------------------------------------------
// Named Exports for Modular Consumption
// -----------------------------------------------------------------------------
export {
  authRoutes,
  dashboardRoutes,
  setupRoutes,
  academicRoutes,
  studentsRoutes,
  teachersRoutes,
  examsRoutes,
  attendanceRoutes,
  communicationRoutes,
  reportsRoutes,
  // Granular module routes
  classesRoutes,
  subjectsRoutes,
  schedulesRoutes,
  lessonsRoutes,
  homeworkRoutes,
  quizzesRoutes,
  gradesRoutes,
  leaveRequestsRoutes,
  usersRoutes,
  rolesRoutes,
  permissionsRoutes,
  schoolRoutes,
  announcementsRoutes,
  notificationsRoutes,
  languagesRoutes,
  translationsRoutes,
  academicYearsRoutes,
  roomsRoutes,
  gradeLevelsRoutes,
  termsRoutes,
}

// -----------------------------------------------------------------------------
// Module Definition Metadata
// -----------------------------------------------------------------------------
export interface ModuleRouteDefinition {
  domain: string
  path: string
  router: Router
  description: string
}

export const moduleRoutes: ModuleRouteDefinition[] = [
  // 1. Authentication & Security
  { domain: 'Auth & RBAC', path: '/auth', router: authRoutes, description: 'Authentication, tokens, sessions & security' },
  { domain: 'Auth & RBAC', path: '/users', router: usersRoutes, description: 'User account management & credentials' },
  { domain: 'Auth & RBAC', path: '/roles', router: rolesRoutes, description: 'Role-based access control & assignments' },
  { domain: 'Auth & RBAC', path: '/permissions', router: permissionsRoutes, description: 'System-wide granular permissions registry' },

  // 2. Dashboard & School Administration
  { domain: 'Administration', path: '/dashboard', router: dashboardRoutes, description: 'Overview metrics, charts & summary data' },
  { domain: 'Administration', path: '/schools', router: schoolRoutes, description: 'School profile, academic configurations & setup' },
  { domain: 'Administration', path: '/setup', router: setupRoutes, description: 'Unified administrative setup & config hub' },
  { domain: 'Administration', path: '/academic-years', router: academicYearsRoutes, description: 'Academic year lifecycle and current-year selection' },
  { domain: 'Administration', path: '/rooms', router: roomsRoutes, description: 'Room and facility lifecycle management' },
  { domain: 'Administration', path: '/grade-levels', router: gradeLevelsRoutes, description: 'Grade and academic level lifecycle management' },
  { domain: 'Administration', path: '/terms', router: termsRoutes, description: 'Academic term and grading cycle lifecycle management' },

  // 3. People (Students & Teachers)
  { domain: 'People', path: '/students', router: studentsRoutes, description: 'Student directory, records & parent links' },
  { domain: 'People', path: '/teachers', router: teachersRoutes, description: 'Faculty roster, teacher codes & assignments' },

  // 4. Academic Structure & Coursework
  { domain: 'Academics', path: '/academic', router: academicRoutes, description: 'Unified academic master route' },
  { domain: 'Academics', path: '/classes', router: classesRoutes, description: 'Class sections & grade levels' },
  { domain: 'Academics', path: '/subjects', router: subjectsRoutes, description: 'Academic curriculum subjects' },
  { domain: 'Academics', path: '/schedules', router: schedulesRoutes, description: 'Timetable slots & classroom scheduling' },
  { domain: 'Academics', path: '/lessons', router: lessonsRoutes, description: 'Lesson plans & learning resources' },
  { domain: 'Academics', path: '/homeworks', router: homeworkRoutes, description: 'Homework assignments & student submissions' },
  { domain: 'Academics', path: '/quizzes', router: quizzesRoutes, description: 'Quizzes, questionnaires & auto-grading' },

  // 5. Examinations & Grading
  { domain: 'Examinations', path: '/exams', router: examsRoutes, description: 'Exams, schedules, mark entry & report cards' },
  { domain: 'Grades & Records', path: '/grades', router: gradesRoutes, description: 'Gradebook records, transcripts & GPA' },

  // 6. Attendance & Leaves
  { domain: 'Attendance & Leaves', path: '/attendance', router: attendanceRoutes, description: 'Daily student & staff attendance' },
  { domain: 'Attendance & Leaves', path: '/leaves', router: leaveRequestsRoutes, description: 'Leave request processing & approvals' },

  // 7. Communication & Alerts
  { domain: 'Communication', path: '/communication', router: communicationRoutes, description: 'Unified communication hub' },
  { domain: 'Communication', path: '/announcements', router: announcementsRoutes, description: 'Broadcast school announcements' },
  { domain: 'Communication', path: '/notifications', router: notificationsRoutes, description: 'In-app and push notifications' },

  // 8. Reports & Analytics
  { domain: 'Reports & Analytics', path: '/reports', router: reportsRoutes, description: 'Attendance, grade, student & financial analytics' },

  // 9. Internationalization (i18n)
  { domain: 'Localization', path: '/languages', router: languagesRoutes, description: 'Supported languages & locale config' },
  { domain: 'Localization', path: '/translations', router: translationsRoutes, description: 'Dynamic translation dictionary' },
]

// -----------------------------------------------------------------------------
// Unified Master Router Setup
// -----------------------------------------------------------------------------
const router = Router()

// Register all modular routes with their designated paths
moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.router)
})

export default router
