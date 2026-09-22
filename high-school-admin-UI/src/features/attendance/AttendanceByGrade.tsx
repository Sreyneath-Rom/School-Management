// src/features/attendance/AttendanceByGrade.tsx
import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { attendanceByGradeData } from '@/services/attendanceMockData'

export default function AttendanceByGrade() {
  const total = attendanceByGradeData.reduce((sum, item) => sum + item.count, 0)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-fg">Attendance by Grade</h2>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className="h-55 w-full max-w-[320px]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setCursorPos({ x: e.clientX - rect.left + 14, y: e.clientY - rect.top + 14 })
          }}
          onMouseLeave={() => setCursorPos(null)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceByGradeData}
                dataKey="count"
                nameKey="grade"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
              >
                {attendanceByGradeData.map((slice) => (
                  <Cell key={slice.grade} fill={slice.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip total={total} />}
                position={cursorPos ?? undefined}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 50 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto flex w-fit -translate-y-1/2 flex-col items-center rounded-full px-6 py-4 text-center shadow-[var(--shadow-emboss-sunken)]">
          <div className="text-3xl font-semibold text-fg">{total.toLocaleString()}</div>
          <div className="text-sm text-fg-muted">Present</div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {attendanceByGradeData.map((slice) => (
          <li key={slice.grade} className="flex items-center gap-3 text-sm text-fg-muted">
            <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ background: slice.color }} />
            <span className="flex-1 text-fg-muted">{slice.grade}</span>
            <span className="font-semibold text-fg">{slice.count}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; payload?: { grade: string; count: number; color: string } }>
  total: number
}) {
  if (!active || !payload || !payload.length) return null

  const entry = payload[0].payload
  if (!entry) return null

  const percent = total > 0 ? Math.round((entry.count / total) * 100) : 0

  return (
    <div className="dropdown-surface rounded-2xl px-3 py-2 text-[13px]">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
        <span className="font-semibold text-fg">{entry.grade}</span>
      </div>
      <div className="mt-1 text-fg-muted">
        {entry.count} present <span className="text-fg-muted">({percent}%)</span>
      </div>
    </div>
  )
}