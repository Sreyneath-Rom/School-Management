/**
 * Role-based route configuration
 * Maps user roles to their allowed features and permissions
 */

export const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrator',
    color: 'blue',
    canAccess: [
      'dashboard',
      'setup',
      'academic',
      'students',
      'teachers',
      'communication',
      'reports',
    ],
    features: [
      'manage_users',
      'manage_roles',
      'manage_subjects',
      'manage_schedules',
      'manage_school',
      'view_all_reports',
      'manage_announcements',
      'manage_notifications',
    ],
  },
  teacher: {
    label: 'Teacher',
    color: 'green',
    canAccess: [
      'dashboard',
      'academic',
      'students',
      'communication',
    ],
    features: [
      'manage_classes',
      'manage_lessons',
      'manage_homework',
      'manage_quizzes',
      'manage_grades',
      'mark_attendance',
      'view_announcements',
    ],
  },
  student: {
    label: 'Student',
    color: 'purple',
    canAccess: [
      'dashboard',
      'academic',
      'communication',
    ],
    features: [
      'view_classes',
      'view_homework',
      'view_quizzes',
      'view_grades',
      'view_attendance',
      'request_leave',
      'view_announcements',
      'view_notifications',
    ],
  },
} as const;

export type UserRole = keyof typeof ROLE_PERMISSIONS;

/**
 * Check if a user role has access to a specific feature
 */
export const hasPermission = (role: UserRole, feature: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions?.features.includes(feature) ?? false;
};

/**
 * Check if a user role can access a specific section
 */
export const canAccessSection = (role: UserRole, section: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions?.canAccess.includes(section) ?? false;
};

/**
 * Get display label for a role
 */
export const getRoleLabel = (role: UserRole): string => {
  return ROLE_PERMISSIONS[role]?.label ?? 'Unknown';
};

/**
 * Get color for a role
 */
export const getRoleColor = (role: UserRole): string => {
  return ROLE_PERMISSIONS[role]?.color ?? 'gray';
};
