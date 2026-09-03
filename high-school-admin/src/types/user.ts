// Suggested path: @/types/user.ts

export type UserRole = 'admin' | 'teacher' | 'student' | 'mazer'
export type UserStatus = 'active' | 'inactive'
export type Gender = 'male' | 'female' | 'other'
export type ParentRelationship = 'father' | 'mother' | 'guardian' | 'other'

/**
 * Fields every user has, regardless of role.
 * Maps to "Account Information" + "Personal Information" in the spec.
 */
interface BaseUser {
  id: string
  username: string
  email: string
  status: UserStatus
  createdDate: string // ISO date string

  firstName: string
  lastName: string
  gender: Gender
  dateOfBirth: string // ISO date string
  phone: string
  address: string
  nationality: string

  profilePhoto?: string
  emergencyContact?: string
  notes?: string
}

export interface AdminUser extends BaseUser {
  role: 'admin'
  employeeId: string
  department: string
  position: string
}

export interface TeacherUser extends BaseUser {
  role: 'teacher'
  teacherId: string
  department: string
  qualification: string
  hireDate: string // ISO date string
  experienceYears: number
  subjects: string[]
  assignedClasses: string[]
}

/** Shared by Student and Mazer — a Mazer is a student with extra duties. */
interface StudentCoreFields {
  studentId: string
  grade: string
  class: string
  academicYear: string
  enrollmentDate: string // ISO date string

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
  assignedClass: string
  appointmentDate: string // ISO date string
  endDate?: string // ISO date string, optional
}

export type SystemUser = AdminUser | TeacherUser | StudentUser | MazerUser

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export const getFullName = (user: SystemUser): string =>
  `${user.firstName} ${user.lastName}`

/** The "Class" column in the user table only applies to Student/Mazer. */
export const getDisplayClass = (user: SystemUser): string | null => {
  if (user.role === 'student' || user.role === 'mazer') return user.class
  return null
}

/** The "Department" facet only applies to Admin/Teacher. */
export const getDisplayDepartment = (user: SystemUser): string | null => {
  if (user.role === 'admin' || user.role === 'teacher') return user.department
  return null
}

export const getDisplayGrade = (user: SystemUser): string | null => {
  if (user.role === 'student' || user.role === 'mazer') return user.grade
  return null
}

export const getDisplayAcademicYear = (user: SystemUser): string | null => {
  if (user.role === 'student' || user.role === 'mazer') return user.academicYear
  return null
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  mazer: 'Mazer',
}

/** Tailwind color token per role, reused for badges/avatars across the module. */
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; ring: string }> = {
  admin: { bg: 'bg-teal-100', text: 'text-teal-700', ring: 'ring-teal-600/20' },
  teacher: { bg: 'bg-sky-100', text: 'text-sky-700', ring: 'ring-sky-600/20' },
  student: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-600/20' },
  mazer: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-600/20' },
}