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
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Attendance Breakdown
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time cohort check-ins across secondary divisions
          </p>
        </div>

        <Link
          to="/students/attendance"
          className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Roll Call</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</p>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{overallRate}%</p>
          <p className="text-[10px] text-emerald-600 font-semibold">{totalPresent} present</p>
        </div>
        <div className="text-center sm:text-left border-x border-slate-200/70 dark:border-slate-700/70 px-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Excused</p>
          <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">{totalExcused}</p>
          <p className="text-[10px] text-slate-500">Parent notes</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unexcused</p>
          <p className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">{totalUnexcused}</p>
          <p className="text-[10px] text-slate-500">SMS dispatched</p>
        </div>
      </div>

      {/* Grade Rows */}
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/70">
        {attendanceByGrade.map((row) => {
          const percent = Math.round((row.present / row.total) * 100)
          return (
            <div key={row.grade} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {row.grade}
                  </span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {percent}% <span className="text-[10px] font-normal text-slate-400">({row.present}/{row.total})</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percent >= 94
                        ? 'bg-emerald-500'
                        : percent >= 90
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
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
