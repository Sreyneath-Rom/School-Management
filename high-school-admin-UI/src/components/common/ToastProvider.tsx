// components/common/ToastProvider.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import ToastContainer from './ToastContainer';
import type { ToastItem } from './ToastContainer';

interface ToastContextValue {
  addToast: (type: ToastItem['type'], message: string) => void;
  showToast: (typeOrMessage: string, messageOrType?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = String(toastIdCounter++);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const showToast = useCallback((first: string, second?: string) => {
    let type: ToastItem['type'] = 'info';
    let message = '';
    if (['success', 'error', 'warning', 'info'].includes(first)) {
      type = first as ToastItem['type'];
      message = second || '';
    } else if (second && ['success', 'error', 'warning', 'info'].includes(second)) {
      type = second as ToastItem['type'];
      message = first;
    } else {
      message = first;
      if (second && ['success', 'error', 'warning', 'info'].includes(second)) {
        type = second as ToastItem['type'];
      }
    }
    addToast(type, message);
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}