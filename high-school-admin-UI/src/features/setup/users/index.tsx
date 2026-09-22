// src/features/setup/users/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, LayoutGrid, List, RefreshCw, Download } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { UserStats } from './UserStats'
import { UserCardGrid } from './UserCardGrid'
import { UserTable } from './UserTable'
import { UserModal } from './UserModal'
import { UserResetPasswordModal } from './UserResetPasswordModal'
import { userService, type CreateUserPayload, type UpdateUserPayload } from '@/services/userService'
import type { SystemUser } from '@/types/user'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

const ROLE_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Users' },
  { id: 'admin', label: 'Admins' },
  { id: 'teacher', label: 'Teachers' },
  { id: 'student', label: 'Students' },
  { id: 'mazer', label: 'Mazers' },
]

export default function UsersFeature() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [selectedRoleTab, setSelectedRoleTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [userToEdit, setUserToEdit] = useState<SystemUser | null>(null)

  const [resetModalUser, setResetModalUser] = useState<SystemUser | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const { success, error: notifyError } = useNotification()

  const loadUsers = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await userService.list()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : []
    return safeUsers.filter((u) => {
      if (!u) return false
      const q = search.toLowerCase()
      const matchesSearch =
        !search.trim() ||
        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.id && u.id.toLowerCase().includes(q))
      const matchesRole = selectedRoleTab === 'all' || u.role === selectedRoleTab
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, selectedRoleTab, statusFilter])

  const handleToggleSelect = (id: string) => {
    setSelectedUserIds((prev) => {
      const list = Array.isArray(prev) ? prev : []
      return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    })
  }

  const handleToggleSelectAll = () => {
    if (filteredUsers.every((u) => selectedUserIds.includes(u.id))) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id))
    }
  }

  const handleCreateOrUpdateUser = async (data: CreateUserPayload) => {
    setIsSubmittingUser(true)
    try {
      if (userToEdit) {
        const updated = await userService.update(userToEdit.id, data as UpdateUserPayload)
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
        success(`Updated user ${updated.firstName} ${updated.lastName}`)
      } else {
        const created = await userService.create(data)
        setUsers((prev) => [created, ...prev])
        success(`Created user ${created.firstName} ${created.lastName}`)
      }
      setIsUserModalOpen(false)
      setUserToEdit(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to save user')
    } finally {
      setIsSubmittingUser(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setSelectedUserIds((prev) => prev.filter((uid) => uid !== id))
      success('User removed from system')
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to delete user')
    }
  }

  const handleConfirmResetPassword = async (userId: string, newPassword?: string) => {
    setIsResettingPassword(true)
    try {
      await userService.resetPassword(userId, newPassword)
      success('Password reset successfully')
      setResetModalUser(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to reset password')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleBulkStatus = async (status: 'active' | 'inactive') => {
    if (selectedUserIds.length === 0) return
    try {
      await userService.bulkStatusUpdate(selectedUserIds, status)
      setUsers((prev) =>
        prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status } : u))
      )
      success(`Updated status for ${selectedUserIds.length} users`)
      setSelectedUserIds([])
    } catch {
      notifyError('Failed to apply bulk update')
    }
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Role', 'FirstName', 'LastName', 'Email', 'Phone', 'Status']
    const rows = filteredUsers.map((u) => [
      u.id,
      u.role,
      `"${u.firstName}"`,
      `"${u.lastName}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      u.status,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `user_directory_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('Exported user directory to CSV')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="User Accounts & Identity Management"
          subtitle="Directory of school administration, faculty teachers, enrolled students, and assigned Mazers."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={() => { setUserToEdit(null); setIsUserModalOpen(true) }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus size={16} /> Add User
          </Button>
        </div>
      </div>

      <UserStats users={users} />

      {/* Filter bar — was `glass-sm border border-text-main/10`. Border was invisible. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl glass-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 sm:min-w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name, email, ID..."
              className="w-full rounded-full py-2 pl-9 pr-3 text-xs sm:text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {ROLE_TABS.map((tab) => {
              const isSelected = selectedRoleTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRoleTab(tab.id)}
                  // Role tabs: raised by default, brand-filled when active.
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                      : 'text-fg-muted hover:text-fg shadow-emboss hover:shadow-sunken'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-fg-muted">Status:</span>
            {/* `<select>` inherits the sunken-well look from globals.css */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full px-3 py-1.5 text-xs text-fg outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {selectedUserIds.length > 0 && (
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {selectedUserIds.length} selected
              </span>
              <button
                type="button"
                onClick={() => handleBulkStatus('active')}
                className="rounded-lg bg-success/15 text-success px-2.5 py-1 text-xs font-bold hover:bg-success/25 transition cursor-pointer"
              >
                Activate
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus('inactive')}
                className="rounded-lg bg-error/15 text-error px-2.5 py-1 text-xs font-bold hover:bg-error/25 transition cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={loadUsers}
            className="rounded-xl p-2 text-fg-muted hover:text-fg hover:shadow-sunken transition"
            title="Refresh list"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {/* View toggle: sunken tray, active segment brand-filled */}
          <div className="flex items-center rounded-2xl p-1 shadow-sunken">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          {/* `border-3` isn't a valid Tailwind width — border-2 */}
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-fg-muted">Loading user accounts...</p>
        </div>
      ) : loadError ? (
        // Semantic error — tinted bg + border carries the signal
        <div className="rounded-3xl bg-error/10 border border-error/25 p-6 text-center text-error">
          <p className="font-bold mb-1">Failed to load users</p>
          <p className="text-xs">{loadError}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <UserCardGrid
          users={filteredUsers}
          selectedUserIds={selectedUserIds}
          onToggleSelect={handleToggleSelect}
          onEdit={(u) => { setUserToEdit(u); setIsUserModalOpen(true) }}
          onDelete={handleDeleteUser}
          onResetPassword={(u) => setResetModalUser(u)}
        />
      ) : (
        <UserTable
          users={filteredUsers}
          selectedUserIds={selectedUserIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEdit={(u) => { setUserToEdit(u); setIsUserModalOpen(true) }}
          onDelete={handleDeleteUser}
          onResetPassword={(u) => setResetModalUser(u)}
        />
      )}

      <UserModal
        isOpen={isUserModalOpen}
        isSubmitting={isSubmittingUser}
        userToEdit={userToEdit}
        onClose={() => { setIsUserModalOpen(false); setUserToEdit(null) }}
        onSubmit={handleCreateOrUpdateUser}
      />

      <UserResetPasswordModal
        isOpen={!!resetModalUser}
        user={resetModalUser}
        isSubmitting={isResettingPassword}
        onClose={() => setResetModalUser(null)}
        onConfirm={handleConfirmResetPassword}
      />
    </div>
  )
}