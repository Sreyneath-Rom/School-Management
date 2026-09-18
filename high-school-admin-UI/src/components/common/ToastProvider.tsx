// src/components/common/ToastProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import ToastContainer, { type ToastItem } from './ToastContainer'
import type { ToastType } from './Toast'

interface ShowToastOptions {
  title?: string
  /** Auto-dismiss in ms. Pass 0 to require manual dismissal. */
  duration?: number
}

interface ToastContextValue {
  /**
   * Supports both calling conventions:
   *   showToast('Saved successfully', 'success')
   *   showToast('success', 'Saved successfully')
   *   showToast('Saved successfully')           // defaults to 'info'
   */
  showToast: (
    arg1: string,
    arg2?: ToastType | string,
    options?: ShowToastOptions
  ) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const VALID_TYPES: readonly ToastType[] = [
  'success',
  'error',
  'warning',
  'info',
] as const

function isToastType(value: unknown): value is ToastType {
  return typeof value === 'string' && VALID_TYPES.includes(value as ToastType)
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  // Track timers so a dismissed toast doesn't fire its auto-remove later.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (
      arg1: string,
      arg2?: ToastType | string,
      options?: ShowToastOptions
    ) => {
      // Resolve which argument is the type and which is the message.
      let type: ToastType = 'info'
      let message = ''

      if (isToastType(arg1)) {
        type = arg1
        message = typeof arg2 === 'string' ? arg2 : ''
      } else if (typeof arg2 === 'string' && isToastType(arg2)) {
        type = arg2
        message = arg1
      } else {
        message = arg1
      }

      const id = `t-${++nextId}-${Date.now()}`
      setToasts((prev) => [
        ...prev,
        { id, type, title: options?.title, message },
      ])

      const duration = options?.duration ?? 5000
      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration)
        timers.current.set(id, timer)
      }
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}