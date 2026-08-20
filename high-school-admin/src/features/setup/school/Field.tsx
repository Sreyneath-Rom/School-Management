// src/features/setup/school/Field.tsx
import { AlertCircle } from 'lucide-react';

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function Field({ label, required, error, children }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}