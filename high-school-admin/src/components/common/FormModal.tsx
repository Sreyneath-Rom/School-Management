import { X } from 'lucide-react';
import Button from '@/components/common/Button';

interface FormModalProps {
  title: string;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export default function FormModal({
  title,
  onCancel,
  onSubmit,
  isSubmitting,
  children,
}: FormModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center glass-sm dark:glass-sm">
      <div className="w-full max-w-lg rounded-3xl glass-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {children}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="glass" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button variant="solid" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}