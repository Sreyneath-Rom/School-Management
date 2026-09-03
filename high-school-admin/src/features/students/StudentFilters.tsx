// src/features/students/StudentFilters.tsx
import React from 'react'
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  Download,
  CheckSquare,
  ShieldCheck,
  UserX,
  UserCheck,
} from 'lucide-react'
import Button from '@/components/common/Button'

interface StudentFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  selectedGrade: string
  onGradeChange: (val: string) => void
  selectedClass: string
  onClassChange: (val: string) => void
  selectedStatus: string
  onStatusChange: (val: string) => void
  selectedGender: string
  onGenderChange: (val: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  onExport: () => void
  selectedCount: number
  onBulkStatus: (status: 'active' | 'inactive') => void
  onClearSelection: () => void
  grades: string[]
  classes: string[]
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  search,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
  selectedGender,
  onGenderChange,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
  onExport,
  selectedCount,
  onBulkStatus,
  onClearSelection,
  grades,
  classes,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border-card/60 bg-surface-card p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-main/40" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search by student name, ID, email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border-card bg-surface-base py-2 pl-9 pr-8 text-sm text-text-main placeholder-text-main/40 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-main/40 hover:bg-surface-card hover:text-text-main"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Center: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade Selector */}
          <div className="relative">
            <select
              id="student-grade-filter"
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              aria-label="Filter by grade"
              className="appearance-none rounded-xl border border-border-card bg-surface-base py-2 pl-3 pr-8 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-main/40" />
          </div>

          {/* Class Section Selector */}
          <div className="relative">
            <select
              id="student-class-filter"
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              aria-label="Filter by class"
              className="appearance-none rounded-xl border border-border-card bg-surface-base py-2 pl-3 pr-8 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-main/40" />
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              id="student-status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by status"
              className="appearance-none rounded-xl border border-border-card bg-surface-base py-2 pl-3 pr-8 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-main/40" />
          </div>

          {/* Gender Selector */}
          <div className="relative">
            <select
              id="student-gender-filter"
              value={selectedGender}
              onChange={(e) => onGenderChange(e.target.value)}
              aria-label="Filter by gender"
              className="appearance-none rounded-xl border border-border-card bg-surface-base py-2 pl-3 pr-8 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-main/40" />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              id="student-clear-filters-btn"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-dashed border-border-card px-2.5 py-1.5 text-xs font-medium text-text-main/60 hover:border-red-400 hover:text-red-500"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Right: View Switcher & Export */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* Table / Grid Toggle */}
          <div className="flex items-center rounded-xl border border-border-card bg-surface-base p-0.5">
            <button
              id="student-view-table-btn"
              onClick={() => onViewModeChange('table')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-surface-card text-brand-600 shadow-sm dark:text-brand-400'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              id="student-view-grid-btn"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-surface-card text-brand-600 shadow-sm dark:text-brand-400'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Export CSV */}
          <button
            id="student-export-csv-btn"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main transition hover:bg-surface-card hover:text-brand-600"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk Selection Action Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-brand-500/30 bg-brand-500/5 px-4 py-2.5 text-sm text-text-main animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {selectedCount}
            </span>
            <span>student{selectedCount > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="bulk-active-btn"
              onClick={() => onBulkStatus('active')}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Set Active
            </button>
            <button
              id="bulk-inactive-btn"
              onClick={() => onBulkStatus('inactive')}
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-500/10 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-500/20 dark:text-zinc-400"
            >
              <UserX className="h-3.5 w-3.5" />
              Set Inactive
            </button>
            <button
              id="bulk-clear-btn"
              onClick={onClearSelection}
              className="text-xs text-text-main/50 underline hover:text-text-main"
            >
              Deselect all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
