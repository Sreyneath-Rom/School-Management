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
  { id: 'school', label: 'School Profile', initial: 'SP' },
  { id: 'academicYears', label: 'Academic Years', initial: 'AY' },
  { id: 'terms', label: 'Terms & Cycles', initial: 'TM' },
  { id: 'users', label: 'Users & Identity', initial: 'U' },
  { id: 'teachers', label: 'Teachers & Faculty', initial: 'TC' },
  { id: 'students', label: 'Students & Enrollees', initial: 'ST' },
  { id: 'roles', label: 'Roles & RBAC', initial: 'RB' },
  { id: 'grades', label: 'Grades & Levels', initial: 'GL' },
  { id: 'classes', label: 'Classes & Sections', initial: 'CL' },
  { id: 'subjects', label: 'Subjects & Courses', initial: 'SB' },
  { id: 'schedules', label: 'Schedules & Timetables', initial: 'SC' },
  { id: 'attendance', label: 'Attendance', initial: 'AT' },
  { id: 'homework', label: 'Homework & Assignments', initial: 'HW' },
  { id: 'reports', label: 'Reports & Analytics', initial: 'RP' },
  { id: 'dashboard', label: 'Dashboard & Overview', initial: 'DB' },
]

export const roleService = {
  getPermissionCatalog: () => apiClient.get<PermissionDef[]>('/permissions'),

  getRoles: () => apiClient.get<RoleDef[]>('/roles'),

  createRole: (payload: CreateRolePayload) => apiClient.post<RoleDef>('/roles', payload),

  updateRolePermissions: (roleId: string, payload: UpdateRolePermissionsPayload) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}/permissions`, payload),
}