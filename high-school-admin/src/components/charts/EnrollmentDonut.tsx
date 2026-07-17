import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { enrollmentData } from '@/services/mockData'

export default function EnrollmentDonut() {
  const total = enrollmentData.reduce((sum, item) => sum + item.count, 0)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Student Enrollment</h2>
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
                data={enrollmentData}
                dataKey="count"
                nameKey="grade"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
              >
                {enrollmentData.map((slice) => (
                  <Cell key={slice.grade} fill={slice.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip total={total} />}
                position={cursorPos ?? undefined}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{
                  zIndex: 50,
                  transition: 'transform 0.12s ease-out, left 0.12s ease-out, top 0.12s ease-out, opacity 0.12s ease-out',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto flex w-fit -translate-y-1/2 flex-col items-center px-6 py-4 text-center">
          <div className="text-3xl font-semibold text-stone-900 dark:text-stone-100">{total.toLocaleString()}</div>
          <div className="text-sm text-stone-600 dark:text-stone-400">Total</div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {enrollmentData.map((slice) => (
          <li key={slice.grade} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ background: slice.color }} />
            <span className="flex-1 text-stone-600 dark:text-stone-400">{slice.grade}</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{slice.count}</span>
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
        <span
          className="inline-flex h-2.5 w-2.5 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="font-semibold text-stone-900">{entry.grade}</span>
      </div>
      <div className="mt-1 text-stone-600">
        {entry.count} students <span className="text-stone-500">({percent}%)</span>
      </div>
    </div>
  )
}