import { Router } from 'express'

import authRoutes from '@/modules/auth/auth.routes'
import dashboardRoutes from '@/modules/dashboard/dashboard.routes'
import schoolRoutes from '@/modules/school/school.routes'
import usersRoutes from '@/modules/users/users.routes'
import rolesRoutes from '@/modules/roles/roles.routes'
import permissionsRoutes from '@/modules/permissions/permissions.routes'
import classesRoutes from '@/modules/classes/classes.routes'
import studentsRoutes from '@/modules/students/students.routes'
import teachersRoutes from '@/modules/teachers/teachers.routes'
import subjectsRoutes from '@/modules/subjects/subjects.routes'
import schedulesRoutes from '@/modules/schedules/schedules.routes'
import lessonsRoutes from '@/modules/lessons/lessons.routes'
import homeworkRoutes from '@/modules/homework/homework.routes'
import quizzesRoutes from '@/modules/quizzes/quizzes.routes'
import gradesRoutes from '@/modules/grades/grades.routes'
import attendanceRoutes from '@/modules/attendance/attendance.routes'
import leaveRequestsRoutes from '@/modules/leaveRequests/leaveRequests.routes'
import announcementsRoutes from '@/modules/announcements/announcements.routes'
import notificationsRoutes from '@/modules/notifications/notifications.routes'
import reportsRoutes from '@/modules/reports/reports.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/schools', schoolRoutes)
router.use('/users', usersRoutes)
router.use('/roles', rolesRoutes)
router.use('/permissions', permissionsRoutes)
router.use('/classes', classesRoutes)
router.use('/students', studentsRoutes)
router.use('/teachers', teachersRoutes)
router.use('/subjects', subjectsRoutes)
router.use('/schedules', schedulesRoutes)
router.use('/lessons', lessonsRoutes)
router.use('/homeworks', homeworkRoutes)
router.use('/quizzes', quizzesRoutes)
router.use('/grades', gradesRoutes)
router.use('/attendance', attendanceRoutes)
router.use('/leaves', leaveRequestsRoutes)
router.use('/announcements', announcementsRoutes)
router.use('/notifications', notificationsRoutes)
router.use('/reports', reportsRoutes)

export default router
