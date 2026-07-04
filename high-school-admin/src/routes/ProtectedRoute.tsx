import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactElement
  isAuthenticated?: boolean
}

/**
 * Wraps a route element and redirects to /login when the user is not
 * authenticated. Wire `isAuthenticated` up to real auth state (e.g. from
 * a context or store) once authentication is implemented.
 */
export default function ProtectedRoute({
  children,
  isAuthenticated = true,
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
