import React from 'react'

type ButtonVariant = 'glass' | 'solid' | 'none' | 'solidOutline'

const variantClasses: Record<ButtonVariant, string> = {
  none: '',
  glass:
    'rounded-full glass-sm px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-100',
  solid:
    'rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800',
  solidOutline:
    'rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-300 transition hover:bg-brand-50',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  className?: string
}

export default function Button({
  children,
  variant = 'none',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
