import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

interface StatusDialogProps {
  open: boolean
  onClose: () => void
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function StatusDialog({
  open,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
}: StatusDialogProps) {
  if (!open) return null

  const isSuccess = type === 'success'
  const isError = type === 'error'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-surface bg-surface-strong p-6 text-center shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          className={`pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl opacity-60 ${
            isSuccess
              ? 'bg-emerald-400/30'
              : isError
              ? 'bg-rose-400/30'
              : 'bg-brand-400/30'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-xl ${
              isSuccess
                ? 'bg-linear-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30'
                : isError
                ? 'bg-linear-to-br from-rose-500 to-red-600 shadow-rose-500/30'
                : 'bg-linear-to-br from-brand-500 to-brand-700 shadow-brand-500/30'
            }`}
          >
            {isSuccess && <CheckCircle2 size={32} strokeWidth={2.2} />}
            {isError && <AlertCircle size={32} strokeWidth={2.2} />}
            {!isSuccess && !isError && <Info size={32} strokeWidth={2.2} />}
          </div>

          <h3 className="mt-4 text-lg font-black text-color">
            {title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-secondary leading-relaxed max-w-xs">
            {message}
          </p>

          <div className="mt-6 flex w-full items-center justify-center gap-2">
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className={`flex-1 rounded-2xl py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : isError
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30'
                }`}
              >
                {actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-surface bg-surface py-2.5 text-xs font-bold text-secondary hover:text-color hover:bg-surface-strong transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
