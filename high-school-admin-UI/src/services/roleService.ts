// src/services/roleService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateRolePayload,
  ModuleDef,
  PermissionDef,
  RoleDef,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from '@/types/roles'

// Module display metadata (icon initials, order) lives on the frontend —
// it's presentation-only, not something the backend needs to own.
// If new modules are added to Permission.key on the backend, add them here too.
export const MODULES: ModuleDef[] = [
  { id: 'school', label: 'School Profile', initial: 'SP' },
  { id: 'academicYears', label: 'Academic Years', initial: 'AY' },
  { id: 'rooms', label: 'Rooms & Facilities', initial: 'RM' },
  { id: 'gradeLevels', label: 'Grade Levels', initial: 'GL' },
  { id: 'terms', label: 'Terms & Grading Cycles', initial: 'TM' },
  { id: 'users', label: 'Users & Identity', initial: 'U' },
  { id: 'roles', label: 'Roles & RBAC', initial: 'RB' },
  { id: 'permissions', label: 'Permission Catalog', initial: 'PC' },
  { id: 'teachers', label: 'Teachers & Faculty', initial: 'TC' },
  { id: 'students', label: 'Students & Enrollees', initial: 'ST' },
  { id: 'classes', label: 'Classes & Sections', initial: 'CL' },
  { id: 'subjects', label: 'Subjects & Courses', initial: 'SB' },
  { id: 'schedules', label: 'Schedules & Timetables', initial: 'SC' },
  { id: 'exams', label: 'Exams & Mark Entry', initial: 'EX' },
  { id: 'grades', label: 'Grades & Records', initial: 'GR' },
  { id: 'attendance', label: 'Attendance', initial: 'AT' },
  { id: 'leaveRequests', label: 'Leave Requests', initial: 'LR' },
  { id: 'homework', label: 'Homework & Assignments', initial: 'HW' },
  { id: 'quizzes', label: 'Quizzes & Tests', initial: 'QZ' },
  { id: 'announcements', label: 'Announcements', initial: 'AN' },
  { id: 'notifications', label: 'Notifications', initial: 'NT' },
  { id: 'reports', label: 'Reports & Analytics', initial: 'RP' },
  { id: 'dashboard', label: 'Dashboard & Overview', initial: 'DB' },
  { id: 'translations', label: 'Translations', initial: 'TR' },
]

export const roleService = {
  getPermissionCatalog: () => apiClient.get<PermissionDef[]>('/permissions'),

  getRoles: () => apiClient.get<RoleDef[]>('/roles'),

  createRole: (payload: CreateRolePayload) => apiClient.post<RoleDef>('/roles', payload),

  updateRole: (roleId: string, payload: UpdateRolePayload) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}`, payload),

  deleteRole: (roleId: string) => apiClient.delete<void>(`/roles/${roleId}`),

  updateRolePermissions: (roleId: string, payload: UpdateRolePermissionsPayload) =>
    apiClient.patch<RoleDef>(`/roles/${roleId}/permissions`, payload),
}