// src/features/setup/roles/RoleStats.tsx
import React from 'react'
import { Shield, ShieldCheck, UserCheck, Key } from 'lucide-react'
import type { RoleDef, PermissionDef } from '@/types/roles'

interface RoleStatsProps {
  roles?: RoleDef[]
  catalog?: PermissionDef[]
  activeRole: RoleDef | null
}

export const RoleStats: React.FC<RoleStatsProps> = ({ roles = [], catalog = [], activeRole }) => {
  const safeRoles = Array.isArray(roles) ? roles : []
  const systemRolesCount = safeRoles.filter((r) => r && r.isSystem).length
  const customRolesCount = safeRoles.filter((r) => r && !r.isSystem).length
  const activePermsCount = activeRole && Array.isArray(activeRole.permissionIds) ? activeRole.permissionIds.length : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[24px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
            <Shield size={20} />
          </div>
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Active
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Defined Roles</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{safeRoles.length}</p>
      </div>

      <div className="rounded-[24px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck size={20} />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            Protected
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">System Roles</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{systemRolesCount}</p>
      </div>

      <div className="rounded-[24px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <UserCheck size={20} />
          </div>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-300">
            Custom
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Custom Roles</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{customRolesCount}</p>
      </div>

      <div className="rounded-[24px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Key size={20} />
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
            {activePermsCount} Active
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Permission Nodes</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{catalog.length}</p>
      </div>
    </div>
  )
}
