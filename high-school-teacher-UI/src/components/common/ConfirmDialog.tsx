import { X } from 'lucide-react';
import Button from '@/components/common/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, isDeleting }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl glass-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
          <button onClick={onCancel} className="text-text-main/45 hover:text-text-main/70">
            <X size={20} />
          </button>
        </div>
        <p className="mt-3 text-sm text-text-main/65">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="glass" onClick={onCancel}>Cancel</Button>
          <Button variant="solid" onClick={onConfirm} disabled={isDeleting} className="bg-error hover:bg-error/85">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}