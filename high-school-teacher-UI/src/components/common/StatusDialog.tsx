// components/common/StatusDialog.tsx
import Modal from './Modal';
import Button from './Button';

interface StatusDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusDialog({
  open,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
}: StatusDialogProps) {
  const isSuccess = type === 'success';
  const icon = isSuccess ? '✅' : '❌'; // or use Lucide icons

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl">{icon}</div>
        <p className="mt-3 text-sm text-text-main/65">{message}</p>
        <div className="mt-6 flex gap-3">
          {actionLabel && onAction && (
            <Button
              variant={isSuccess ? 'solid' : 'solid'}
              className={isSuccess ? '' : 'bg-error hover:bg-error/85'}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
          <Button variant="glass" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}