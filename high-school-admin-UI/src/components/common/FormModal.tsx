// src/components/common/FormModal.tsx
import type { FormEvent, ReactNode } from 'react'
import { X } from 'lucide-react'

interface FormModalProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  onCancel: () => void
  onSubmit: (e: FormEvent) => void
  isSubmitting?: boolean
  submitLabel?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<NonNullable<FormModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * A form-in-a-modal shell. Kept separate from `Modal` because its footer
 * buttons are wired to a `<form>` element via the `form` attribute, which
 * `Modal`'s generic footer slot doesn't handle. If you'd rather consolidate,
 * pass a `<form>` as `<Modal>`'s children and use `form="id"` on the
 * submit button — that's what `Announcements` does.
 */
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
        className={`relative w-full ${SIZE_CLASSES[size]} max-h-[min(90vh,760px)] flex flex-col overflow-hidden rounded-[28px] glass-strong border border-surface-strong shadow-2xl animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-60 bg-linear-to-br from-brand-400/20 to-info/20"
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-surface bg-surface px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-strong text-brand-600 dark:text-brand-400 border border-surface">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-fg truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-fg-muted mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-fg-muted transition hover:bg-surface-strong hover:text-fg cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="relative z-10 flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-fg">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-surface bg-surface px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-surface bg-surface px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg hover:bg-surface-strong transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-brand-600 hover:bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}