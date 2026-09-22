// src/components/common/Badge.tsx
import type { ReactNode } from 'react'

export type BadgeTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'brand'

const TONES: Record<BadgeTone, string> = {
  // Neutral reads as a carved-in chip: same surface color, sunken shadow.
  // `bg-surface` alone was a no-op under the neumorphic theme.
  neutral: 'text-fg-muted shadow-[var(--shadow-emboss-sunken)]',
  // Semantic tints keep their tinted backgrounds — color IS the signal,
  // and light tints are visible on the flat neumorphic surface.
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
}

export default function Badge({
  children,
  tone = 'neutral',
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}