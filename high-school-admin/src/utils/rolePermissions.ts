/**
 * Frontend access policy.
 *
 * The backend remains the security boundary. This policy only controls which
 * navigation entries and routes are rendered for a better user experience.
 * When the API provides effective permissions, those keys take precedence;
 * role defaults keep the offline/demo portal usable.
 */
export const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrator',
    color: 'blue',
    canAccess: ['dashboard', 'setup', 'academic', 'students', 'teachers', 'communication', 'reports'],
    features: ['manage_users', 'manage_roles', 'manage_subjects', 'manage_schedules', 'manage_school', 'view_all_reports', 'manage_announcements', 'manage_notifications'],
  },
  teacher: {
    label: 'Teacher',
    color: 'green',
    canAccess: ['dashboard', 'academic', 'students', 'communication'],
    features: ['manage_classes', 'manage_lessons', 'manage_homework', 'manage_quizzes', 'manage_grades', 'mark_attendance', 'view_announcements'],
  },
  student: {
    label: 'Student',
    color: 'purple',
    canAccess: ['dashboard', 'academic', 'communication'],
    features: ['view_classes', 'view_homework', 'view_quizzes', 'view_grades', 'view_attendance', 'request_leave', 'view_announcements', 'view_notifications'],
  },
  parent: {
    label: 'Parent',
    color: 'orange',
    canAccess: ['dashboard', 'academic', 'communication'],
    features: ['view_classes', 'view_grades', 'view_attendance', 'view_announcements', 'view_notifications'],
  },
} as const

export type UserRole = keyof typeof ROLE_PERMISSIONS
export type PermissionKey = `${string}.${'view' | 'create' | 'edit' | 'delete' | 'submit'}` | string

const PATH_PERMISSION_RULES: Array<{ prefix: string; permission: PermissionKey }> = [
  { prefix: '/setup/school', permission: 'school.view' },
  { prefix: '/setup/academic-years', permission: 'academicYears.view' },
  { prefix: '/setup/terms', permission: 'terms.view' },
  { prefix: '/setup/subjects', permission: 'subjects.view' },
  { prefix: '/setup/roles', permission: 'roles.view' },
  { prefix: '/setup/users', permission: 'users.view' },
  { prefix: '/academic/classes', permission: 'classes.view' },
  { prefix: '/academic/class-subjects', permission: 'subjects.view' },
  { prefix: '/academic/schedules', permission: 'schedules.view' },
  { prefix: '/academic/lessons', permission: 'lessons.view' },
  { prefix: '/academic/homework', permission: 'homework.view' },
  { prefix: '/academic/quizzes', permission: 'quizzes.view' },
  { prefix: '/academic/grades', permission: 'gradebook.view' },
  { prefix: '/academic/exams', permission: 'exams.view' },
  { prefix: '/academic/mark-entry', permission: 'gradebook.edit' },
  { prefix: '/academic/report-cards', permission: 'gradebook.view' },
  { prefix: '/students', permission: 'students.view' },
  { prefix: '/teachers', permission: 'teachers.view' },
  { prefix: '/students/attendance', permission: 'attendance.view' },
  { prefix: '/teacher/attendance', permission: 'attendance.view' },
  { prefix: '/teacher/classes', permission: 'classes.view' },
  { prefix: '/teacher/lessons', permission: 'lessons.view' },
  { prefix: '/teacher/homework', permission: 'homework.view' },
  { prefix: '/teacher/quizzes', permission: 'quizzes.view' },
  { prefix: '/teacher/grades', permission: 'gradebook.view' },
  { prefix: '/teacher/students', permission: 'students.view' },
  { prefix: '/library', permission: 'library.view' },
  { prefix: '/reports', permission: 'reports.view' },
  { prefix: '/communication', permission: 'announcements.view' },
  { prefix: '/messages', permission: 'messages.view' },
]

export const hasPermission = (role: UserRole, feature: string): boolean =>
  (ROLE_PERMISSIONS[role]?.features as readonly string[] | undefined)?.includes(feature) ?? false

export const canAccessSection = (role: UserRole, section: string): boolean =>
  (ROLE_PERMISSIONS[role]?.canAccess as readonly string[] | undefined)?.includes(section) ?? false

export const getRoleLabel = (role: UserRole): string => ROLE_PERMISSIONS[role]?.label ?? 'Unknown'
export const getRoleColor = (role: UserRole): string => ROLE_PERMISSIONS[role]?.color ?? 'gray'

export function permissionForPath(pathname: string): PermissionKey | null {
  return PATH_PERMISSION_RULES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.permission ?? null
}

/**
 * Use API-provided permissions when present; otherwise use the role's demo
 * policy. An empty list is intentional and means no permissions were granted.
 */
export function canAccessPath(role: UserRole, pathname: string, permissions?: readonly string[]): boolean {
  if (pathname === '/dashboard' || pathname.endsWith('/dashboard')) return true
  const required = permissionForPath(pathname)
  if (!required) return true
  if (permissions !== undefined) return permissions.includes(required)

  const [module] = required.split('.')
  const featureFallback: Record<string, string> = {
    school: 'manage_school', academicYears: 'manage_school', terms: 'manage_school',
    subjects: 'manage_subjects', roles: 'manage_roles', users: 'manage_users',
    classes: 'manage_classes', schedules: 'manage_schedules', lessons: 'manage_lessons',
    homework: 'manage_homework', quizzes: 'manage_quizzes', gradebook: 'manage_grades',
    attendance: 'mark_attendance', students: 'view_classes', teachers: 'view_classes',
    reports: 'view_all_reports', announcements: 'view_announcements',
  }
  return hasPermission(role, featureFallback[module] ?? `view_${module}`)
}
