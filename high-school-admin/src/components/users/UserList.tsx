import { useEffect, useMemo, useRef, useState } from 'react'
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
  MoreVertical,
} from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useNotification } from '@/hooks/useNotification'
import Button from '@/components/common/Button'
import PageHeading from '@/components/common/PageHeading'
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

export default function UserList({ showHeading = true }: { showHeading?: boolean }) {
  const [users] = useState<SystemUser[]>(mockUserDirectory)

  const [searchField, setSearchField] = useState<SearchField>('all')
  const [searchInput, setSearchInput] = useState('')
  const searchQuery = useDebounce(searchInput, 300)

  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [academicYearFilter, setAcademicYearFilter] = useState('all')

  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewingUser, setViewingUser] = useState<SystemUser | null>(null)

  const { success, info, notifications, removeNotification } = useNotification()

  const grades = useMemo(() => uniqueSorted(users.map(getDisplayGrade).filter(isString)), [users])
  const classes = useMemo(() => uniqueSorted(users.map(getDisplayClass).filter(isString)), [users])
  const departments = useMemo(() => uniqueSorted(users.map(getDisplayDepartment).filter(isString)), [users])
  const academicYears = useMemo(() => uniqueSorted(users.map(getDisplayAcademicYear).filter(isString)), [users])

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
          case 'id': return u.id.toLowerCase().includes(q)
          case 'name': return fullName.includes(q)
          case 'username': return u.username.toLowerCase().includes(q)
          case 'email': return u.email.toLowerCase().includes(q)
          case 'phone': return u.phone.toLowerCase().includes(q)
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
        case 'name': cmp = getFullName(a).localeCompare(getFullName(b)); break
        case 'role': cmp = a.role.localeCompare(b.role); break
        case 'status': cmp = a.status.localeCompare(b.status); break
        case 'createdDate': cmp = a.createdDate.localeCompare(b.createdDate); break
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [
    users, roleFilter, statusFilter, gradeFilter, classFilter,
    departmentFilter, academicYearFilter, searchQuery, searchField, sortField, sortOrder,
  ])

  const { currentItems, currentPage, totalPages, totalItems, startIndex, endIndex, goToPage, nextPage, prevPage } =
    usePagination(processedUsers, 8)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortOrder('asc') }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
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

  const handleBulkActivate = () => { success(`${selectedIds.size} user(s) activated`); clearSelection() }
  const handleBulkDeactivate = () => { info(`${selectedIds.size} user(s) deactivated`); clearSelection() }
  const handleBulkDelete = () => { info(`${selectedIds.size} user(s) deleted`); clearSelection() }
  const handleBulkResetPassword = () => { success(`Password reset for ${selectedIds.size} user(s)`); clearSelection() }

  const pageAllSelected = currentItems.length > 0 && currentItems.every((u) => selectedIds.has(u.id))

  return (
    <div className="w-full text-text-main">
      {/* Toast Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl px-4 py-3 text-sm glass-strong flex items-start justify-between gap-2 shadow-lg ${
                n.type === 'success' ? 'border-l-4 border-success' : n.type === 'error' ? 'border-l-4 border-error' : 'border-l-4 border-info'
              }`}
            >
              <span>{n.message}</span>
              <button onClick={() => removeNotification(n.id)} className="opacity-70 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showHeading && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <PageHeading title="User Management" subtitle={`${totalItems} user${totalItems === 1 ? '' : 's'} across all roles`} />
          <div className="flex flex-wrap items-center gap-2">
            <button className="glass glass-interactive flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-text-main">
              <Upload size={16} /> Import
            </button>
            <button className="glass glass-interactive flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-text-main">
              <Download size={16} /> Export
            </button>
            <button className="glass-teal glass-interactive flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white">
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </div>
      )}

      {/* Search & Dynamic Filters */}
      <div className="glass-strong rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 min-w-0 sm:min-w-60">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            className="glass rounded-full px-3 py-2 text-xs sm:text-sm text-text-main focus:outline-none shrink-0"
          >
            {Object.entries(SEARCH_FIELD_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-slate-800 text-white">{label}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-2.5 text-text-main/50" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users..."
              className="glass w-full pl-9 pr-3 py-2 rounded-full text-xs sm:text-sm text-text-main placeholder:text-text-main/40 focus:outline-none"
            />
          </div>
        </div>

        <FilterSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v as UserRole, label: l }))} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        <FilterSelect label="Grade" value={gradeFilter} onChange={setGradeFilter} options={grades.map((g) => ({ value: g, label: g }))} />
        <FilterSelect label="Class" value={classFilter} onChange={setClassFilter} options={classes.map((c) => ({ value: c, label: c }))} />
        <FilterSelect label="Department" value={departmentFilter} onChange={setDepartmentFilter} options={departments.map((d) => ({ value: d, label: d }))} />
        <FilterSelect label="Academic Year" value={academicYearFilter} onChange={setAcademicYearFilter} options={academicYears.map((y) => ({ value: y, label: y }))} />

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm font-semibold text-brand-400 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.size > 0 && (
        <div className="glass-teal rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-white">{selectedIds.size} selected</span>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleBulkActivate} className="glass-sm rounded-full px-3 py-1 text-xs text-white">Activate</Button>
            <Button onClick={handleBulkDeactivate} className="glass-sm rounded-full px-3 py-1 text-xs text-white">Deactivate</Button>
            <Button onClick={handleBulkResetPassword} className="glass-sm rounded-full px-3 py-1 text-xs text-white">Reset Password</Button>
            <Button onClick={handleBulkDelete} className="bg-error rounded-full px-3 py-1 text-xs text-white">Delete</Button>
            <Button onClick={clearSelection} className="glass-sm glass-interactive rounded-full px-3 py-1 text-xs text-white/80">Clear</Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-text-main/10 text-left text-text-main/60">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={pageAllSelected} onChange={toggleSelectAllOnPage} className="w-4 h-4 accent-brand-500" />
                </th>
                <th className="px-2 py-3 w-12"></th>
                <th className="px-2 py-3 font-medium">User ID</th>
                <SortableHeader label="Full Name" field="name" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <SortableHeader label="Role" field="role" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                <th className="px-4 py-3 font-medium">Class</th>
                <SortableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
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
                  onView={() => setViewingUser(user)}
                  onEdit={() => info(`Edit form for ${getFullName(user)} standardizing...`)}
                  onResetPassword={() => success(`Password reset for ${getFullName(user)}`)}
                  onDelete={() => info(`${getFullName(user)} deleted`)}
                />
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-text-main/60">
                    <p className="font-medium text-text-main">No users match these filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalItems > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-text-main/10">
            <p className="text-xs text-text-main/60">Showing {startIndex}–{endIndex} of {totalItems}</p>
            <div className="flex items-center gap-1">
              <button onClick={prevPage} disabled={currentPage === 1} className="p-1.5 rounded-full hover:bg-text-main/10 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold ${page === currentPage ? 'glass-teal text-white' : 'text-text-main/70 hover:bg-text-main/10'}`}
                >
                  {page}
                </button>
              ))}
              <button onClick={nextPage} disabled={currentPage === totalPages} className="p-1.5 rounded-full hover:bg-text-main/10 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDetail user={viewingUser} onClose={() => setViewingUser(null)} />
    </div>
  )
}

