import { Skeleton } from '@/components/common/Skeleton'

export default function PageSkeleton() {
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
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-sm flex min-h-36 flex-col justify-between rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-2xl" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <section key={index} className="glass-sm flex min-h-72 flex-col gap-5 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-44 w-full rounded-2xl" />
          </section>
        ))}
      </div>
      <span className="sr-only">Loading content</span>
    </div>
  )
}

export function AppLoadingSkeleton() {
  return (
    <div className="page-theme flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <PageSkeleton />
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
