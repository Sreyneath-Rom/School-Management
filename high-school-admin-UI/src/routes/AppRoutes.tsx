// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { adminRoutes } from './AdminRoutes'
import { teacherRoutes } from './TeacherRoutes'
import { studentRoutes } from './StudentRoutes'
import { parentRoutes } from './ParentRoutes'
import { useAuth } from '@/hooks/useAuth'
import {
  Login,
  AdminLogin,
  StudentLogin,
  TeacherLogin,
  ParentLogin,
} from '@/pages/Authentication'

/**
 * Single source of truth for the "role → landing page" mapping. Used both
 * for the `/` redirect and the catch-all, so the two can't drift.
 */
function homeForRole(role: string | null | undefined): string {
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

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuth()

  // ---- Unauthenticated -----------------------------------------------------
  if (!isAuthenticated || !role) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/parent" element={<ParentLogin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // ---- Authenticated -------------------------------------------------------
  const homeRoute = homeForRole(role)

  return (
    <Routes>
      {/* Role-specific route sets. Exactly one matches per session. */}
      {role === 'admin' && adminRoutes()}
      {role === 'teacher' && teacherRoutes()}
      {role === 'student' && studentRoutes()}
      {role === 'parent' && parentRoutes()}

      {/*
       * Universal aliases. These come AFTER the role sets so a role that
       * already declares a path (admin declares /dashboard) wins over the
       * redirect. Anything else — including a role-specific path visited
       * by the wrong role — falls here and gets routed to that role's
       * landing page.
       */}
      <Route path="/" element={<Navigate to={homeRoute} replace />} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  )
}