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
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent'

export type UserStatus = 'active' | 'inactive'
export type Gender = 'male' | 'female' | 'other'
export type ParentRelationship = 'father' | 'mother' | 'guardian' | 'other'

// ---------------------------------------------------------------------------
// API response shape
// ---------------------------------------------------------------------------

/**
 * Fields every user has, regardless of role. Matches the `publicUserSelect`
 * projection in `users.service.ts` on the backend.
 */
interface BaseUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string

  /**
   * The role as returned by the API — an object with id and name, not a
   * bare string. The `name` matches one of the `UserRole` values.
   */
  role: { id: string; name: UserRole }
}

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
 *
 * Both `student` and `teacher` are always present as keys, but only one of
 * them is non-null for any given user (based on the role), and both are
 * null for admin and parent accounts.
 */
export interface User extends BaseUser {
  student: UserStudentProfile | null
  teacher: UserTeacherProfile | null
}

/**
 * Shape returned by `GET /auth/me`. A trimmed projection of `User` with
 * `permissionKeys` — the strings the UI uses to gate features.
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
  user: Pick<User, 'firstName' | 'lastName'>
): string => `${user.firstName} ${user.lastName}`

/**
 * The class a user is enrolled in, if any. Only populated for students.
 */
export const getDisplayClass = (user: User): string | null =>
  user.student?.class?.name ?? null

/**
 * Department of a teacher's first subject. A teacher can span departments;
 * this returns the first one, which is what a single-column table needs.
 */
export const getDisplayDepartment = (user: User): string | null =>
  user.teacher?.subjects[0]?.subject.department ?? null

/**
 * Human-readable role label. Falls back to a capitalized version of the
 * raw name for roles the client doesn't recognize.
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}

/**
 * Tailwind color tokens per role. Used for badges, avatar rings, and
 * role-switcher pills.
 *
 * Roles map to the theme as follows:
 *   - admin   → brand teal (the primary brand color — admin is the
 *               "elevated" role and gets the brand treatment)
 *   - teacher → info (sky)
 *   - student → success (emerald)
 *   - parent  → warning (amber)
 *
 * All four use the semantic variables declared in `globals.css`, so the
 * badges render correctly in light and dark mode without needing `dark:`
 * variants on every class.
 *
 * The brand scale is used directly (rather than via a single variable)
 * because the swatch needs three coordinated stops — a lighter background
 * for the pill, a darker foreground for the text, and a mid-tone for the
 * ring. The brand palette is already defined in `@theme` in globals.css,
 * so `bg-brand-100` / `text-brand-700` / `ring-brand-500` resolve without
 * extra configuration.
 */
export const ROLE_COLORS: Record<
  UserRole,
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
}