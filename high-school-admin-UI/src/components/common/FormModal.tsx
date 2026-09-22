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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      {/* `.glass-strong` supplies bg + radius + elevated shadow.
          The old `border border-surface-strong` was invisible, and
          `shadow-2xl` was overriding the neumorphic shadow. */}
      <div
        className={`relative w-full ${SIZE_CLASSES[size]} max-h-[min(90vh,760px)] flex flex-col overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40 bg-linear-to-br from-brand-400/20 to-info/20"
        />

        {/* Header — shadow seam replaces the invisible border. */}
        <div className="relative z-10 flex items-center justify-between shadow-[0_1px_0_var(--neu-shadow-dark)] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition hover:text-fg hover:shadow-sunken cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative z-10 flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-fg">
            {children}
          </div>

          <div className="flex items-center justify-end gap-2.5 shadow-[0_-1px_0_var(--neu-shadow-dark)] px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg"
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