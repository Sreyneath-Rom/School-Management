import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { enrollmentData } from '@/services/mockData'
import { ChartCardSkeleton } from '@/components/common/Skeleton'
import { GraduationCap, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EnrollmentDonutProps {
  loading?: boolean
}

// Modern, accessible color palette harmonized with teal/emerald/indigo
const gradeColors = [
  '#0d9488', // Teal-600 (Grade 7)
  '#059669', // Emerald-600 (Grade 8)
  '#2563eb', // Blue-600 (Grade 9)
  '#4f46e5', // Indigo-600 (Grade 10)
  '#9333ea', // Purple-600 (Grade 11)
  '#ea580c', // Orange-600 (Grade 12)
]

export default function EnrollmentDonut({ loading }: EnrollmentDonutProps = {}) {
  const total = enrollmentData.reduce((sum, item) => sum + item.count, 0)
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null)

  if (loading) {
    return <ChartCardSkeleton type="donut" />
  }

  const activeData = hoveredGrade
    ? enrollmentData.find((d) => d.grade === hoveredGrade)
    : null

  return (
    <section className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Enrollment Demographics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Student cohort distribution
          </p>
        </div>

        <Link
          to="/students"
          className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Roster</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Donut graphic with center stats */}
      <div className="relative my-2 flex items-center justify-center">
        <div className="h-48 w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enrollmentData}
                dataKey="count"
                nameKey="grade"
                innerRadius={58}
                outerRadius={84}
                paddingAngle={3}
                startAngle={90}
                endAngle={450}
                stroke="transparent"
                onMouseEnter={(_, index) => setHoveredGrade(enrollmentData[index].grade)}
                onMouseLeave={() => setHoveredGrade(null)}
              >
                {enrollmentData.map((slice, index) => (
                  <Cell
                    key={slice.grade}
                    fill={gradeColors[index % gradeColors.length]}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Center Callout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeData ? activeData.count.toLocaleString() : total.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {activeData ? activeData.grade : 'Enrolled'}
          </span>
        </div>
      </div>

      {/* Compact Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {enrollmentData.map((slice, index) => {
          const percent = total > 0 ? Math.round((slice.count / total) * 100) : 0
          const color = gradeColors[index % gradeColors.length]
          const isHovered = hoveredGrade === slice.grade

          return (
            <div
              key={slice.grade}
              onMouseEnter={() => setHoveredGrade(slice.grade)}
              onMouseLeave={() => setHoveredGrade(null)}
              className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 transition cursor-pointer ${
                isHovered
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate text-[11px]">
                  {slice.grade}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white ml-2">
                {percent}%
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
