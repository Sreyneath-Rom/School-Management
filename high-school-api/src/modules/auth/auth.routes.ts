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

/**
 * Stricter limiter for authentication endpoints. These are the highest-value
 * brute-force and credential-stuffing targets in the API.
 *
 * `skipSuccessfulRequests: true` means a legitimate login doesn't consume
 * the budget — only failed attempts do. Without this, a user hitting
 * refresh every 10 minutes for a day would lock themselves out of /login
 * on the few occasions they actually need it.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
})

// ---------- Public ----------
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(authController.login)
)

// NOTE: this is `/refresh-token`, not `/refresh`. The README documents
// `/refresh`; update whichever side is wrong. Keeping the longer name here
// because the CLI-facing docs may already reference it — pick one and be
// consistent, don't support both.
router.post(
  '/refresh-token',
  validateBody(refreshSchema),
  asyncHandler(authController.refresh)
)

router.post(
  '/logout',
  validateBody(refreshSchema),
  asyncHandler(authController.logout)
)

router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
)

router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
)

// ---------- Authenticated ----------
router.get('/me', authenticate, asyncHandler(authController.me))

router.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  asyncHandler(authController.changePassword)
)

// Revokes every refresh token for the calling user. Must be authenticated —
// the previous version's service exposed `logoutAll`, but there was no route
// for it, so the only way a user could nuke all their sessions was to change
// their password.
router.post(
  '/logout-all',
  authenticate,
  asyncHandler(authController.logoutAll)
)

export default router