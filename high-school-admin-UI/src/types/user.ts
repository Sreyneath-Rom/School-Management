// src/types/user.ts

/**
 * Roles the backend recognizes. The seed creates exactly these four; any
 * other value in the DB is not a system role and won't match
 * `requireRole(...)` checks in the API.
 *
 * The previous version included a `'mazer'` role, which was removed from
 * the backend. If you see `mazer` in API data, that's stale — the role
 * doesn't exist.
 */
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'mazer'

export type UserStatus = 'active' | 'inactive'
export type Gender = 'male' | 'female' | 'other'
export type ParentRelationship = 'father' | 'mother' | 'guardian' | 'other'

// ---------------------------------------------------------------------------
// Base and Extended User Models
// ---------------------------------------------------------------------------

export interface BaseUser {
  id: string
  username?: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatarUrl?: string | null
  profilePhoto?: string
  isActive?: boolean
  status?: UserStatus
  gender?: Gender
  dateOfBirth?: string
  address?: string
  nationality?: string
  emergencyContact?: string
  notes?: string
  createdDate?: string
  createdAt?: string
  lastLoginAt?: string | null
  role?: any
}

export interface AdminUser extends BaseUser {
  role: 'admin'
  employeeId?: string
  department?: string
  position?: string
}

export interface TeacherUser extends BaseUser {
  role: 'teacher'
  teacherId?: string
  department?: string
  qualification?: string
  hireDate?: string
  experienceYears?: number
  subjects?: any
  assignedClasses?: string[]
}

export interface StudentCoreFields {
  studentId?: string
  studentCode?: string
  grade?: string
  class?: string
  academicYear?: string
  enrollmentDate?: string
  fatherName?: string
  motherName?: string
  guardianName?: string
  parentPhone?: string
  parentEmail?: string
  relationship?: ParentRelationship
}

export interface StudentUser extends BaseUser, StudentCoreFields {
  role: 'student'
}

export interface MazerUser extends BaseUser, StudentCoreFields {
  role: 'mazer'
  assignedClass?: string
  appointmentDate?: string
  endDate?: string
}

export interface ParentUser extends BaseUser {
  role: 'parent'
}

export type SystemUser = AdminUser | TeacherUser | StudentUser | MazerUser | ParentUser | any

// ---------------------------------------------------------------------------
// API response shape
// ---------------------------------------------------------------------------

/**
 * Student profile attached to a user whose role is `student`.
 * Null for other roles.
 */
export interface UserStudentProfile {
  studentCode: string
  dateOfBirth: string | null
  gender: Gender | null
  enrolledAt: string
  class: { id: string; name: string } | null
}

/**
 * Teacher profile attached to a user whose role is `teacher`.
 * Null for other roles.
 */
export interface UserTeacherProfile {
  teacherCode: string
  hiredAt: string
  subjects: Array<{ subject: { name: string; department: string } }>
  classesLed: Array<{ name: string }>
}

/**
 * The shape returned by `GET /users` and `GET /users/:id`.
 */
export interface User extends BaseUser {
  student: UserStudentProfile | null
  teacher: UserTeacherProfile | null
}

/**
 * Shape returned by `GET /auth/me`.
 */
export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissionKeys: string[]
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

export const getFullName = (
  user: { firstName?: string; lastName?: string } | any
): string => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User'

export const getDisplayClass = (user: any): string | null => {
  if (user?.student?.class?.name) return user.student.class.name
  if (user?.class) return user.class
  return null
}

export const getDisplayDepartment = (user: any): string | null => {
  if (user?.teacher?.subjects?.[0]?.subject?.department) {
    return user.teacher.subjects[0].subject.department
  }
  if (user?.department) return user.department
  return null
}

export const getDisplayGrade = (user: any): string | null => {
  if (user?.grade) return user.grade
  return null
}

export const getDisplayAcademicYear = (user: any): string | null => {
  if (user?.academicYear) return user.academicYear
  return null
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  mazer: 'Mazer',
}

export const ROLE_COLORS: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  admin: {
    bg: 'bg-brand-100 dark:bg-brand-900/40',
    text: 'text-brand-700 dark:text-brand-200',
    ring: 'ring-brand-500/30',
  },
  teacher: {
    bg: 'bg-info/15',
    text: 'text-info',
    ring: 'ring-info/30',
  },
  student: {
    bg: 'bg-success/15',
    text: 'text-success',
    ring: 'ring-success/30',
  },
  parent: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    ring: 'ring-warning/30',
  },
  mazer: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-200',
    ring: 'ring-amber-500/30',
  },
}