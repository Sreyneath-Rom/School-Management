import type { ReactNode } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import type { Breakpoint } from '@/hooks/useResponsive'

export interface ShowProps {
  children: ReactNode
  /** Show if screen width >= breakpoint */
  above?: Breakpoint
  /** Show if screen width < breakpoint */
  below?: Breakpoint
  /** Show only on specific device category */
  only?: 'mobile' | 'tablet' | 'desktop' | 'touch'
  /** Fallback node when hidden */
  fallback?: ReactNode
}

/**
 * Show: Declaratively render children based on active viewport conditions.
 */
export function Show({ children, above, below, only, fallback = null }: ShowProps) {
  const { isMobile, isTablet, isDesktop, isTouch, isAtLeast } =
    useResponsive()

  let isVisible = true

  if (above) {
    isVisible = isVisible && isAtLeast(above)
  }

  if (below) {
    isVisible = isVisible && !isAtLeast(below)
  }

  if (only) {
    if (only === 'mobile') isVisible = isVisible && isMobile
    if (only === 'tablet') isVisible = isVisible && isTablet
    if (only === 'desktop') isVisible = isVisible && isDesktop
    if (only === 'touch') isVisible = isVisible && isTouch
  }

  return isVisible ? <>{children}</> : <>{fallback}</>
}

export interface HideProps {
  children: ReactNode
  /** Hide if screen width >= breakpoint */
  above?: Breakpoint
  /** Hide if screen width < breakpoint */
  below?: Breakpoint
  /** Hide on specific device category */
  only?: 'mobile' | 'tablet' | 'desktop' | 'touch'
}

/**
 * Hide: Declaratively hide children based on active viewport conditions.
 */
export function Hide({ children, above, below, only }: HideProps) {
  const { isMobile, isTablet, isDesktop, isTouch, isAtLeast } = useResponsive()

  let isHidden = false

  if (above) {
    isHidden = isHidden || isAtLeast(above)
  }

  if (below) {
    isHidden = isHidden || !isAtLeast(below)
  }

  if (only) {
    if (only === 'mobile') isHidden = isHidden || isMobile
    if (only === 'tablet') isHidden = isHidden || isTablet
    if (only === 'desktop') isHidden = isHidden || isDesktop
    if (only === 'touch') isHidden = isHidden || isTouch
  }

  return isHidden ? null : <>{children}</>
}
