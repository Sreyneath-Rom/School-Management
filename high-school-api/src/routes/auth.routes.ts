import { Router } from 'express'
import authRoutes from '@/modules/auth/auth.routes'

const router = Router()

/**
 * Authentication & Session Management Routes
 */
router.use('/', authRoutes)

export default router
