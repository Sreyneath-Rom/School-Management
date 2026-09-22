// src/features/setup/users/UserCardGrid.tsx
import React from 'react'
import { Edit2, Trash2, Key, Mail, Phone, User } from 'lucide-react'
import type { SystemUser } from '@/types/user'
import { ROLE_COLORS, ROLE_LABELS, getFullName } from '@/types/user'

interface UserCardGridProps {
  users: SystemUser[]
  selectedUserIds: string[]
  onToggleSelect: (id: string) => void
  onEdit: (user: SystemUser) => void
  onDelete: (id: string) => void
  onResetPassword: (user: SystemUser) => void
}

export const UserCardGrid: React.FC<UserCardGridProps> = ({
  users, selectedUserIds, onToggleSelect, onEdit, onDelete, onResetPassword,
}) => {
  if (users.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-fg-muted">
        <User size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-fg">No Users Found</p>
        <p className="text-xs">Try adjusting your search or role filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => {
        const isSelected = selectedUserIds.includes(user.id)
        const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.student
        const fullName = getFullName(user)

        return (
          <div
            key={user.id}
            onClick={() => onToggleSelect(user.id)}
            // Selected = sunken well + brand ring. Unselected = raised
            // surface, hover flips to sunken. Border removed (was invisible).
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-all cursor-pointer ${
              isSelected
                ? 'shadow-sunken ring-1 ring-brand-500/30'
                : 'glass-sm hover:shadow-sunken'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white shadow-sm shadow-brand-600/25">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-bold text-sm text-fg">{fullName}</h3>
                    </div>
                    <p className="text-xs text-fg-muted font-mono">{user.id}</p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onResetPassword(user)}
                    className="rounded-lg p-1.5 text-fg-muted hover:text-warning hover:shadow-sunken transition"
                    title="Reset Password"
                  >
                    <Key size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="rounded-lg p-1.5 text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition"
                    title="Edit User"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete user ${fullName}?`)) onDelete(user.id)
                    }}
                    className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition"
                    title="Delete User"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {/* Role chip: semantic tint from ROLE_COLORS — kept */}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
                  {ROLE_LABELS[user.role]}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    user.status === 'active'
                      ? 'bg-success/15 text-success'
                      : 'text-fg-muted shadow-sunken'
                  }`}
                >
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                {(user as any).class && (
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-fg shadow-sunken">
                    {(user as any).class}
                  </span>
                )}
                {(user as any).department && (
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-fg-muted shadow-sunken">
                    {(user as any).department}
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-fg-muted">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={13} className="shrink-0 text-fg-muted/70" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 truncate">
                    <Phone size={13} className="shrink-0 text-fg-muted/70" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-between text-[11px] text-fg-muted/70">
              <span>Added {user.createdDate || 'Recently'}</span>
              <span className="capitalize">{user.gender || 'Not specified'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}