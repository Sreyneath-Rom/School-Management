// src/features/students/StudentFilters.tsx
import React from 'react'
import {
  Search,
  X,
  LayoutGrid,
  List,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

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
    <div className="space-y-3">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search student name, ID, email, or guardian..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 py-2 pl-9 pr-9 text-xs font-medium text-stone-900 dark:text-white placeholder-stone-400 focus:border-brand-500 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:text-white transition"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Center: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade Selector */}
          <div className="relative">
            <select
              id="student-grade-filter"
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              aria-label="Filter by grade"
              className="h-9 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div className="relative">
            <select
              id="student-class-filter"
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              aria-label="Filter by class section"
              className="h-9 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Sections</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              id="student-status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by status"
              className="h-9 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Gender Selector */}
          <div className="relative">
            <select
              id="student-gender-filter"
              value={selectedGender}
              onChange={(e) => onGenderChange(e.target.value)}
              aria-label="Filter by gender"
              className="h-9 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Gender: All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
              title="Reset all filters"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Export & View Toggles */}
        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={onExport}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 px-3 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
            title="Export student records to CSV"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* View Toggle */}
          <div className="flex h-9 items-center rounded-xl border border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-white/5 p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when students are selected) */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {selectedCount}
            </span>
            <span className="font-semibold text-brand-900 dark:text-brand-200">
              {selectedCount} student{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkStatus('active')}
              className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-stone-800 px-3 py-1.5 font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mark Active</span>
            </button>
            <button
              onClick={() => onBulkStatus('inactive')}
              className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-stone-800 px-3 py-1.5 font-semibold text-stone-700 dark:text-stone-300 shadow-xs hover:bg-stone-100 dark:hover:bg-white/10 transition"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Mark Inactive</span>
            </button>
            <button
              onClick={onClearSelection}
              className="rounded-lg px-2.5 py-1.5 font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
