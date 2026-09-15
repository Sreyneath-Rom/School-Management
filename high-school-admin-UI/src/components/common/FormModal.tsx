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
        className={`relative w-full ${sizeClasses[size]} max-h-[min(90vh,760px)] flex flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light in Top-Right Corner */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-blue-400/20 to-teal-400/20 blur-3xl opacity-60" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-500/20">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmit} className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
