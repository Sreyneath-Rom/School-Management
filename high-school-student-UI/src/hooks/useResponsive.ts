import { useState, useEffect, useCallback, useMemo } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export interface ResponsiveState {
  breakpoint: Breakpoint
  width: number
  height: number
  isMobile: boolean     // < 768px (xs, sm)
  isTablet: boolean     // 768px - 1023px (md)
  isDesktop: boolean    // >= 1024px (lg, xl, 2xl)
  isWide: boolean       // >= 1440px
  isPortrait: boolean
  isLandscape: boolean
  isTouch: boolean
  pixelRatio: number
  isAtLeast: (bp: Breakpoint) => boolean
  isAtMost: (bp: Breakpoint) => boolean
  isBetween: (minBp: Breakpoint, maxBp: Breakpoint) => boolean
}

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS['2xl']) return '2xl'
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * useResponsive Hook
 * Provides reactive screen dimensions, active breakpoint, orientation,
 * device category helpers, and utility functions for responsive UI rendering.
 */
export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, 50)
    }

    const handleTouchCheck = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })
    window.addEventListener('touchstart', handleTouchCheck, { once: true, passive: true })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const { width, height } = dimensions
  const breakpoint = useMemo(() => getBreakpoint(width), [width])
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  const isAtLeast = useCallback(
    (bp: Breakpoint) => width >= BREAKPOINTS[bp],
    [width]
  )

  const isAtMost = useCallback(
    (bp: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      const index = order.indexOf(bp)
      if (index === order.length - 1) return true
      const nextBp = order[index + 1]
      return width < BREAKPOINTS[nextBp]
    },
    [width]
  )

  const isBetween = useCallback(
    (minBp: Breakpoint, maxBp: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      const minIndex = order.indexOf(minBp)
      const maxIndex = order.indexOf(maxBp)
      if (minIndex > maxIndex) return false
      return isAtLeast(minBp) && isAtMost(maxBp)
    },
    [isAtLeast, isAtMost]
  )

  return useMemo(
    () => ({
      breakpoint,
      width,
      height,
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isWide: width >= 1440,
      isPortrait: height > width,
      isLandscape: width >= height,
      isTouch,
      pixelRatio,
      isAtLeast,
      isAtMost,
      isBetween,
    }),
    [breakpoint, width, height, isTouch, pixelRatio, isAtLeast, isAtMost, isBetween]
  )
}

/**
 * useBreakpoint: Lightweight alias for breakpoint-only queries
 */
export function useBreakpoint() {
  const responsive = useResponsive()
  return {
    breakpoint: responsive.breakpoint,
    isMobile: responsive.isMobile,
    isTablet: responsive.isTablet,
    isDesktop: responsive.isDesktop,
    isAtLeast: responsive.isAtLeast,
    isAtMost: responsive.isAtMost,
  }
}
