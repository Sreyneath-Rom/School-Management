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
  { id: 'school', label: 'School Profile', initial: 'SP' },
  { id: 'academicYears', label: 'Academic Years', initial: 'AY' },
  { id: 'terms', label: 'Terms', initial: 'TM' },
  { id: 'users', label: 'Users', initial: 'U' },
  { id: 'teachers', label: 'Teachers', initial: 'T' },
  { id: 'students', label: 'Students', initial: 'S' },
  { id: 'roles', label: 'Roles & Security', initial: 'RB' },
  { id: 'grades', label: 'Grades & Levels', initial: 'GL' },
  { id: 'classes', label: 'Classes', initial: 'C' },
  { id: 'subjects', label: 'Subjects', initial: 'SB' },
  { id: 'schedules', label: 'Schedules', initial: 'SC' },
  { id: 'attendance', label: 'Attendance', initial: 'A' },
  { id: 'reports', label: 'Reports', initial: 'R' },
]

export const roleService = {
  getPermissionCatalog: () => apiClient.get<PermissionDef[]>('/permissions'),

  getRoles: () => apiClient.get<RoleDef[]>('/roles'),

  getRoleById: (roleId: string) => apiClient.get<RoleDef>(`/roles/${roleId}`),

  createRole: (payload: CreateRolePayload) => apiClient.post<RoleDef>('/roles', payload),

  updateRole: (roleId: string, payload: Partial<CreateRolePayload>) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}`, payload),

  deleteRole: (roleId: string) => apiClient.delete<void>(`/roles/${roleId}`),

  updateRolePermissions: (roleId: string, payload: UpdateRolePermissionsPayload) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}/permissions`, payload),
}