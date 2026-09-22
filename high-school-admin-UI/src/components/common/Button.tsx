// src/components/common/Button.tsx
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'danger' | 'glass' | 'solidOutline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and disables the button. */
  loading?: boolean
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-(--glass-bg) disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800',
  outline:
    'bg-surface text-fg border border-surface hover:bg-surface-strong',
  ghost:
    'bg-transparent text-fg-muted hover:bg-surface hover:text-fg',
  link:
    'bg-transparent text-brand-600 dark:text-brand-400 hover:underline px-0 py-0',
  danger: 'bg-error text-white shadow-sm shadow-error/20 hover:bg-error/90 active:bg-error',
  glass:
    'bg-surface/60 backdrop-blur-md border border-surface text-fg hover:bg-surface-strong',
  solidOutline:
    'bg-surface text-brand-600 border-2 border-brand-500 hover:bg-surface-strong',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    size = 'md',
    loading = false,
    disabled,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const classes = [
    BASE,
    VARIANTS[variant],
    variant === 'link' ? '' : SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classes}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </button>
  )
})

export default Button