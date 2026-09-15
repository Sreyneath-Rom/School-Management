import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  School,
  ChevronRight,
  CheckCheck,
} from 'lucide-react'

interface GradeAttendance {
  grade: string
  present: number
  total: number
  excused: number
  unexcused: number
  status: 'optimal' | 'moderate' | 'action-required'
}

const attendanceByGrade: GradeAttendance[] = [
  { grade: 'Grade 7 (ថ្នាក់ទី ៧)', present: 201, total: 210, excused: 7, unexcused: 2, status: 'optimal' },
  { grade: 'Grade 8 (ថ្នាក់ទី ៨)', present: 236, total: 245, excused: 6, unexcused: 3, status: 'optimal' },
  { grade: 'Grade 9 (ថ្នាក់ទី ៩)', present: 244, total: 260, excused: 11, unexcused: 5, status: 'optimal' },
  { grade: 'Grade 10 (ថ្នាក់ទី ១០)', present: 271, total: 290, excused: 12, unexcused: 7, status: 'moderate' },
  { grade: 'Grade 11 (ថ្នាក់ទី ១១)', present: 153, total: 160, excused: 5, unexcused: 2, status: 'optimal' },
  { grade: 'Grade 12 (ថ្នាក់ទី ១២)', present: 114, total: 119, excused: 4, unexcused: 1, status: 'optimal' },
]

export default function LiveAttendanceBreakdown() {
  const totalPresent = attendanceByGrade.reduce((acc, g) => acc + g.present, 0)
  const totalStudents = attendanceByGrade.reduce((acc, g) => acc + g.total, 0)
  const totalExcused = attendanceByGrade.reduce((acc, g) => acc + g.excused, 0)
  const totalUnexcused = attendanceByGrade.reduce((acc, g) => acc + g.unexcused, 0)
  const overallRate = ((totalPresent / totalStudents) * 100).toFixed(1)

  return (
    <div className="rounded-3xl border border-surface bg-surface-strong p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-color">
              Daily Attendance Breakdown
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-secondary">
            Real-time cohort check-ins across secondary divisions
          </p>
        </div>

        <Link
          to="/students/attendance"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Roll Call</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl bg-surface p-3 border border-surface">
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Rate</p>
          <p className="text-base sm:text-lg font-black text-color">{overallRate}%</p>
          <p className="text-[10px] text-success font-semibold">{totalPresent} present</p>
        </div>
        <div className="text-center sm:text-left border-x border-surface px-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Excused</p>
          <p className="text-base sm:text-lg font-black text-warning">{totalExcused}</p>
          <p className="text-[10px] text-secondary">Parent notes</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Unexcused</p>
          <p className="text-base sm:text-lg font-black text-error">{totalUnexcused}</p>
          <p className="text-[10px] text-secondary">SMS dispatched</p>
        </div>
      </div>

      {/* Grade Rows */}
      <div className="mt-4 divide-y divide-surface">
        {attendanceByGrade.map((row) => {
          const percent = Math.round((row.present / row.total) * 100)
          return (
            <div key={row.grade} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-color truncate">
                    {row.grade}
                  </span>
                  <span className="font-mono text-xs font-black text-color">
                    {percent}% <span className="text-[10px] font-normal text-secondary">({row.present}/{row.total})</span>
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
