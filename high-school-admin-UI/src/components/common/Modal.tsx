// src/components/common/Modal.tsx
import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
}

export type ModalAccent = 'brand' | 'success' | 'warning' | 'error' | 'info'

const ACCENT_GLOW: Record<ModalAccent, string> = {
  brand: 'from-brand-400/25 via-teal-400/15',
  success: 'from-emerald-400/25 via-teal-400/15',
  warning: 'from-amber-400/25 via-orange-400/15',
  error: 'from-rose-400/25 via-pink-400/15',
  info: 'from-sky-400/25 via-blue-400/15',
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  /** Action row pinned to the bottom. */
  footer?: ReactNode
  /** Soft glow color in the top-right corner. */
  accent?: ModalAccent
  size?: ModalSize
  /**
   * When true, clicking the backdrop does NOT close the modal. Use for
   * destructive confirms or forms with unsaved state.
   */
  preventBackdropClose?: boolean
  children: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  footer,
  accent = 'brand',
  size = 'md',
  preventBackdropClose = false,
  children,
}: ModalProps) {
  // Close on Escape unless disabled.
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll while open. Restoring on cleanup means a modal that
  // unmounts mid-transition doesn't leave the page frozen.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Focus the panel on open so keyboard users land inside.
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  const hasHeader = title || subtitle || icon

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !preventBackdropClose) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative w-full ${SIZE_CLASSES[size]} max-h-[min(92vh,840px)] flex flex-col overflow-hidden rounded-[28px] glass-strong border border-surface-strong shadow-2xl animate-in zoom-in-95 duration-150 focus:outline-none`}
      >
        {/* Ambient accent glow — decorative, non-interactive. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-70 bg-linear-to-br ${ACCENT_GLOW[accent]} to-transparent`}
        />

        {hasHeader && (
          <div className="relative z-10 flex items-start justify-between gap-4 border-b border-surface bg-surface px-6 py-4">
            <div className="flex items-start gap-3 min-w-0">
              {icon && (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-strong text-fg border border-surface">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-base sm:text-lg font-bold text-fg truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-fg-muted mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-fg-muted hover:bg-surface-strong hover:text-fg transition cursor-pointer"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        )}

        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 text-fg">
          {children}
        </div>

        {footer && (
          <div className="relative z-10 flex flex-wrap items-center justify-end gap-2.5 border-t border-surface bg-surface px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}