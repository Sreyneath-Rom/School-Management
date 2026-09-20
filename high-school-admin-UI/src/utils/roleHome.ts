// src/utils/roleHome.ts
import type { UserRole } from './rolePermissions'

/**
 * Single source of truth for the "role → landing page" mapping.
 * Must match the paths declared in AdminRoutes / TeacherRoutes /
 * StudentRoutes / ParentRoutes.
 */
export function homeForRole(role: UserRole | string | null | undefined): string {
  switch (role) {
    case 'admin':
      return '/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
      return '/student/dashboard'
    case 'parent':
      return '/parent/dashboard'
    default:
      return '/dashboard'
  }
}