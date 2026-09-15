import React from 'react'
import { X } from 'lucide-react'

interface FormModalProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  submitLabel?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function FormModal({
  title,
  subtitle,
  icon,
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save Changes',
  children,
  size = 'md',
}: FormModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[min(90vh,760px)] flex flex-col overflow-hidden rounded-[28px] border border-surface bg-surface-strong shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light in Top-Right Corner */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-brand-400/20 to-teal-400/20 blur-3xl opacity-60" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-surface bg-surface px-6 py-4.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-strong text-brand-600 dark:text-brand-400 border border-surface">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-color">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-secondary mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-secondary transition hover:bg-surface-strong hover:text-color cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmit} className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-color">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-surface bg-surface px-6 py-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-surface bg-surface px-4 py-2 text-xs font-bold text-secondary hover:text-color hover:bg-surface-strong transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-linear-to-r from-brand-600 to-brand-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
