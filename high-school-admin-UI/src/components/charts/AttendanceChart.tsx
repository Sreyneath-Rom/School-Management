import { useState } from 'react'
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
import { TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react'

interface AttendanceChartProps {
  loading?: boolean
}

export default function AttendanceChart({ loading: externalLoading }: AttendanceChartProps = {}) {
  const { data: summary, loading: fetchLoading } = useFetch<AttendanceSummary>(() =>
    dashboardService.getAttendanceSummary()
  )
  const loading = externalLoading ?? fetchLoading
  const totalCount = summary?.reduce((sum, item) => sum + item._count, 0) ?? 0
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  if (loading) {
    return <ChartCardSkeleton type="area" />
  }

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-color">
              Institutional Attendance Velocity
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-300">
              <TrendingUp size={11} />
              +2.3% vs Last Week
            </span>
          </div>
          <p className="text-xs text-secondary">
            Daily physical check-in rate across all 6 grades
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-surface p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange('week')}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                timeRange === 'week'
                  ? 'bg-surface-strong text-color shadow-xs font-bold'
                  : 'text-secondary hover:text-color'
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                timeRange === 'month'
                  ? 'bg-surface-strong text-color shadow-xs font-bold'
                  : 'text-secondary hover:text-color'
              }`}
            >
              Monthly
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-2.5 py-1 text-xs font-bold text-color border border-surface">
            <Users size={12} className="text-brand-600 dark:text-brand-400" />
            <span>{summary ? `${totalCount} records` : '1,240 enrolled'}</span>
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData} margin={{ top: 20, right: 12, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[60, 100]}
              ticks={[60, 70, 80, 90, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              width={42}
            />
            <Tooltip content={<CustomAttendanceTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0d9488"
              strokeWidth={3}
              fill="url(#attendanceGradient)"
              dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#0f766e', strokeWidth: 2, stroke: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metric badges footer */}
      {summary && summary.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-3 pt-3 border-t border-surface">
          {summary.map((item) => (
            <div
              key={item.status}
              className="rounded-2xl bg-surface p-3 border border-surface"
            >
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">
                {item.status}
              </div>
              <div className="mt-1 text-xl font-black text-color">
                {item._count}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CustomAttendanceTooltip({
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
    <div className="dropdown-surface rounded-xl p-2.5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-500" />
        <span className="text-xs font-bold text-color">{label}</span>
      </div>
      <div className="mt-1 text-xs font-extrabold text-brand-600 dark:text-brand-400">
        Attendance Rate: {value}%
      </div>
    </div>
  )
}