interface SortableHeaderProps {
  label: string
  field: SortField
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

function SortableHeader({ label, field, sortField, sortOrder, onSort }: SortableHeaderProps) {
  const active = sortField === field
  return (
    <th className="px-4 py-3 font-medium">
      <button onClick={() => onSort(field)} className="flex items-center gap-1 hover:text-text-main transition">
        {label}
        {active ? (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronsUpDown size={14} className="opacity-40" />}
      </button>
    </th>
  )
}

interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterSelectProps<T extends string> {
  label: string
  value: T | 'all'
  onChange: (value: T | 'all') => void
  options: FilterOption<T>[]
}

function FilterSelect<T extends string>({ label, value, onChange, options }: FilterSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | 'all')}
      className="glass rounded-full px-3 py-2 text-sm text-text-main focus:outline-none"
    >
      <option value="all" className="bg-slate-800 text-white">{label}: All</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">{opt.label}</option>
      ))}
    </select>
  )
}

interface UserRowProps {
  user: SystemUser
  selected: boolean
  onToggleSelect: () => void
  onView: () => void
  onEdit: () => void
  onResetPassword: () => void
  onDelete: () => void
}

function UserRow({ user, selected, onToggleSelect, onView, onEdit, onResetPassword, onDelete }: UserRowProps) {
  const roleColor = ROLE_COLORS[user.role]
  const fullName = getFullName(user)

  return (
    <tr className="border-b border-text-main/5 hover:bg-text-main/5 transition">
      <td className="px-4 py-3">
        <input type="checkbox" checked={selected} onChange={onToggleSelect} className="w-4 h-4 accent-brand-500" />
      </td>
      <td className="px-2 py-3">
        {user.profilePhoto ? (
          <img src={user.profilePhoto} alt="" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
        )}
      </td>
      <td className="px-2 py-3 font-mono text-xs text-text-main/60">{user.id}</td>
      <td className="px-4 py-3 font-medium text-text-main">{fullName}</td>
      <td className="px-4 py-3 text-text-main/80">{user.email}</td>
      <td className="px-4 py-3 text-text-main/80">{user.phone}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${roleColor.bg} ${roleColor.text} ${roleColor.ring}`}>
          {ROLE_LABELS[user.role]}
        </span>
      </td>
      <td className="px-4 py-3 text-text-main/80">{getDisplayClass(user) ?? '—'}</td>
      <td className="px-4 py-3">
        {user.status === 'active' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/20 text-success px-2.5 py-1 text-xs font-semibold">
            <Check size={12} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-text-main/10 text-text-main/60 px-2.5 py-1 text-xs font-semibold">
            <X size={12} /> Inactive
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <ActionsMenu onView={onView} onEdit={onEdit} onResetPassword={onResetPassword} onDelete={onDelete} />
      </td>
    </tr>
  )
}

interface ActionsMenuProps {
  onView: () => void
  onEdit: () => void
  onResetPassword: () => void
  onDelete: () => void
}

function ActionsMenu({ onView, onEdit, onResetPassword, onDelete }: ActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="p-1.5 rounded-full text-text-main/50 hover:bg-text-main/10 hover:text-text-main">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-20 mt-1 w-44 rounded-2xl shadow-xl py-1 border border-text-main/10">
          <button onClick={() => { setOpen(false); onView() }} className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-text-main hover:bg-text-main/10"><Eye size={15} /> View profile</button>
          <button onClick={() => { setOpen(false); onEdit() }} className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-text-main hover:bg-text-main/10"><Pencil size={15} /> Edit user</button>
          <button onClick={() => { setOpen(false); onResetPassword() }} className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-text-main hover:bg-text-main/10"><KeyRound size={15} /> Reset password</button>
          <button onClick={() => { setOpen(false); onDelete() }} className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-error hover:bg-error/10"><Trash2 size={15} /> Delete user</button>
        </div>
      )}
    </div>
  )
}

function isString(value: string | null): value is string { return value !== null }
function uniqueSorted(values: string[]): string[] { return Array.from(new Set(values)).sort() }