import type { ReactNode } from 'react'

export interface ResponsiveStackProps {
  children: ReactNode
  direction?: {
    base?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
    sm?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
    md?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
    lg?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  }
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  wrap?: boolean
  className?: string
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1.5 sm:gap-2',
  sm: 'gap-2.5 sm:gap-3',
  md: 'gap-3 sm:gap-4 md:gap-5',
  lg: 'gap-4 sm:gap-6 md:gap-8',
  xl: 'gap-6 sm:gap-8 md:gap-10',
}

const dirBaseMap = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
}

const dirSmMap = {
  row: 'sm:flex-row',
  col: 'sm:flex-col',
  'row-reverse': 'sm:flex-row-reverse',
  'col-reverse': 'sm:flex-col-reverse',
}

const dirMdMap = {
  row: 'md:flex-row',
  col: 'md:flex-col',
  'row-reverse': 'md:flex-row-reverse',
  'col-reverse': 'md:flex-col-reverse',
}

const dirLgMap = {
  row: 'lg:flex-row',
  col: 'lg:flex-col',
  'row-reverse': 'lg:flex-row-reverse',
  'col-reverse': 'lg:flex-col-reverse',
}

/**
 * ResponsiveStack
 * Flex layout container with responsive direction flipping (e.g. column on mobile, row on desktop).
 */
export function ResponsiveStack({
  children,
  direction = { base: 'col', sm: 'row' },
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = '',
}: ResponsiveStackProps) {
  const dirClasses = [
    direction.base ? dirBaseMap[direction.base] : 'flex-col',
    direction.sm ? dirSmMap[direction.sm] : '',
    direction.md ? dirMdMap[direction.md] : '',
    direction.lg ? dirLgMap[direction.lg] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`flex ${dirClasses} ${alignMap[align]} ${justifyMap[justify]} ${
        gapMap[gap]
      } ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${className}`}
    >
      {children}
    </div>
  )
}
