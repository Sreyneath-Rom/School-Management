// src/features/setup/school/Field.tsx

import { AlertCircle } from 'lucide-react';

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function Field({
  label,
  required,
  error,
  children,
}: Props) {
  return (
    <div className="group">
      {/* Label */}
      <label
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-text-main
          transition-colors
          group-focus-within:text-brand-700
          dark:group-focus-within:text-brand-300
        "
      >
        {label}

        {required && (
          <span
            className="
              ml-1
              text-error
            "
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {/* Field */}
      <div className="relative">
        {children}

        {/* Error indicator */}
        {error && (
          <div
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              z-10
              flex
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-error/10
              p-1
              text-error
              shadow-sm
            "
            aria-hidden="true"
          >
            <AlertCircle size={14} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="
            mt-1.5
            flex
            items-start
            gap-1.5
            text-xs
            font-medium
            text-error
          "
        >
          <AlertCircle
            size={13}
            className="mt-0.5 shrink-0"
            strokeWidth={2.5}
          />

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}