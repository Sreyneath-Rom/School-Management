// components/common/Modal.tsx
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
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`w-full ${sizeClasses[size]} rounded-3xl glass-sm p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-bold text-text-main">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-text-main/45 hover:text-text-main/70"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">{children}</div>

        {/* Actions (footer) */}
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
}