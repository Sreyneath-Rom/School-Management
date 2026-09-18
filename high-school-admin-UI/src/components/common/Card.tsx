// src/components/common/Card.tsx
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  /** Rendered at the top-right, e.g. a menu or CTA. */
  action?: ReactNode
  /** Rendered at the bottom, below a divider. */
  footer?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const PADDING: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

export default function Card({
  children,
  title,
  subtitle,
  action,
  footer,
  padding = 'md',
  className = '',
}: CardProps) {
  const hasHeader = title || subtitle || action

  return (
    <section
      className={`rounded-[28px] glass-sm border border-surface flex flex-col ${className}`}
    >
      {hasHeader && (
        <div
          className={`flex items-start justify-between gap-4 border-b border-surface ${PADDING[padding]}`}
        >
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-bold text-fg truncate">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={`flex-1 ${PADDING[padding]}`}>{children}</div>

      {footer && (
        <div
          className={`border-t border-surface ${PADDING[padding]} pt-4`}
        >
          {footer}
        </div>
      )}
    </section>
  )
}