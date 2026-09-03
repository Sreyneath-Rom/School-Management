// src/features/setup/roles/RoleCardList.tsx
import React from 'react'
import { Shield, Check, Lock } from 'lucide-react'
import type { RoleDef } from '@/types/roles'

interface RoleCardListProps {
  roles?: RoleDef[]
  selectedRoleId: string | null
  onSelectRole: (id: string) => void
}

export const RoleCardList: React.FC<RoleCardListProps> = ({
  roles = [],
  selectedRoleId,
  onSelectRole,
}) => {
  const safeRoles = Array.isArray(roles) ? roles : []
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {safeRoles.map((role) => {
        const isSelected = selectedRoleId === role.id
        const permissionCount = role.permissionIds?.length || 0

        return (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-all cursor-pointer border ${
              isSelected
                ? 'bg-brand-500/10 border-brand-500/60 shadow-lg ring-2 ring-brand-500/20'
                : 'glass-sm border-text-main/10 hover:border-brand-500/30 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    role.isSystem ? 'bg-amber-500/15 text-amber-500' : 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
                  }`}
                >
                  <Shield size={22} />
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  {role.isSystem ? (
                    <span className="flex items-center gap-1 rounded-full bg-text-main/10 px-2 py-0.5 text-[10px] font-bold text-text-main/60">
                      <Lock size={10} /> System
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-300">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-1.5">
                  {role.name}
                  {isSelected && <Check size={16} className="text-brand-500" />}
                </h3>
                <p className="mt-1 text-xs text-text-main/60 line-clamp-2 leading-relaxed">
                  {role.label || 'Custom security role for portal access management.'}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-text-main/10 pt-3.5 flex items-center justify-between text-xs font-semibold text-text-main/70">
              <span className="rounded-full bg-text-main/10 px-2.5 py-0.5 text-[11px] font-mono">
                {role.id}
              </span>
              <span className="rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 px-2.5 py-0.5 text-[11px] font-bold">
                {permissionCount} permissions
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
