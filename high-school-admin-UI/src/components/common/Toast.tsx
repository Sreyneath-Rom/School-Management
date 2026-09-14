import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info'
  title?: string
  message: string
}

interface ToastProps {
  type: 'success' | 'error' | 'info'
  title?: string
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isSuccess = type === 'success'
  const isError = type === 'error'

  return (
    <div className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-[22px] border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95">
      {/* Ambient Accent Light */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl opacity-60 ${
          isSuccess
            ? 'bg-emerald-400/30'
            : isError
            ? 'bg-rose-400/30'
            : 'bg-blue-400/30'
        }`}
      />

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
          isSuccess
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25'
            : isError
            ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/25'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25'
        }`}
      >
        {isSuccess && <CheckCircle2 size={20} strokeWidth={2.2} />}
        {isError && <AlertCircle size={20} strokeWidth={2.2} />}
        {!isSuccess && !isError && <Info size={20} strokeWidth={2.2} />}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        {title && (
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {title}
          </p>
        )}
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  )
}
