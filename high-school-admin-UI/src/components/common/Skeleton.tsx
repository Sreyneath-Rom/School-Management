// src/components/common/Skeleton.tsx
import type { CSSProperties, HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rounded' | 'card'
  className?: string
  width?: string | number
  height?: string | number
}

const VARIANT: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full shrink-0',
  rounded: 'rounded-2xl',
  card: 'rounded-[28px]',
}

export function Skeleton({
  variant = 'rounded',
  className = '',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const mergedStyle: CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  }

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-fg/8 backdrop-blur-xs ${VARIANT[variant]} ${className}`}
      style={mergedStyle}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="min-h-44 rounded-3xl glass-sm border border-surface p-5">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

export function ChartCardSkeleton({
  type = 'area',
}: {
  type?: 'area' | 'donut'
} = {}) {
  return (
    <section className="rounded-[28px] glass-sm border border-surface p-6 min-h-90 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {type === 'donut' ? (
        <div className="my-auto flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center">
            <Skeleton variant="circular" className="h-44 w-44" />
            <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-surface backdrop-blur-md" />
          </div>
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 my-auto">
          <div className="flex items-end justify-between gap-2 h-48 px-2 pt-6">
            {[40, 75, 55, 90, 65, 80].map((h, i) => (
              <Skeleton key={i} className="w-[12%] rounded-t-xl" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between px-2 pt-2 border-t border-surface">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export function ListCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <section className="glass-sm border border-surface rounded-[28px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-44" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-surface rounded-3xl p-5 flex items-center gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skeleton