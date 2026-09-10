// components/common/Modal.tsx
import { useEffect } from 'react';
import { X } from 'lucide-react';


interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // custom action buttons
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`w-full ${sizeClasses[size]} max-h-[min(90vh,720px)] overflow-y-auto rounded-3xl border border-white/20 bg-white/95 shadow-2xl shadow-slate-950/20 dark:bg-slate-950/95`}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-6 py-4 dark:border-white/10 dark:bg-slate-950/95">
          {title && (
            <h3 className="min-w-0 text-lg font-bold text-text-main">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-main/45 transition hover:bg-text-main/5 hover:text-text-main/80 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Actions (footer) */}
        {actions && (
          <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-slate-200/80 bg-white/95 px-6 py-4 dark:border-white/10 dark:bg-slate-950/95">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}