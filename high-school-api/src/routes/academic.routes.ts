import { Router } from 'express'
import classesRoutes from '@/modules/classes/classes.routes'
import subjectsRoutes from '@/modules/subjects/subjects.routes'
import schedulesRoutes from '@/modules/schedules/schedules.routes'
import lessonsRoutes from '@/modules/lessons/lessons.routes'
import homeworkRoutes from '@/modules/homework/homework.routes'
import quizzesRoutes from '@/modules/quizzes/quizzes.routes'
import gradesRoutes from '@/modules/grades/grades.routes'

const router = Router()

/**
 * Academic Domain Resource Routes
 */
router.use('/classes', classesRoutes)
router.use('/subjects', subjectsRoutes)
router.use('/schedules', schedulesRoutes)
router.use('/lessons', lessonsRoutes)
router.use('/homeworks', homeworkRoutes)
router.use('/quizzes', quizzesRoutes)
router.use('/grades', gradesRoutes)

export default router
