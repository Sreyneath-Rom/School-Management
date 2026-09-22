// src/components/common/EmptyState.tsx
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  /** Compact variant for inline usage inside tables or side panels. */
  variant?: 'default' | 'compact'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const isCompact = variant === 'compact'

  return (
    // The old `border border-surface` was invisible under this theme —
    // `.glass-sm` alone gives the raised surface.
    <div
      className={`glass-sm rounded-2xl text-center ${
        isCompact ? 'p-8' : 'p-12'
      }`}
    >
      <Icon
        className={`text-fg-muted/40 mx-auto ${
          isCompact ? 'w-8 h-8 mb-2' : 'w-12 h-12 mb-3'
        }`}
        strokeWidth={1.6}
      />
      <h3
        className={`font-semibold text-fg ${
          isCompact ? 'text-sm' : 'text-base'
        }`}
      >
        {title}
      </h3>
      {description && (
        <p
          className={`text-fg-muted mt-1 max-w-md mx-auto ${
            isCompact ? 'text-xs' : 'text-sm'
          }`}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}