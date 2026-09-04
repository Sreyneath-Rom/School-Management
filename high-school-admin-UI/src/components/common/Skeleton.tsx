import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rounded' | 'card'
  className?: string
  width?: string | number
  height?: string | number
}

export function Skeleton({
  variant = 'rounded',
  className = '',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rounded: 'rounded-2xl',
    card: 'rounded-[28px]',
  }

  const customStyle: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  }

  return (
    <div
      className={`relative overflow-hidden bg-black/8 dark:bg-white/8 backdrop-blur-xs animate-pulse ${variantClasses[variant]} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
    </div>
  )
}

/**
 * Skeleton for single Stat Card (used in Dashboard & Attendance)
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-[28px] glass-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        {/* Icon square placeholder */}
        <Skeleton variant="rounded" className="h-12 w-12 !rounded-3xl" />
        {/* Delta pill placeholder */}
        <Skeleton variant="rounded" className="h-6 w-14 !rounded-full" />
      </div>
      <div className="pt-2 space-y-2">
        {/* Label line placeholder */}
        <Skeleton variant="text" className="h-4 w-20 !rounded-md" />
        {/* Big number placeholder */}
        <Skeleton variant="text" className="h-8 w-28 !rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Skeleton for large Chart Cards (e.g. Attendance Area Chart, Enrollment Donut)
 */
export function ChartCardSkeleton({
  type = 'area',
}: {
  type?: 'area' | 'donut'
} = {}) {
  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-5 w-36 !rounded-md" />
          <Skeleton variant="text" className="h-3.5 w-20 !rounded-md" />
        </div>
        <Skeleton variant="rounded" className="h-8 w-24 !rounded-full" />
      </div>

      {type === 'donut' ? (
        <div className="my-auto flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center">
            <Skeleton variant="circular" className="h-44 w-44" />
            <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white/40 dark:bg-black/30 backdrop-blur-md" />
          </div>
          <div className="mt-6 flex gap-4">
            <Skeleton variant="text" className="h-3.5 w-16 !rounded-full" />
            <Skeleton variant="text" className="h-3.5 w-16 !rounded-full" />
            <Skeleton variant="text" className="h-3.5 w-16 !rounded-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 my-auto">
          <div className="flex items-end justify-between gap-2 h-48 px-2 pt-6">
            <Skeleton className="h-[40%] w-[12%] !rounded-t-xl" />
            <Skeleton className="h-[75%] w-[12%] !rounded-t-xl" />
            <Skeleton className="h-[55%] w-[12%] !rounded-t-xl" />
            <Skeleton className="h-[90%] w-[12%] !rounded-t-xl" />
            <Skeleton className="h-[65%] w-[12%] !rounded-t-xl" />
            <Skeleton className="h-[80%] w-[12%] !rounded-t-xl" />
          </div>
          <div className="flex justify-between px-2 pt-2 border-t border-black/5 dark:border-white/5">
            <Skeleton variant="text" className="h-3 w-8" />
            <Skeleton variant="text" className="h-3 w-8" />
            <Skeleton variant="text" className="h-3 w-8" />
            <Skeleton variant="text" className="h-3 w-8" />
            <Skeleton variant="text" className="h-3 w-8" />
            <Skeleton variant="text" className="h-3 w-8" />
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * Skeleton for List/Feed Cards (UpcomingEvents, RecentActivities, Leave Requests, Announcements)
 */
export function ListCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <section className="glass rounded-[28px] p-6 text-text-main">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-5 w-32 !rounded-md" />
          <Skeleton variant="text" className="h-3.5 w-44 !rounded-md" />
        </div>
        <Skeleton variant="rounded" className="h-8 w-24 !rounded-2xl" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="glass rounded-3xl p-5 flex items-center gap-4">
            <Skeleton variant="rounded" className="h-12 w-12 shrink-0 !rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton variant="text" className="h-4 w-3/4 !rounded-md" />
              <Skeleton variant="text" className="h-3 w-1/2 !rounded-md" />
            </div>
            <Skeleton variant="rounded" className="h-5 w-14 shrink-0 !rounded-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skeleton
