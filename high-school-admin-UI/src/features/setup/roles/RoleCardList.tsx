// src/features/setup/roles/RoleCardList.tsx
import React from 'react'
import { Shield, Check, Lock, Pencil, Trash2 } from 'lucide-react'
import type { RoleDef } from '@/types/roles'

interface RoleCardListProps {
  roles?: RoleDef[]
  selectedRoleId: string | null
  onSelectRole: (id: string) => void
  onEditRole: (role: RoleDef) => void
  onDeleteRole: (role: RoleDef) => void
}

export const RoleCardList: React.FC<RoleCardListProps> = ({
  roles = [], selectedRoleId, onSelectRole, onEditRole, onDeleteRole,
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
            // Selected: sunken well + brand text. Unselected: raised
            // surface + hover flips to sunken (the classic neumorphic
            // selection gesture). Both remain flat, no border.
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-all cursor-pointer ${
              isSelected
                ? 'shadow-sunken ring-1 ring-brand-500/30'
                : 'glass-sm hover:shadow-sunken'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sunken ${
                    role.isSystem
                      ? 'bg-warning/15 text-warning'
                      : 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
                  }`}
                >
                  <Shield size={22} />
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  {/* System/custom badge — tinted chip with tinted text.
                      The bg tint is a status signal, so it stays. */}
                  {role.isSystem ? (
                    <span className="flex items-center gap-1 rounded-full bg-fg-muted/15 px-2 py-0.5 text-[10px] font-bold text-fg-muted">
                      <Lock size={10} /> System
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-300">
                      Custom
                    </span>
                  )}
                  {!role.isSystem && (
                    <>
                      <button
                        type="button"
                        aria-label={`Edit ${role.name}`}
                        onClick={(event) => { event.stopPropagation(); onEditRole(role) }}
                        className="rounded-full p-1 text-fg-muted hover:text-fg hover:shadow-sunken"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${role.name}`}
                        onClick={(event) => { event.stopPropagation(); onDeleteRole(role) }}
                        className="rounded-full p-1 text-fg-muted hover:text-error hover:shadow-sunken"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-fg flex items-center gap-1.5">
                  {role.name}
                  {isSelected && <Check size={16} className="text-brand-500" />}
                </h3>
                <p className="mt-1 text-xs text-fg-muted line-clamp-2 leading-relaxed">
                  {role.label || 'Custom security role for portal access management.'}
                </p>
              </div>
            </div>

            {/* Footer strip: shadow seam replaces the invisible border,
                badges sit in small sunken wells. */}
            <div className="mt-5 pt-3.5 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-between text-xs font-semibold">
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-mono text-fg-muted shadow-sunken">
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