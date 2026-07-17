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

export default function AttendanceChart() {
  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Attendance Overview</h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">This Week</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full glass-sm px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-100">
          This Week
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData} margin={{ top: 24, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#attendanceFill)"
              dot={{ r: 4, fill: '#0fa3b3', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              label={renderValueLabel as any}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
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
        <span className="font-semibold text-stone-900">{label}</span>
      </div>
      <div className="mt-1 text-stone-600">Attendance: {value}%</div>
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
      fill="#1c1917"
    >
      {nv}%
    </text>
  )
}