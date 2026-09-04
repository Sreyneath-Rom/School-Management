import type { ReactNode } from 'react'

export interface ResponsiveGridProps {
  children: ReactNode
  /** Number of columns across responsive breakpoints */
  cols?: {
    base?: 1 | 2 | 3 | 4
    sm?: 1 | 2 | 3 | 4 | 5 | 6
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 8
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12
  }
  /** Gap size between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Auto-fit min card width (e.g. '280px', '320px') */
  minChildWidth?: string
  className?: string
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1.5 sm:gap-2',
  sm: 'gap-2.5 sm:gap-3',
  md: 'gap-3.5 sm:gap-4 md:gap-5',
  lg: 'gap-4 sm:gap-6 md:gap-8',
  xl: 'gap-6 sm:gap-8 md:gap-10',
}

const baseColMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const smColMap: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
}

const mdColMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  8: 'md:grid-cols-8',
}

const lgColMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  8: 'lg:grid-cols-8',
  12: 'lg:grid-cols-12',
}

const xlColMap: Record<number, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  8: 'xl:grid-cols-8',
  12: 'xl:grid-cols-12',
}

const xxlColMap: Record<number, string> = {
  1: '2xl:grid-cols-1',
  2: '2xl:grid-cols-2',
  3: '2xl:grid-cols-3',
  4: '2xl:grid-cols-4',
  5: '2xl:grid-cols-5',
  6: '2xl:grid-cols-6',
  8: '2xl:grid-cols-8',
  12: '2xl:grid-cols-12',
}

/**
 * ResponsiveGrid
 * Clean utility for building breakpoint-responsive dashboards, card listings,
 * and form columns.
 */
export function ResponsiveGrid({
  children,
  cols = { base: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  minChildWidth,
  className = '',
}: ResponsiveGridProps) {
  if (minChildWidth) {
    return (
      <div
        className={`grid ${gapMap[gap]} ${className}`}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`,
        }}
      >
        {children}
      </div>
    )
  }

  const colClasses = [
    cols.base ? baseColMap[cols.base] || 'grid-cols-1' : 'grid-cols-1',
    cols.sm ? smColMap[cols.sm] : '',
    cols.md ? mdColMap[cols.md] : '',
    cols.lg ? lgColMap[cols.lg] : '',
    cols.xl ? xlColMap[cols.xl] : '',
    cols['2xl'] ? xxlColMap[cols['2xl']] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`grid ${colClasses} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  )
}
