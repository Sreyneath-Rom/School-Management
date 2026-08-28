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
import financeRoutes from './finance.routes'
import libraryRoutes from './library.routes'
import transportRoutes from './transport.routes'
import hostelRoutes from './hostel.routes'
import inventoryRoutes from './inventory.routes'
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
  financeRoutes,
  libraryRoutes,
  transportRoutes,
  hostelRoutes,
  inventoryRoutes,
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

  // 7. Finance & Fees Management
  { domain: 'Finance & Fees', path: '/finance', router: financeRoutes, description: 'Fee structures, invoices, payments & history' },
  { domain: 'Finance & Fees', path: '/fees', router: financeRoutes, description: 'Alias for fee collections and billing' },

  // 8. Library Management
  { domain: 'Library', path: '/library', router: libraryRoutes, description: 'Book catalog, circulation, borrowing & overdue tracking' },

  // 9. Transport Management
  { domain: 'Transport', path: '/transport', router: transportRoutes, description: 'Bus routes, vehicle fleet, drivers & assignments' },

  // 10. Hostel & Boarding
  { domain: 'Hostel', path: '/hostel', router: hostelRoutes, description: 'Dormitory rooms, student allocations & boarding fees' },

  // 11. Inventory Management
  { domain: 'Inventory', path: '/inventory', router: inventoryRoutes, description: 'Stock items, categories, issuance & suppliers' },

  // 12. Communication & Alerts
  { domain: 'Communication', path: '/communication', router: communicationRoutes, description: 'Unified communication hub' },
  { domain: 'Communication', path: '/announcements', router: announcementsRoutes, description: 'Broadcast school announcements' },
  { domain: 'Communication', path: '/notifications', router: notificationsRoutes, description: 'In-app and push notifications' },

  // 13. Reports & Analytics
  { domain: 'Reports & Analytics', path: '/reports', router: reportsRoutes, description: 'Attendance, grade, student & financial analytics' },

  // 14. Internationalization (i18n)
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
