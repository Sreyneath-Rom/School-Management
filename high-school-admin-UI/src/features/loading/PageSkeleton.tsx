import {
  ChartCardSkeleton,
  ListCardSkeleton,
  Skeleton,
  StatCardSkeleton,
} from '@/components/common/Skeleton'

interface PageSkeletonProps {
  statCount?: number
  chartCount?: number
  listCount?: number
}

export default function PageSkeleton({
  statCount = 4,
  chartCount = 2,
  listCount = 1,
}: PageSkeletonProps) {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-52 rounded-xl" />
          <Skeleton className="h-4 w-72 max-w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: statCount }, (_, index) => (
          <StatCardSkeleton key={`stat-${index}`} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: chartCount }, (_, index) => (
          <ChartCardSkeleton key={`chart-${index}`} type={index % 2 === 1 ? 'donut' : 'area'} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: listCount }, (_, index) => (
          <ListCardSkeleton key={`list-${index}`} rows={4} />
        ))}
      </div>

      <span className="sr-only">Loading content</span>
    </div>
  )
}

export function AppLoadingSkeleton() {
  return (
    <div className="page-theme min-h-dvh p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <PageSkeleton statCount={4} chartCount={2} listCount={2} />
      </div>
    </div>
  )
}

export function InlineLoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-2xl p-4 shadow-sunken">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
