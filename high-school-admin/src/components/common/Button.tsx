import React from 'react'

type ButtonVariant = 'glass' | 'solid' | 'none' | 'solidOutline' | 'teal'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  none: '',
  glass:
    'rounded-full glass-sm glass-interactive font-semibold text-text-main/70 transition hover:bg-text-main/5',
  teal:
    'rounded-full glass-teal glass-interactive font-semibold text-white',
  solid:
    'rounded-full bg-brand-700 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800',
  solidOutline:
    'rounded-full border border-brand-700 font-semibold text-brand-700 dark:text-brand-300 transition hover:bg-brand-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export default function Button({
  children,
  variant = 'none',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </button>
  )
}