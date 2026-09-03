import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { canAccessPath } from '@/utils/rolePermissions'

export default function RouteAccessGuard({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { role, user } = useAuth()

  if (!role || !canAccessPath(role, location.pathname, user?.permissions)) {
    const homeRoute = role === 'admin'
      ? '/dashboard'
      : role === 'teacher'
        ? '/teacher/dashboard'
        : role === 'student'
          ? '/student/dashboard'
          : '/parent/dashboard'
    return <Navigate to={homeRoute} replace state={{ from: location.pathname }} />
  }

  return children
}
