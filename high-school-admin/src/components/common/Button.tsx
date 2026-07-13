import React from 'react'

type ButtonVariant = 'glass' | 'solid'

const variantClasses: Record<ButtonVariant, string> = {
  glass:
    'rounded-full glass-sm px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100',
  solid:
    'rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700',
}

export default function Button({
  children,
  onClick,
  variant = 'glass',
  type = 'button',
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  )
}