// src/utils/rolePermissions.ts

/**
 * Display metadata for each role — label and color for badges, dropdowns,
 * and filters.
 *
 * Authorization is enforced by the backend and exposed to the client via
 * `permissionKeys` on `/auth/me`. UI gating uses those keys, not a
 * hardcoded feature map.
 *
 * `UserRole` is derived from the keys of `ROLE_PERMISSIONS` — this is the
 * single source of truth for the four roles. If the backend ever adds a
 * role, extend the map here and the type follows.
 */

export const ROLE_PERMISSIONS = {
  admin: { label: 'Admin', color: 'blue' },
  teacher: { label: 'Teacher', color: 'green' },
  student: { label: 'Student', color: 'purple' },
  parent: { label: 'Parent', color: 'orange' },
} as const

export type UserRole = keyof typeof ROLE_PERMISSIONS

export const getRoleLabel = (role: UserRole): string =>
  ROLE_PERMISSIONS[role]?.label ?? 'Unknown'

export const getRoleColor = (role: UserRole): string =>
  ROLE_PERMISSIONS[role]?.color ?? 'gray'

/**
 * Legacy helper — kept so existing imports don't break. The real permission
 * check is done server-side; UI gating should read `permissionKeys` from
 * the current user (see `useAuth`) instead of a hardcoded feature map.
 *
 * Returns `false` for everything to make the deprecation visible: any UI
 * gated on this will hide itself, which is safer than showing content the
 * server may then reject.
 */
export const hasPermission = (
  _role: UserRole,
  _feature: string
): boolean => false