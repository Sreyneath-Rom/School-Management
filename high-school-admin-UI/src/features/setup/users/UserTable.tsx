// src/features/setup/users/UserTable.tsx
import React from 'react'
import { Edit2, Trash2, Key, CheckSquare, Square } from 'lucide-react'
import type { SystemUser } from '@/types/user'
import { ROLE_COLORS, ROLE_LABELS, getFullName } from '@/types/user'

interface UserTableProps {
  users: SystemUser[]
  selectedUserIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onEdit: (user: SystemUser) => void
  onDelete: (id: string) => void
  onResetPassword: (user: SystemUser) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users, selectedUserIds, onToggleSelect, onToggleSelectAll,
  onEdit, onDelete, onResetPassword,
}) => {
  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id))

  if (users.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-fg-muted">
        <p className="font-semibold text-fg">No Users Found</p>
        <p className="text-xs">Try adjusting your filters or add a new user account.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[26px] glass-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-bold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <tr>
              <th className="w-12 px-5 py-4">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="rounded p-1 text-fg-muted hover:text-fg transition"
                >
                  {isAllSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              </th>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Class / Dept</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {users.map((user) => {
              const isSelected = selectedUserIds.includes(user.id)
              const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.student
              const fullName = getFullName(user)
              const detail = (user as any).class || (user as any).department || '—'

              return (
                <tr
                  key={user.id}
                  // Row hover → sunken shadow. Selected row → sunken shadow
                  // (persistent), which is the neumorphic equivalent of a
                  // highlighted row.
                  className={`transition-shadow ${
                    isSelected
                      ? 'shadow-sunken'
                      : 'hover:shadow-sunken'
                  }`}
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(user.id)}
                      className="rounded p-1 text-fg-muted hover:text-fg transition"
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-brand-600 dark:text-brand-400" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white shadow-sm shadow-brand-600/25">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-fg text-sm">{fullName}</p>
                        <p className="text-xs text-fg-muted/70 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-success/15 text-success'
                          : 'text-fg-muted shadow-sunken'
                      }`}
                    >
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-fg-muted">{detail}</td>

                  <td className="px-5 py-4 text-xs text-fg-muted">
                    <p className="truncate max-w-40">{user.email}</p>
                    <p className="text-fg-muted/70">{user.phone || '—'}</p>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onResetPassword(user)}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-warning hover:shadow-sunken transition"
                        title="Reset Password"
                      >
                        <Key size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition"
                        title="Edit User"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete user ${fullName}?`)) onDelete(user.id)
                        }}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}