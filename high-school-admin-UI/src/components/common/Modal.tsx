// components/common/Modal.tsx
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  open?: boolean
  isOpen?: boolean
  onClose: () => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'max'
  accentColor?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'slate'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  max: 'max-w-4xl',
}

const accentGradients = {
  blue: 'from-blue-400/20 via-cyan-400/15 to-transparent dark:from-blue-500/15 dark:via-cyan-500/10',
  emerald: 'from-emerald-400/20 via-teal-400/15 to-transparent dark:from-emerald-500/15 dark:via-teal-500/10',
  purple: 'from-purple-400/20 via-pink-400/15 to-transparent dark:from-purple-500/15 dark:via-pink-500/10',
  amber: 'from-amber-400/20 via-orange-400/15 to-transparent dark:from-amber-500/15 dark:via-orange-500/10',
  rose: 'from-rose-400/20 via-pink-400/15 to-transparent dark:from-rose-500/15 dark:via-pink-500/10',
  slate: 'from-slate-400/10 via-slate-300/5 to-transparent dark:from-slate-700/15 dark:via-slate-800/10',
}

export default function Modal({
  open,
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
  footer,
  size = 'md',
  accentColor = 'blue',
}: ModalProps) {
  const isVisible = open ?? isOpen ?? false

  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, onClose])

  if (!isVisible) return null

  const resolvedFooter = actions ?? footer

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  bg-slate-950/60 p-4 backdrop-blur-md transition-all duration-200 animate-in fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[min(92vh,840px)] flex flex-col overflow-hidden rounded-[28px] border border-surface bg-surface-strong shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in zoom-in-95`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Soft Liquid Ambient Glow in Top-Right Corner */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-70 bg-linear-to-br ${accentGradients[accentColor]}`}
        />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-b border-surface bg-surface px-6 py-4.5 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-strong text-color shadow-xs border border-surface">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base sm:text-lg font-bold text-color truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-secondary mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-secondary transition hover:bg-surface-strong hover:text-color cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 px-6 py-5 text-color">
          {children}
        </div>

        {/* Modal Footer / Actions */}
        {resolvedFooter && (
          <div className="relative z-10 flex flex-wrap items-center justify-end gap-3 border-t border-surface bg-surface px-6 py-4 backdrop-blur-md">
            {resolvedFooter}
          </div>
        )}
      </div>
    </div>
  )
}
