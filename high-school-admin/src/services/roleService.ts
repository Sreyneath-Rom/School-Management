// src/services/roleService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateRolePayload,
  ModuleDef,
  PermissionDef,
  RoleDef,
  UpdateRolePermissionsPayload,
} from '@/types/roles'

// Module display metadata (icon initials, order) lives on the frontend —
// it's presentation-only, not something the backend needs to own.
// If new modules are added to Permission.key on the backend, add them here too.
export const MODULES: ModuleDef[] = [
  { id: 'dashboard', label: 'Dashboard', initial: 'DB' },
  { id: 'users', label: 'Users', initial: 'U' },
  { id: 'classes', label: 'Classes', initial: 'C' },
  { id: 'subjects', label: 'Subjects', initial: 'SB' },
  { id: 'schedules', label: 'Schedules', initial: 'SC' },
  { id: 'attendance', label: 'Attendance', initial: 'A' },
  { id: 'grades', label: 'Grades', initial: 'G' },
  { id: 'reports', label: 'Reports', initial: 'R' },
]

export const roleService = {
  getPermissionCatalog: () => apiClient.get<PermissionDef[]>('/permissions'),

  getRoles: () => apiClient.get<RoleDef[]>('/roles'),

  createRole: (payload: CreateRolePayload) => apiClient.post<RoleDef>('/roles', payload),

  updateRolePermissions: (roleId: string, payload: UpdateRolePermissionsPayload) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}/permissions`, payload),
}