import type { ReactNode } from 'react'

export interface ResponsiveGridProps { children: ReactNode; cols?: Record<string, number>; gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; minChildWidth?: string; className?: string }
const gaps = { none: 'gap-0', xs: 'gap-2', sm: 'gap-3', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' }
export function ResponsiveGrid({ children, cols = { base: 1, sm: 2, md: 2, lg: 3 }, gap = 'md', minChildWidth, className = '' }: ResponsiveGridProps) {
  const classes = minChildWidth ? `grid ${gaps[gap]} ${className}` : `grid grid-cols-${cols.base ?? 1} ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''} ${cols.md ? `md:grid-cols-${cols.md}` : ''} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''} ${gaps[gap]} ${className}`
  return <div className={classes} style={minChildWidth ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minChildWidth}, 1fr))` } : undefined}>{children}</div>
}
