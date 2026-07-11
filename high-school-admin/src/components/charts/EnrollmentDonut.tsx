import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { enrollmentData } from '@/services/mockData'

export default function EnrollmentDonut() {
  const total = enrollmentData.reduce((sum, item) => sum + item.count, 0)

  return (
    <section className="rounded-[28px] glass-sm p-6 min-h-90">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Student Enrollment</h2>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="h-55 w-full max-w-[320px]">
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto flex w-fit -translate-y-1/2 flex-col items-center  px-6 py-4 text-center">
          <div className="text-3xl font-semibold text-slate-900">{total.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {enrollmentData.map((slice) => (
          <li key={slice.grade} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ background: slice.color }} />
            <span className="flex-1 text-slate-600">{slice.grade}</span>
            <span className="font-semibold text-slate-900">{slice.count}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}