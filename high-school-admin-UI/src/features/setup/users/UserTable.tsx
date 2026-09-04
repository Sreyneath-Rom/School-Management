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
  users,
  selectedUserIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id))

  if (users.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-text-main/50 border border-text-main/10">
        <p className="font-semibold text-text-main">No Users Found</p>
        <p className="text-xs">Try adjusting your filters or add a new user account.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[26px] glass-sm border border-text-main/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-text-main/5 border-b border-text-main/10 text-xs font-bold uppercase tracking-wider text-text-main/60">
            <tr>
              <th className="w-12 px-5 py-4">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="rounded p-1 text-text-main/50 hover:text-text-main transition"
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
          <tbody className="divide-y divide-text-main/5">
            {users.map((user) => {
              const isSelected = selectedUserIds.includes(user.id)
              const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.student
              const fullName = getFullName(user)
              const detail = (user as any).class || (user as any).department || '—'

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-text-main/5 transition ${
                    isSelected ? 'bg-brand-500/5' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(user.id)}
                      className="rounded p-1 text-text-main/40 hover:text-text-main transition"
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
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white shadow-xs">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-text-main text-sm">{fullName}</p>
                        <p className="text-xs text-text-main/40 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}
                    >
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-text-main/10 text-text-main/50'
                      }`}
                    >
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-text-main/80">{detail}</td>

                  <td className="px-5 py-4 text-xs text-text-main/60">
                    <p className="truncate max-w-[160px]">{user.email}</p>
                    <p className="text-text-main/40">{user.phone || '—'}</p>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onResetPassword(user)}
                        className="rounded-lg p-1.5 text-text-main/50 hover:bg-amber-500/10 hover:text-amber-600 transition"
                        title="Reset Password"
                      >
                        <Key size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-1.5 text-text-main/50 hover:bg-brand-500/10 hover:text-brand-600 transition"
                        title="Edit User"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete user ${fullName}?`)) onDelete(user.id)
                        }}
                        className="rounded-lg p-1.5 text-text-main/50 hover:bg-error/10 hover:text-error transition"
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
