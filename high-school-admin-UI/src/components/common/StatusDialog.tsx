// src/components/common/StatusDialog.tsx
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import Modal from './Modal'

export type StatusDialogType = 'success' | 'error' | 'info'

interface StatusDialogProps {
  isOpen: boolean
  onClose: () => void
  type: StatusDialogType
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const

const ACCENT = {
  success: 'success',
  error: 'error',
  info: 'info',
} as const

const ICON_WRAP = {
  success: 'bg-linear-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30',
  error: 'bg-linear-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30',
  info: 'bg-linear-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30',
} as const

const ACTION_BTN = {
  success: 'bg-success hover:bg-success/90',
  error: 'bg-error hover:bg-error/90',
  info: 'bg-brand-600 hover:bg-brand-700',
} as const

export default function StatusDialog({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
}: StatusDialogProps) {
  const Icon = ICONS[type]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      accent={ACCENT[type]}
      footer={
        <>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className={`flex-1 rounded-2xl py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer ${ACTION_BTN[type]}`}
            >
              {actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="glass-sm glass-interactive flex-1 rounded-2xl py-2.5 text-xs font-bold text-fg-muted hover:text-fg"
          >
            Close
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl text-white ${ICON_WRAP[type]}`}
        >
          <Icon size={32} strokeWidth={2.2} />
        </div>
        <h3 className="mt-4 text-lg font-black text-fg">{title}</h3>
        <p className="mt-2 text-sm text-fg-muted leading-relaxed max-w-xs">
          {message}
        </p>
      </div>
    </Modal>
  )
}