// components/common/Toast.tsx
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number; // milliseconds, default 5000
}

export default function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-emerald-500" />,
    error: <AlertCircle size={20} className="text-rose-500" />,
    info: <AlertCircle size={20} className="text-blue-500" />,
  };

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-2xl glass-sm px-4 py-3 shadow-lg">
      {icons[type]}
      <span className="text-sm text-stone-700 dark:text-stone-200">{message}</span>
      <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
        <X size={16} />
      </button>
    </div>
  );
}