import { todayAbsentees } from '@/services/attendanceMockData'
import Button from '@/components/common/Button'

export default function TodayAbsentees() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Today's Absentees</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{todayAbsentees.length} students marked absent</p>
        </div>
        <Button variant="solid">View Full List</Button>
      </div>

      <div className="space-y-4">
        {todayAbsentees.map((student) => (
          <div
            key={student.id}
            className="group rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50/60 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-700/15 text-rose-700 ring-1 ring-rose-700/15 font-semibold transition-transform duration-300 ease-out group-hover:scale-105">
                {student.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {student.grade} · {student.reason}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}