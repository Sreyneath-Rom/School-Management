// src/components/common/FormField.tsx
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

// Inputs/selects/textareas get their neumorphic sunken-well styling
// (background, radius, inset shadow, no border) from `globals.css`
// automatically. This file only layers padding + focus ring + type scale.
const FIELD_BASE =
  'w-full text-sm text-fg placeholder:text-fg-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-500 transition'

const FIELD_STATE = {
  normal: '',
  // Error state re-introduces a visible 1px border. Everything else
  // (background, shadow) still comes from the global sunken-well rule.
  error: 'border border-error/60 focus:ring-error/40',
}

function fieldClasses(
  hasError: boolean,
  hasIcon: boolean,
  extra: string = ''
): string {
  return [
    FIELD_BASE,
    hasError ? FIELD_STATE.error : FIELD_STATE.normal,
    hasIcon ? 'pl-10' : 'pl-3.5',
    'pr-3 py-2.5',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

interface FieldShellProps {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

function FieldShell({
  id,
  label,
  error,
  hint,
  required,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-fg">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-error">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-fg-muted">{hint}</p>
      ) : null}
    </div>
  )
}

function slug(label: string): string {
  return `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
}

export function FormField({
  label,
  error,
  hint,
  icon,
  id,
  required,
  className = '',
  ...rest
}: FormFieldProps) {
  const inputId = id ?? slug(label)
  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      required={required}
    >
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          className={fieldClasses(Boolean(error), Boolean(icon), className)}
          {...rest}
        />
      </div>
    </FieldShell>
  )
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function FormTextarea({
  label,
  error,
  hint,
  id,
  required,
  rows = 4,
  className = '',
  ...rest
}: FormTextareaProps) {
  const inputId = id ?? slug(label)
  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      required={required}
    >
      <textarea
        id={inputId}
        required={required}
        rows={rows}
        className={fieldClasses(Boolean(error), false, className)}
        {...rest}
      />
    </FieldShell>
  )
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
}

export function FormSelect({
  label,
  error,
  hint,
  id,
  required,
  className = '',
  children,
  ...rest
}: FormSelectProps) {
  const inputId = id ?? slug(label)
  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      required={required}
    >
      <select
        id={inputId}
        required={required}
        className={`${fieldClasses(Boolean(error), false, className)} cursor-pointer`}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  )
}