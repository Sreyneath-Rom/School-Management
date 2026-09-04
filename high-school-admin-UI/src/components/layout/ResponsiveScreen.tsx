import type { ReactNode } from 'react'

export interface ResponsiveScreenProps {
  /** The content of the screen */
  children: ReactNode
  /** Optional title for the screen */
  title?: string
  /** Optional subtitle or description */
  subtitle?: string
  /** Optional header actions / buttons */
  actions?: ReactNode
  /** Optional icon or badge next to title */
  icon?: ReactNode
  /** Optional custom sticky mobile bottom action bar */
  mobileActionBar?: ReactNode
  /** Maximum width container constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  /** Content padding scale */
  padding?: 'none' | 'compact' | 'normal' | 'spacious'
  /** Custom extra className */
  className?: string
  /** Header className */
  headerClassName?: string
  /** Full height with scroll handling */
  fullHeight?: boolean
}

const maxWidthMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

const paddingMap = {
  none: 'p-0',
  compact: 'p-2 sm:p-3 md:p-4',
  normal: 'p-3 sm:p-5 md:p-6 lg:p-8',
  spacious: 'p-4 sm:p-6 md:p-8 lg:p-10',
}

/**
 * ResponsiveScreen
 * Adaptive top-level screen layout container that manages:
 * - Fluid horizontal and vertical responsive padding
 * - Centered max-width constraints on ultra-wide screens
 * - Mobile vs desktop header and actions reflow
 * - Optional mobile bottom-pinned action bar
 */
export function ResponsiveScreen({
  children,
  title,
  subtitle,
  actions,
  icon,
  mobileActionBar,
  maxWidth = '7xl',
  padding = 'normal',
  className = '',
  headerClassName = '',
  fullHeight = false,
}: ResponsiveScreenProps) {
  const hasHeader = title || subtitle || actions || icon

  return (
    <div
      className={`w-full mx-auto ${maxWidthMap[maxWidth]} ${
        fullHeight ? 'min-h-[calc(100vh-10rem)] flex flex-col' : ''
      } ${className}`}
    >
      {/* Screen Header with responsive stack/flex behavior */}
      {hasHeader && (
        <header
          className={`mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${headerClassName}`}
        >
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl glass-sm text-brand-600 dark:text-brand-400 shadow-xs mt-0.5">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2 sm:line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Desktop/Tablet Header Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {actions}
            </div>
          )}
        </header>
      )}

      {/* Main Screen Body */}
      <div className={`w-full ${paddingMap[padding]} ${fullHeight ? 'flex-1 flex flex-col' : ''}`}>
        {children}
      </div>

      {/* Floating or pinned bottom action bar for mobile devices (< 640px) */}
      {mobileActionBar && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-t border-stone-200/80 dark:border-stone-800 shadow-2xl safe-bottom">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            {mobileActionBar}
          </div>
        </div>
      )}
    </div>
  )
}
