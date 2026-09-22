// src/features/students/StudentFilters.tsx
import React from 'react'
import {
  Search, X, LayoutGrid, List, Download, CheckCircle2, XCircle,
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
  search, onSearchChange,
  selectedGrade, onGradeChange,
  selectedClass, onClassChange,
  selectedStatus, onStatusChange,
  selectedGender, onGenderChange,
  onClearFilters, hasActiveFilters,
  viewMode, onViewModeChange, onExport,
  selectedCount, onBulkStatus, onClearSelection,
  grades, classes,
}) => {
  // Selects inherit the sunken-well look from globals.css; only size,
  // padding, and the focus ring are set inline. Same pattern used by
  // every other select in the app.
  const selectClass =
    'h-9 rounded-xl px-3 text-xs font-semibold text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer'

  return (
    <div className="space-y-3">
      {/* Filter bar — raised `.glass-sm` surface. Matches the surface
          level of the toolbar strips in UsersFeature / SubjectsFeature
          (which use `.glass-sm`), while full-size cards use `.glass`. */}
      <div className="flex flex-col gap-3 rounded-2xl glass-sm p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted z-10" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search student name, ID, email, or guardian..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl py-2 pl-9 pr-9 text-xs font-medium text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-muted hover:text-fg transition cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="student-grade-filter"
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            aria-label="Filter by grade"
            className={selectClass}
          >
            <option value="all">All Grades</option>
            {grades.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <select
            id="student-class-filter"
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            aria-label="Filter by class section"
            className={selectClass}
          >
            <option value="all">All Sections</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            id="student-status-filter"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
            className={selectClass}
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            id="student-gender-filter"
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value)}
            aria-label="Filter by gender"
            className={selectClass}
          >
            <option value="all">Gender: All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-xs font-semibold text-error hover:shadow-sunken transition cursor-pointer"
              title="Reset all filters"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Export button — raised chip. Was a plain sunken well, which
              read as "carved in" and out of place next to the sunken
              view-toggle tray it sits beside. Raised here so the two
              controls read as distinct. */}
          <button
            onClick={onExport}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-fg glass-sm glass-interactive"
            title="Export student records to CSV"
          >
            <Download className="h-3.5 w-3.5 text-fg-muted" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* View toggle: sunken tray, active segment brand-filled.
              The trailing `gap-1.5` from the previous version is gone —
              these buttons now only contain an icon, so the gap had
              nothing to space. */}
          <div className="flex h-9 items-center rounded-xl p-0.5 shadow-sunken">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar — brand-tinted signal, kept. Matches the
          pattern used by UsersFeature and Announcements bulk bars. */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/15 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {selectedCount}
            </span>
            <span className="font-semibold text-brand-900 dark:text-brand-200">
              {selectedCount} student{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk status actions: raised chips that press in on hover.
                Uses `shadow-emboss` / `hover:shadow-sunken` — the same
                pair used throughout the app for interactive chips. */}
            <button
              onClick={() => onBulkStatus('active')}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold text-success shadow-emboss hover:shadow-sunken transition cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mark Active</span>
            </button>
            <button
              onClick={() => onBulkStatus('inactive')}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold text-fg-muted shadow-emboss hover:shadow-sunken transition cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Mark Inactive</span>
            </button>
            <button
              onClick={onClearSelection}
              className="rounded-lg px-2.5 py-1.5 font-medium text-fg-muted hover:text-fg transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}