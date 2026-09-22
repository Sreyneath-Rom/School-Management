// src/features/attendance/TodayAbsentees.tsx
import { todayAbsentees } from '@/services/attendanceMockData'
import Button from '@/components/common/Button'

export default function TodayAbsentees() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">Today's Absentees</h2>
          <p className="text-sm text-fg-muted">{todayAbsentees.length} students marked absent</p>
        </div>
        <Button variant="solid">View Full List</Button>
      </div>

      <div className="space-y-4">
        {todayAbsentees.map((student) => (
          <div
            key={student.id}
            className="group rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:shadow-(--glass-strong-shadow)"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-error/15 text-error font-semibold transition-transform duration-300 ease-out group-hover:scale-105 shadow-sunken">
                {student.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-fg">{student.name}</p>
                <p className="text-sm text-fg-muted">
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