// src/routes/ProtectedRoute.tsx
import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactElement
  /**
   * Optional role allowlist. When provided, the caller's role must be one
   * of these values. Empty or undefined means "any authenticated user".
   */
  allow?: string[]
}

/**
 * Wraps a route element and redirects to /login when the user is not
 * authenticated, or to the root when they are authenticated but their
 * role isn't in the `allow` list.
 *
 * Not required by AppRoutes — the top-level gate in AppRoutes already
 * blocks every unauthenticated path. Keep this for cases where a specific
 * subtree needs a stricter role check than the surrounding route set
 * provides.
 */
export default function ProtectedRoute({
  children,
  allow,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />
  }

  if (allow && allow.length > 0 && !allow.includes(role)) {
    // Authenticated but not permitted — send to the app root, which
    // AppRoutes will then redirect to this role's landing page.
    return <Navigate to="/" replace />
  }

  return children
}