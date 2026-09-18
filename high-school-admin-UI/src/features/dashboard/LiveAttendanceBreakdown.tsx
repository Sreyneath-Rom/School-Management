import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { attendanceService } from '@/services/attendanceService'
import type { AttendanceListRow } from '@/types/attendance'

interface GradeStats {
  gradeLevel: number
  present: number
  total: number
  excused: number
  unexcused: number
}

function buildGradeStats(rows: AttendanceListRow[]): GradeStats[] {
  const byGrade = new Map<number, GradeStats>()

  for (const row of rows) {
    const gradeLevel = row.student?.class?.gradeLevel
    if (gradeLevel === undefined || gradeLevel === null) continue

    const stats =
      byGrade.get(gradeLevel) ??
      { gradeLevel, present: 0, total: 0, excused: 0, unexcused: 0 }

    stats.total += 1
    if (row.status === 'PRESENT' || row.status === 'LATE') stats.present += 1
    else if (row.status === 'EXCUSED') stats.excused += 1
    else stats.unexcused += 1

    byGrade.set(gradeLevel, stats)
  }

  return Array.from(byGrade.values()).sort((a, b) => a.gradeLevel - b.gradeLevel)
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function LiveAttendanceBreakdown() {
  const [rows, setRows] = useState<AttendanceListRow[]>([])
  const [loading, setLoading] = useState(true)
  const [date] = useState(todayIso())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    attendanceService
      .list({ date })
      .then((data) => { if (!cancelled) setRows(data) })
      .catch(() => { if (!cancelled) setRows([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [date])

  const grades = useMemo(() => buildGradeStats(rows), [rows])
  const totalPresent = grades.reduce((acc, g) => acc + g.present, 0)
  const totalStudents = grades.reduce((acc, g) => acc + g.total, 0)
  const totalExcused = grades.reduce((acc, g) => acc + g.excused, 0)
  const totalUnexcused = grades.reduce((acc, g) => acc + g.unexcused, 0)
  const overallRate =
    totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : '—'

  return (
    <div className="rounded-3xl border border-surface bg-surface-strong p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-fg">Daily Attendance Breakdown</h2>
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-fg-muted">Cohort check-ins for {date}</p>
        </div>
        <Link
          to="/students/attendance"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Roll Call</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl bg-surface p-3 border border-surface">
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Rate</p>
          <p className="text-base sm:text-lg font-black text-fg">{overallRate}{overallRate !== '—' ? '%' : ''}</p>
          <p className="text-[10px] text-success font-semibold">{totalPresent} present</p>
        </div>
        <div className="text-center sm:text-left border-x border-surface px-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Excused</p>
          <p className="text-base sm:text-lg font-black text-warning">{totalExcused}</p>
          <p className="text-[10px] text-fg-muted">Parent notes</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Unexcused</p>
          <p className="text-base sm:text-lg font-black text-error">{totalUnexcused}</p>
          <p className="text-[10px] text-fg-muted">SMS dispatched</p>
        </div>
      </div>

      {loading ? (
        <p className="py-6 text-center text-xs text-fg-muted">Loading attendance…</p>
      ) : grades.length === 0 ? (
        <p className="py-6 text-center text-xs text-fg-muted">
          No attendance marked for today.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-surface">
          {grades.map((row) => {
            const percent = Math.round((row.present / row.total) * 100)
            return (
              <div key={row.gradeLevel} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-fg truncate">
                    Grade {row.gradeLevel}
                  </span>
                  <span className="font-mono text-xs font-black text-fg">
                    {percent}%{' '}
                    <span className="text-[10px] font-normal text-fg-muted">
                      ({row.present}/{row.total})
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percent >= 94
                        ? 'bg-success'
                        : percent >= 90
                        ? 'bg-brand-600'
                        : 'bg-warning'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}