// src/components/common/Toast.tsx
import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  type: ToastType
  title?: string
  message: string
  onClose: () => void
  /** Auto-dismiss after this many ms. Pass 0 to disable. */
  duration?: number
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const

const ICON_WRAP = {
  success: 'bg-linear-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25',
  error: 'bg-linear-to-br from-rose-500 to-red-600 shadow-rose-500/25',
  warning: 'bg-linear-to-br from-amber-400 to-orange-500 shadow-amber-500/25',
  info: 'bg-linear-to-br from-brand-500 to-brand-700 shadow-brand-500/25',
} as const

const GLOW = {
  success: 'bg-emerald-400/30',
  error: 'bg-rose-400/30',
  warning: 'bg-amber-400/30',
  info: 'bg-brand-400/30',
} as const

export default function Toast({
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const Icon = ICONS[type]

  return (
    // `.glass-strong` supplies the elevated neumorphic surface and its
    // shadow. The old `border border-surface-strong` was invisible and
    // `shadow-xl` was overriding the neumorphic shadow.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-[22px] glass-strong p-4 animate-in slide-in-from-top-2 duration-200"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl opacity-60 ${GLOW[type]}`}
      />

      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${ICON_WRAP[type]}`}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      <div className="relative min-w-0 flex-1 pt-0.5">
        {title && <p className="text-xs font-bold text-fg">{title}</p>}
        <p className="text-xs font-medium text-fg leading-relaxed">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-fg-muted hover:text-fg transition cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  )
}