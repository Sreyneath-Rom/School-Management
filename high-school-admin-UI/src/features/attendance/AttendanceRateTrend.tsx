import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { attendanceTrendData } from '@/services/attendanceMockData'
import { useFetch } from '@/hooks/useFetch'
import { attendanceService, type AttendanceStatusBreakdown } from '@/services/attendanceService'

export default function AttendanceRateTrend() {
  const { data: breakdown } = useFetch<AttendanceStatusBreakdown>(() => attendanceService.getStatusBreakdown())
  const totalCount = breakdown?.reduce((sum, item) => sum + item._count, 0) ?? 0

  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Attendance Rate Trend</h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">This Week</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full glass-sm px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-100">
          <span>{breakdown ? `${totalCount} records` : 'Live summary'}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceTrendData} margin={{ top: 24, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceRateFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0fa3b3" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#0fa3b3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(168, 162, 158, 0.35)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} dy={8} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#78716c', fontSize: 12 }}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0fa3b3"
              strokeWidth={2.5}
              fill="url(#attendanceRateFill)"
              dot={{ r: 4, fill: '#0fa3b3', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {breakdown && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {breakdown.map((item) => (
            <div key={item.status} className="rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
              <div className="font-semibold uppercase tracking-[0.18em] text-stone-500">{item.status}</div>
              <div className="mt-2 text-2xl font-semibold text-stone-900">{item._count}</div>
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
        border: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow:
          '0 20px 60px rgba(15, 23, 42, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        outline: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: '#0fa3b3' }} />
        <span className="font-semibold text-stone-900 dark:text-stone-100">{label}</span>
      </div>
      <div className="mt-1 text-stone-600 dark:text-stone-400">Attendance: {value}%</div>
    </div>
  )
}