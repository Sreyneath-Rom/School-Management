// Suggested path: @/components/users/UserList.tsx

import { useMemo, useState, type ReactNode } from 'react'
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Pencil,
  Trash2,
  KeyRound,
  Check,
  X,
  UserPlus,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useNotification } from '@/hooks/useNotification'
import Button from '@/components/common/Button'
import UserDetail from '@/components/users/UserDetail'
import { mockUserDirectory } from '@/data/mockUserDirectory'
import {
  type SystemUser,
  type UserRole,
  type UserStatus,
  ROLE_LABELS,
  ROLE_COLORS,
  getFullName,
  getDisplayClass,
  getDisplayDepartment,
  getDisplayGrade,
  getDisplayAcademicYear,
} from '@/types/user'

type SearchField = 'all' | 'id' | 'name' | 'username' | 'email' | 'phone'
type SortField = 'name' | 'role' | 'status' | 'createdDate'
type SortOrder = 'asc' | 'desc'

const SEARCH_FIELD_LABELS: Record<SearchField, string> = {
  all: 'All fields',
  id: 'User ID',
  name: 'Name',
  username: 'Username',
  email: 'Email',
  phone: 'Phone',
}

export default function UserList() {
  const [users] = useState<SystemUser[]>(mockUserDirectory)

  // ---- Search -------------------------------------------------------------
  const [searchField, setSearchField] = useState<SearchField>('all')
  const [searchInput, setSearchInput] = useState('')
  const searchQuery = useDebounce(searchInput, 300)

  // ---- Filters --------------------------------------------------------------
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [academicYearFilter, setAcademicYearFilter] = useState('all')

  // ---- Sort -------------------------------------------------------------
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // ---- Selection (bulk actions) --------------------------------------------
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // ---- Detail drawer --------------------------------------------------------
  const [viewingUser, setViewingUser] = useState<SystemUser | null>(null)

  const { success, info, notifications, removeNotification } = useNotification()

  // ---- Derived filter option lists ------------------------------------------
  const grades = useMemo(() => uniqueSorted(users.map(getDisplayGrade).filter(isString)), [users])
  const classes = useMemo(() => uniqueSorted(users.map(getDisplayClass).filter(isString)), [users])
  const departments = useMemo(() => uniqueSorted(users.map(getDisplayDepartment).filter(isString)), [users])
  const academicYears = useMemo(
    () => uniqueSorted(users.map(getDisplayAcademicYear).filter(isString)),
    [users]
  )

  const hasActiveFilters =
    searchInput.trim() !== '' ||
    roleFilter !== 'all' ||
    statusFilter !== 'all' ||
    gradeFilter !== 'all' ||
    classFilter !== 'all' ||
    departmentFilter !== 'all' ||
    academicYearFilter !== 'all'

  const clearFilters = () => {
    setSearchInput('')
    setRoleFilter('all')
    setStatusFilter('all')
    setGradeFilter('all')
    setClassFilter('all')
    setDepartmentFilter('all')
    setAcademicYearFilter('all')
  }

  // ---- Filter + search + sort pipeline --------------------------------------
  const processedUsers = useMemo(() => {
    let result = users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (gradeFilter !== 'all' && getDisplayGrade(u) !== gradeFilter) return false
      if (classFilter !== 'all' && getDisplayClass(u) !== classFilter) return false
      if (departmentFilter !== 'all' && getDisplayDepartment(u) !== departmentFilter) return false
      if (academicYearFilter !== 'all' && getDisplayAcademicYear(u) !== academicYearFilter) return false
      return true
    })

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((u) => {
        const fullName = getFullName(u).toLowerCase()
        switch (searchField) {
          case 'id':
            return u.id.toLowerCase().includes(q)
          case 'name':
            return fullName.includes(q)
          case 'username':
            return u.username.toLowerCase().includes(q)
          case 'email':
            return u.email.toLowerCase().includes(q)
          case 'phone':
            return u.phone.toLowerCase().includes(q)
          case 'all':
          default:
            return (
              u.id.toLowerCase().includes(q) ||
              fullName.includes(q) ||
              u.username.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.phone.toLowerCase().includes(q)
            )
        }
      })
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = getFullName(a).localeCompare(getFullName(b))
          break
        case 'role':
          cmp = a.role.localeCompare(b.role)
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
        case 'createdDate':
          cmp = a.createdDate.localeCompare(b.createdDate)
          break
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [
    users,
    roleFilter,
    statusFilter,
    gradeFilter,
    classFilter,
    departmentFilter,
    academicYearFilter,
    searchQuery,
    searchField,
    sortField,
    sortOrder,
  ])

  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(processedUsers, 8)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAllOnPage = () => {
    const pageIds = currentItems.map((u) => u.id)
    const allSelected = pageIds.every((id) => selectedIds.has(id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)))
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  // ---- Bulk / row action handlers (wire these up to real API calls later) ----
  const handleBulkActivate = () => {
    success(`${selectedIds.size} user(s) activated`)
    clearSelection()
  }
  const handleBulkDeactivate = () => {
    info(`${selectedIds.size} user(s) deactivated`)
    clearSelection()
  }
  const handleBulkDelete = () => {
    info(`${selectedIds.size} user(s) deleted`)
    clearSelection()
  }
  const handleBulkResetPassword = () => {
    success(`Password reset for ${selectedIds.size} user(s)`)
    clearSelection()
  }
  const handleView = (user: SystemUser) => {
    setViewingUser(user)
  }
  const handleEdit = (user: SystemUser) => {
    // TODO: open an edit form/modal once one exists
    info(`Edit form for ${getFullName(user)} isn't built yet`)
  }
  const handleResetPassword = (user: SystemUser) => {
    success(`Password reset for ${getFullName(user)}`)
  }
  const handleDelete = (user: SystemUser) => {
    info(`${getFullName(user)} deleted`)
  }

  const pageAllSelected = currentItems.length > 0 && currentItems.every((u) => selectedIds.has(u.id))

  return (
    <div className="w-full">
      {/* Toasts */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl px-4 py-3 text-sm shadow-lg flex items-start justify-between gap-2 ${
                n.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : n.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              <span>{n.message}</span>
              <button
                onClick={() => removeNotification(n.id)}
                aria-label="Dismiss notification"
                className="opacity-80 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {totalItems} user{totalItems === 1 ? '' : 's'} across all roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-full glass-sm px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
            <Upload size={16} /> Import
          </button>
          <button className="flex items-center gap-1.5 rounded-full glass-sm px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition">
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass-strong rounded-3xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-60">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            aria-label="Search field"
            className="rounded-full bg-white/70 border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {Object.entries(SEARCH_FIELD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users..."
              aria-label="Search users"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white/70 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <FilterSelect
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v as UserRole, label: l }))}
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'active' as UserStatus, label: 'Active' },
            { value: 'inactive' as UserStatus, label: 'Inactive' },
          ]}
        />
        <FilterSelect label="Grade" value={gradeFilter} onChange={setGradeFilter} options={grades.map((g) => ({ value: g, label: g }))} />
        <FilterSelect label="Class" value={classFilter} onChange={setClassFilter} options={classes.map((c) => ({ value: c, label: c }))} />
        <FilterSelect
          label="Department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={departments.map((d) => ({ value: d, label: d }))}
        />
        <FilterSelect
          label="Academic Year"
          value={academicYearFilter}
          onChange={setAcademicYearFilter}
          options={academicYears.map((y) => ({ value: y, label: y }))}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700 underline underline-offset-2 transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="glass-strong rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-800">{selectedIds.size} selected</span>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleBulkActivate} className="rounded-full glass-sm px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Activate
            </Button>
            <Button onClick={handleBulkDeactivate} className="rounded-full glass-sm px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Deactivate
            </Button>
            <Button onClick={handleBulkResetPassword} className="rounded-full glass-sm px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Reset Password
            </Button>
            <Button onClick={handleBulkDelete} className="rounded-full bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-semibold text-white">
              Delete
            </Button>
            <Button onClick={clearSelection} className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left text-slate-500">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={pageAllSelected}
                    onChange={toggleSelectAllOnPage}
                    aria-label="Select all users on this page"
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </th>
                <th className="px-2 py-3 w-12"></th>
                <th className="px-2 py-3 font-medium">User ID</th>
                <SortableHeader label="Full Name" field="name" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <SortableHeader label="Role" field="role" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Class</th>
                <SortableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <SortableHeader label="Created" field="createdDate" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.has(user.id)}
                  onToggleSelect={() => toggleSelect(user.id)}
                  onView={() => handleView(user)}
                  onEdit={() => handleEdit(user)}
                  onResetPassword={() => handleResetPassword(user)}
                  onDelete={() => handleDelete(user)}
                />
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-16 text-center text-slate-500">
                    <p className="font-medium text-slate-700">No users match these filters</p>
                    <p className="text-sm mt-1">Try a different search term or clear a filter to see more.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-200/70">
            <p className="text-xs text-slate-500">
              Showing {startIndex}–{endIndex} of {totalItems}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`w-7 h-7 rounded-full text-xs font-medium transition ${
                    page === currentPage ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDetail
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onEdit={(user) => {
          setViewingUser(null)
          handleEdit(user)
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function SortableHeader({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
}: {
  label: string
  field: SortField
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}) {
  const active = sortField === field
  return (
    <th className="px-4 py-3 font-medium">
      <button onClick={() => onSort(field)} className="flex items-center gap-1 hover:text-slate-800 transition">
        {label}
        {active ? (
          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ChevronsUpDown size={14} className="opacity-40" />
        )}
      </button>
    </th>
  )
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T | 'all'
  onChange: (value: T | 'all') => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | 'all')}
      aria-label={label}
      className="rounded-full bg-white/70 border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="all">{label}: All</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function UserRow({
  user,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onResetPassword,
  onDelete,
}: {
  user: SystemUser
  selected: boolean
  onToggleSelect: () => void
  onView: () => void
  onEdit: () => void
  onResetPassword: () => void
  onDelete: () => void
}) {
  const roleColor = ROLE_COLORS[user.role]
  const displayClass = getDisplayClass(user)
  const fullName = getFullName(user)

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label={`Select ${fullName}`}
          className="w-4 h-4 accent-teal-500 rounded"
        />
      </td>
      <td className="px-2 py-3">
        {user.profilePhoto ? (
          <img src={user.profilePhoto} alt="" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}
      </td>
      <td className="px-2 py-3 font-mono text-xs text-slate-500">{user.id}</td>
      <td className="px-4 py-3 font-medium text-slate-800">{fullName}</td>
      <td className="px-4 py-3 text-slate-600">{user.username}</td>
      <td className="px-4 py-3 text-slate-600">{user.email}</td>
      <td className="px-4 py-3 text-slate-600">{user.phone}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleColor.bg} ${roleColor.text} ${roleColor.ring}`}>
          {ROLE_LABELS[user.role]}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{displayClass ?? '—'}</td>
      <td className="px-4 py-3">
        {user.status === 'active' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-medium">
            <Check size={12} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 text-slate-600 px-2.5 py-1 text-xs font-medium">
            <X size={12} /> Inactive
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-500 text-xs">{user.createdDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <IconButton title="View profile" onClick={onView}>
            <Eye size={16} />
          </IconButton>
          <IconButton title="Edit user" onClick={onEdit}>
            <Pencil size={16} />
          </IconButton>
          <IconButton title="Reset password" onClick={onResetPassword}>
            <KeyRound size={16} />
          </IconButton>
          <IconButton title="Delete user" onClick={onDelete} danger>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}

function IconButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: ReactNode
  title: string
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`p-1.5 rounded-full transition ${
        danger ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function isString(value: string | null): value is string {
  return value !== null
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort()
}