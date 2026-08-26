import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { attendanceData } from '@/services/mockData'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type AttendanceSummary } from '@/services/dashboardService'
import { ChartCardSkeleton } from '@/components/common/Skeleton'

interface AttendanceChartProps {
  loading?: boolean
}

export default function AttendanceChart({ loading: externalLoading }: AttendanceChartProps = {}) {
  const { data: summary, loading: fetchLoading } = useFetch<AttendanceSummary>(() => dashboardService.getAttendanceSummary())
  const loading = externalLoading ?? fetchLoading
  const totalCount = summary?.reduce((sum, item) => sum + item._count, 0) ?? 0

  if (loading) {
    return <ChartCardSkeleton type="area" />
  }

  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Attendance Overview</h2>
          <p className="text-sm text-text-main/65">This Week</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full glass-sm px-4 py-2 text-sm font-semibold text-text-main/70 transition hover:bg-text-main/5">
          <span>{summary ? `${totalCount} records` : 'Live summary'}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData} margin={{ top: 24, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-600)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-brand-600)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--glass-outline)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-color)', fillOpacity: 0.55, fontSize: 12 }} dy={8} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-color)', fillOpacity: 0.55, fontSize: 12 }}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-brand-600)"
              strokeWidth={2.5}
              fill="url(#attendanceFill)"
              dot={{ r: 4, fill: 'var(--color-brand-600)', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              label={renderValueLabel as any}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {summary && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <div key={item.status} className="rounded-3xl glass-sm p-4 text-sm text-text-main/70">
              <div className="font-semibold uppercase tracking-[0.18em] text-text-main/55">{item.status}</div>
              <div className="mt-2 text-2xl font-semibold text-text-main">{item._count}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: { day: string; value: number } }>
  label?: string
}) {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid var(--glass-outline)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: 'var(--glass-shadow)',
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-brand-600)' }} />
        <span className="font-semibold text-text-main">{label}</span>
      </div>
      <div className="mt-1 text-text-main/65">Attendance: {value}%</div>
    </div>
  )
}

function renderValueLabel(props: { x?: number | string; y?: number | string; value?: number | string; index?: number }) {
  const { x, y, value, index } = props
  const nx = typeof x === 'string' ? parseFloat(x) : x
  const ny = typeof y === 'string' ? parseFloat(y) : y
  const nv = typeof value === 'string' ? parseFloat(value) : value
  if (nx === undefined || ny === undefined || nv === undefined) return <g />
  return (
    <text
      key={`label-${index}`}
      x={nx}
      y={ny - 14}
      textAnchor="middle"
      fontSize={12}
      fontWeight={600}
      fill="var(--text-color)"
    >
      {nv}%
    </text>
  )
}