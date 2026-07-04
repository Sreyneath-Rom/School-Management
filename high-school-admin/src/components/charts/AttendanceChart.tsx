import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { attendanceData } from '../../services/mockData'

export default function AttendanceChart() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm min-h-90">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Attendance Overview</h2>
          <p className="text-sm text-slate-500">This Week</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
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
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              width={44}
            />
            <Tooltip
              formatter={(value: any) => [`${value}%`, 'Attendance']}
              contentStyle={{
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#attendanceFill)"
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              label={renderValueLabel as any}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
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
      fill="#0f172a"
    >
      {nv}%
    </text>
  )
}
