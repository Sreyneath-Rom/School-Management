import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDialogProps {
  open?: boolean
  isOpen?: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
  variant?: 'danger' | 'warning' | 'primary'
}

export default function ConfirmDialog({
  open,
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDeleting,
  variant = 'danger',
}: ConfirmDialogProps) {
  const isVisible = open ?? isOpen ?? false

  if (!isVisible) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-surface bg-surface-strong p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full blur-3xl opacity-60 ${
            isDanger ? 'bg-rose-400/30' : 'bg-amber-400/30'
          }`}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isDanger
                  ? 'bg-linear-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25'
              }`}
            >
              {isDanger ? <Trash2 size={22} strokeWidth={2.2} /> : <AlertTriangle size={22} strokeWidth={2.2} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-color">
                {title}
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Please confirm this operation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1.5 text-secondary hover:bg-surface hover:text-color transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="relative z-10 mt-4 text-xs sm:text-sm text-color leading-relaxed pl-0.5">
          {message}
        </p>

        <div className="relative z-10 mt-6 flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-surface bg-surface px-4 py-2 text-xs font-bold text-secondary hover:text-color hover:bg-surface-strong transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer disabled:opacity-50 ${
              isDanger
                ? 'bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/30'
                : 'bg-linear-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 shadow-brand-500/30'
            }`}
          >
            {isDeleting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
