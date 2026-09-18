// src/components/dashboard/AttendanceChart.tsx
import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService } from '@/services/dashboardService'
import { ChartCardSkeleton } from '@/components/common/Skeleton'
import { TrendingUp, Users } from 'lucide-react'
import type { AttendanceStats } from '@/types/attendance'

interface AttendanceChartProps {
  loading?: boolean
}

export default function AttendanceChart({
  loading: externalLoading,
}: AttendanceChartProps = {}) {
  const { data, loading: fetchLoading } = useFetch<AttendanceStats>(() =>
    dashboardService.getAttendanceSummary()
  )
  const loading = externalLoading ?? fetchLoading
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  // The dashboard summary endpoint returns a single object with counts per
  // status. Reshape into the array Recharts expects.
  const chartData = data
    ? [
        { day: 'Present', value: data.present },
        { day: 'Late',    value: data.late },
        { day: 'Absent',  value: data.absent },
        { day: 'Excused', value: data.excused },
      ]
    : []

  const total = data?.total ?? 0

  if (loading) return <ChartCardSkeleton type="area" />

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-fg">
              Attendance Overview
            </h2>
            {data && (
              <span className="flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                <TrendingUp size={11} />
                {data.attendanceRate}% rate
              </span>
            )}
          </div>
          <p className="text-xs text-fg-muted">
            Attendance breakdown for the current period
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-surface p-0.5 text-xs font-semibold">
            {(['week', 'month'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-surface-strong text-fg shadow-xs font-bold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {range === 'week' ? 'This Week' : 'Monthly'}
              </button>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-2.5 py-1 text-xs font-bold text-fg border border-surface">
            <Users size={12} className="text-brand-600 dark:text-brand-400" />
            <span>{total} records</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-fg-muted">
            No attendance records available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 12, left: -14, bottom: 0 }}
            >
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--glass-outline)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-color-secondary)', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-color-secondary)', fontSize: 11, fontWeight: 500 }}
                width={42}
              />
              <Tooltip content={<CustomTooltip />} />
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
        )}
      </div>

      {data && (
        <div className="mt-4 grid gap-2 sm:grid-cols-4 pt-3 border-t border-surface">
          {chartData.map((row) => (
            <div key={row.day} className="rounded-2xl bg-surface p-3 border border-surface">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-fg-muted">
                {row.day}
              </div>
              <div className="mt-1 text-xl font-black text-fg">{row.value}</div>
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
  payload?: Array<{ value?: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="dropdown-surface rounded-xl p-2.5 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-500" />
        <span className="text-xs font-bold text-fg">{label}</span>
      </div>
      <div className="mt-1 text-xs font-extrabold text-brand-600 dark:text-brand-400">
        {payload[0].value} records
      </div>
    </div>
  )
}