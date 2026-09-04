// src/types/roles.ts

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete']

/** A single grantable permission, e.g. { moduleId: "users", action: "edit" } */
export interface PermissionDef {
  id: string
  key: string // e.g. "users.edit" — matches Permission.key in the Prisma schema
  moduleId: string
  action: PermissionAction
}

export interface ModuleDef {
  id: string
  label: string
  initial: string
}

export interface RoleDef {
  id: string
  name: string
  label: string
  initial: string
  isSystem?: boolean // true for built-in roles like "super-admin" that can't be deleted
  permissionIds: string[] // ids of PermissionDef currently granted to this role
}

export interface CreateRolePayload {
  name: string
  label: string
}

export interface UpdateRolePermissionsPayload {
  permissionIds: string[] // full replacement set for the role
}