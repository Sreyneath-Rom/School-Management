// src/components/common/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '@/types/api'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  /** Sits to the left of the controls. Defaults to a range summary. */
  summary?: string
}

export default function Pagination({
  meta,
  onPageChange,
  summary,
}: PaginationProps) {
  if (meta.totalPages <= 1) return null

  const start = (meta.page - 1) * meta.limit + 1
  const end = Math.min(meta.page * meta.limit, meta.total)
  const defaultSummary = `Showing ${start}–${end} of ${meta.total}`

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-fg-muted"
    >
      <span>{summary ?? defaultSummary}</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.hasPrev}
          aria-label="Previous page"
          className="glass-sm glass-interactive p-1.5 rounded-lg text-fg-muted hover:text-fg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="px-3 font-semibold text-fg">
          Page {meta.page} of {meta.totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.hasNext}
          aria-label="Next page"
          className="glass-sm glass-interactive p-1.5 rounded-lg text-fg-muted hover:text-fg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  )
}