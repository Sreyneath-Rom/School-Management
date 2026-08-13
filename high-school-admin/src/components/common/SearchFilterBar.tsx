import { Search, SlidersHorizontal, Download } from 'lucide-react';
import Button from '@/components/common/Button';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  additionalFilters?: React.ReactNode;
  onExport?: () => void;
  placeholder?: string;
}

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
    <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-stone-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {onStatusFilterChange && (
          <select
            value={statusFilter || ''}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-brand-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
            <option value="Inactive">Inactive</option>
          </select>
        )}
        {additionalFilters}
        <Button variant="none" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
          <SlidersHorizontal size={17} />
        </Button>
        {onExport && (
          <Button variant="glass" className="inline-flex items-center gap-2 text-sm font-semibold" onClick={onExport}>
            <Download size={16} />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}