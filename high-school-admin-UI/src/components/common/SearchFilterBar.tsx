// src/components/common/SearchFilterBar.tsx
import { Search, SlidersHorizontal, Download } from 'lucide-react'
import type { ReactNode } from 'react'
import Button from '@/components/common/Button'

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter?: string
  onStatusFilterChange?: (value: string) => void
  additionalFilters?: ReactNode
  onExport?: () => void
  placeholder?: string
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  additionalFilters,
  onExport,
  placeholder = 'Search...',
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] glass-sm border border-surface p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full bg-surface border border-surface py-2.5 pl-11 pr-4 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onStatusFilterChange && (
          <select
            value={statusFilter ?? ''}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-full bg-surface border border-surface px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {additionalFilters}

        <button
          type="button"
          aria-label="Advanced filters"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full glass-sm text-fg-muted hover:text-fg transition cursor-pointer"
        >
          <SlidersHorizontal size={17} />
        </button>

        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="inline-flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
        )}
      </div>
    </div>
  )
}