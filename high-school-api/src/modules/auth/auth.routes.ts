import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authController } from './auth.controller'
import { validateBody } from '@/middleware/validation.middleware'
import { authenticate } from '@/middleware/auth.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  resetPasswordSchema,
} from './auth.validation'

const router = Router()

// Stricter limiter on auth endpoints specifically — these are the most
// common brute-force / credential-stuffing target in the whole API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', authLimiter, validateBody(loginSchema), asyncHandler(authController.login))
router.post('/refresh-token', validateBody(refreshSchema), asyncHandler(authController.refresh))
router.post('/logout', validateBody(refreshSchema), asyncHandler(authController.logout))
router.get('/me', authenticate, asyncHandler(authController.me))
router.post('/change-password', authenticate, validateBody(changePasswordSchema), asyncHandler(authController.changePassword))
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), asyncHandler(authController.forgotPassword))
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), asyncHandler(authController.resetPassword))

export default router
