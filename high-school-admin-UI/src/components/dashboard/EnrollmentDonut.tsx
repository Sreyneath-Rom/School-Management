// src/components/dashboard/EnrollmentDonut.tsx
import { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { classService, type ClassRecord } from '@/services/classService'
import { ChartCardSkeleton } from '@/components/common/Skeleton'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EnrollmentDonutProps {
  loading?: boolean
}

// Recharts reads `fill` as an SVG attribute, not a Tailwind class, so
// these stay literal hex values. Chosen to harmonize with the brand teal
// and the semantic info/success/warning tokens.
const GRADE_COLORS: string[] = [
  '#0d9488', // brand teal
  '#059669', // emerald
  '#2563eb', // blue
  '#4f46e5', // indigo
  '#9333ea', // purple
  '#ea580c', // orange
]

interface EnrollmentSlice {
  grade: string
  count: number
  color: string
}

/**
 * Aggregates the class list into per-grade student counts. Sorted by grade
 * number ascending so a school whose grade levels are 7–12 always renders
 * in that order regardless of the API response order.
 */
function buildSlices(classes: ClassRecord[]): EnrollmentSlice[] {
  const byGrade = new Map<number, number>()

  for (const cls of classes) {
    const students = cls._count?.students ?? 0
    byGrade.set(cls.gradeLevel, (byGrade.get(cls.gradeLevel) ?? 0) + students)
  }

  return Array.from(byGrade.entries())
    .sort(([a], [b]) => a - b)
    .map(([gradeLevel, count], index) => ({
      grade: `Grade ${gradeLevel}`,
      count,
      color: GRADE_COLORS[index % GRADE_COLORS.length],
    }))
}

export default function EnrollmentDonut({
  loading: externalLoading,
}: EnrollmentDonutProps = {}) {
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setFetchLoading(true)

    classService
      .list()
      .then((rows) => {
        if (cancelled) return
        setClasses(rows)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setClasses([])
        setError('Could not load enrollment data')
      })
      .finally(() => {
        if (!cancelled) setFetchLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const slices = useMemo(() => buildSlices(classes), [classes])
  const total = useMemo(
    () => slices.reduce((sum, s) => sum + s.count, 0),
    [slices]
  )

  const loading = externalLoading ?? fetchLoading

  if (loading) return <ChartCardSkeleton type="donut" />

  const activeData = hoveredGrade
    ? slices.find((s) => s.grade === hoveredGrade)
    : null

  return (
    <section className="flex flex-col justify-between rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-fg">Enrollment Demographics</h2>
          <p className="text-xs text-fg-muted">Student cohort distribution</p>
        </div>
        <Link
          to="/students"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700"
        >
          Roster
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {error && slices.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16 text-center">
          <p className="text-sm text-fg-muted">{error}</p>
        </div>
      ) : slices.length === 0 || total === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16 text-center">
          <p className="text-sm text-fg-muted">No enrolled students yet.</p>
        </div>
      ) : (
        <>
          <div className="relative my-2 flex items-center justify-center">
            <div className="h-48 w-full max-w-70">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="count"
                    nameKey="grade"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={450}
                    stroke="transparent"
                    onMouseEnter={(_, index) => setHoveredGrade(slices[index].grade)}
                    onMouseLeave={() => setHoveredGrade(null)}
                  >
                    {slices.map((slice) => (
                      <Cell
                        key={slice.grade}
                        fill={slice.color}
                        className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-fg tracking-tight">
                {activeData ? activeData.count.toLocaleString() : total.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">
                {activeData ? activeData.grade : 'Enrolled'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface text-xs">
            {slices.map((slice) => {
              const percent = total > 0 ? Math.round((slice.count / total) * 100) : 0
              const isHovered = hoveredGrade === slice.grade

              return (
                <div
                  key={slice.grade}
                  onMouseEnter={() => setHoveredGrade(slice.grade)}
                  onMouseLeave={() => setHoveredGrade(null)}
                  className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 transition cursor-pointer ${
                    isHovered
                      ? 'bg-surface font-bold text-fg'
                      : 'text-fg-muted hover:bg-surface hover:text-fg'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate text-[11px]">{slice.grade}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-fg ml-2">
                    {percent}%
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}