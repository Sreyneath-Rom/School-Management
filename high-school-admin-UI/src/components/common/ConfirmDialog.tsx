// src/components/common/ConfirmDialog.tsx
import { AlertTriangle, Trash2 } from 'lucide-react'
import Modal from './Modal'

export type ConfirmVariant = 'danger' | 'warning' | 'primary'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isConfirming?: boolean
  variant?: ConfirmVariant
}

const ACCENT: Record<ConfirmVariant, 'error' | 'warning' | 'brand'> = {
  danger: 'error',
  warning: 'warning',
  primary: 'brand',
}

const ICON_WRAP: Record<ConfirmVariant, string> = {
  danger: 'bg-linear-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25',
  warning: 'bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25',
  primary: 'bg-linear-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25',
}

const CONFIRM_BTN: Record<ConfirmVariant, string> = {
  danger: 'bg-error hover:bg-error/90 text-white',
  warning: 'bg-warning hover:bg-warning/90 text-white',
  primary: 'bg-brand-600 hover:bg-brand-700 text-white',
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const Icon = variant === 'danger' ? Trash2 : AlertTriangle

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      accent={ACCENT[variant]}
      size="sm"
      preventBackdropClose={isConfirming}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded-2xl border border-surface bg-surface px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg hover:bg-surface-strong transition cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50 ${CONFIRM_BTN[variant]}`}
          >
            {isConfirming ? 'Processing…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${ICON_WRAP[variant]}`}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-bold text-fg">{title}</h4>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  )
}