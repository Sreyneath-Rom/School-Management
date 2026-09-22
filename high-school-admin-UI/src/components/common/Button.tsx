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
  // Colored CTA — keeps its brand fill and soft colored glow.
  solid: 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800',

  // Neumorphic raised surface. `.glass-interactive` supplies the
  // hover-lift / press-in gesture.
  outline: 'glass-sm glass-interactive text-fg',

  // Ghost: flat by default, presses into a sunken well on hover.
  ghost:
    'bg-transparent text-fg-muted hover:text-fg hover:shadow-[var(--shadow-emboss-sunken)]',

  link:
    'bg-transparent text-brand-600 dark:text-brand-400 hover:underline px-0 py-0',

  danger: 'bg-error text-white shadow-sm shadow-error/20 hover:bg-error/90 active:bg-error',

  // Higher lift than `outline` — uses the wide elevated shadow so it
  // floats noticeably above a busy surface.
  glass:
    'glass-sm glass-interactive text-fg shadow-[var(--glass-strong-shadow)]',

  // Brand-outlined raised button: visible border carries the emphasis,
  // hover presses the button in.
  solidOutline:
    'bg-transparent text-brand-600 dark:text-brand-400 border-2 border-brand-500 hover:bg-brand-500/10 hover:shadow-[var(--shadow-emboss-sunken)]',
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