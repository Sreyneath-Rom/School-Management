// src/components/common/ToastContainer.tsx
import Toast, { type ToastType } from './Toast'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
}

interface ToastContainerProps {
  toasts: ToastItem[]
  removeToast: (id: string) => void
}

export default function ToastContainer({
  toasts,
  removeToast,
}: ToastContainerProps) {
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-100 flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}