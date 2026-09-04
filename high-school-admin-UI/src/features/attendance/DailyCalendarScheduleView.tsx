import React from 'react'
import {
  Clock,
  UserX,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import type { AttendanceRecord } from '@/services/attendanceService'

interface DailyCalendarScheduleViewProps {
  selectedDate: string
  records: AttendanceRecord[]
  onSelectClassForRoster: (className: string) => void
  onOpenNoteModal: (record: AttendanceRecord) => void
  onOpenHistoryDrawer: (record: AttendanceRecord) => void
}

interface PeriodSlot {
  id: string
  periodName: string
  timeRange: string
  subject: string
  teacher: string
  room: string
  class: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING'
  attendanceRate: number
}

const PERIOD_SLOTS: PeriodSlot[] = [
  {
    id: 'p1',
    periodName: 'Homeroom Roll Call',
    timeRange: '08:00 AM - 08:30 AM',
    subject: 'Daily Roll Call & Advisory',
    teacher: 'Sarah Chen (Homeroom Lead)',
    room: 'Room 101',
    class: 'Grade 10 - A',
    status: 'COMPLETED',
    attendanceRate: 96,
  },
  {
    id: 'p2',
    periodName: 'Period 1',
    timeRange: '08:35 AM - 09:50 AM',
    subject: 'Advanced Biology (SCI-301)',
    teacher: 'Dr. John Whitfield',
    room: 'Lab 302',
    class: 'Grade 10 - A',
    status: 'COMPLETED',
    attendanceRate: 94,
  },
  {
    id: 'p3',
    periodName: 'Period 2',
    timeRange: '10:05 AM - 11:20 AM',
    subject: 'Calculus BC (MTH-402)',
    teacher: 'Prof. Marcus Kane',
    room: 'Room 204',
    class: 'Grade 10 - A',
    status: 'IN_PROGRESS',
    attendanceRate: 98,
  },
  {
    id: 'p4',
    periodName: 'Period 3 (Post-Lunch)',
    timeRange: '12:15 PM - 01:30 PM',
    subject: 'Digital Illustration & UI (ART-105)',
    teacher: 'Liam Walker',
    room: 'Studio A',
    class: 'Grade 10 - A',
    status: 'UPCOMING',
    attendanceRate: 0,
  },
  {
    id: 'p5',
    periodName: 'Period 4',
    timeRange: '01:45 PM - 03:00 PM',
    subject: 'Modern World History (HUM-201)',
    teacher: 'Sarah Parker',
    room: 'Room 101',
    class: 'Grade 10 - A',
    status: 'UPCOMING',
    attendanceRate: 0,
  },
]

const CLASSES_SUMMARY = [
  {
    name: 'Grade 10 - A',
    grade: 'Grade 10',
    homeroom: 'Sarah Chen',
    room: 'Room 101',
    totalStudents: 28,
    presentCount: 27,
    lateCount: 1,
    absentCount: 0,
    excusedCount: 0,
    completionStatus: 'Completed',
  },
  {
    name: 'Grade 9 - A',
    grade: 'Grade 9',
    homeroom: 'David Miller',
    room: 'Room 202',
    totalStudents: 26,
    presentCount: 24,
    lateCount: 1,
    absentCount: 1,
    excusedCount: 0,
    completionStatus: 'Completed',
  },
  {
    name: 'Grade 11 - B',
    grade: 'Grade 11',
    homeroom: 'Claire Bennett',
    room: 'Room 304',
    totalStudents: 25,
    presentCount: 22,
    lateCount: 2,
    absentCount: 1,
    excusedCount: 0,
    completionStatus: 'Completed',
  },
  {
    name: 'Grade 12 - A',
    grade: 'Grade 12',
    homeroom: 'Elena Vance',
    room: 'Room 401',
    totalStudents: 24,
    presentCount: 23,
    lateCount: 0,
    absentCount: 1,
    excusedCount: 0,
    completionStatus: 'Completed',
  },
]

export default function DailyCalendarScheduleView({
  selectedDate,
  records,
  onSelectClassForRoster,
  onOpenNoteModal,
  onOpenHistoryDrawer,
}: DailyCalendarScheduleViewProps) {
  const absentees = records.filter((r) => r.status === 'ABSENT' || r.status === 'EXCUSED')
  const tardies = records.filter((r) => r.status === 'LATE')

  return (
    <div className="space-y-6">
      {/* Class Section Completion Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Class Section Rosters & Completion
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time daily homeroom roll call submission status for {selectedDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLASSES_SUMMARY.map((cls) => {
            const pct = Math.round(((cls.presentCount + cls.lateCount) / cls.totalStudents) * 100)
            return (
              <div
                key={cls.name}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {cls.name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {cls.completionStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {cls.homeroom}
                  </h3>
                  <p className="text-xs text-slate-400">{cls.room}</p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Turnout</span>
                      <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                    <div>
                      <span className="block font-bold text-emerald-600 dark:text-emerald-400">
                        {cls.presentCount}
                      </span>
                      <span className="text-[10px] text-slate-400">Present</span>
                    </div>
                    <div>
                      <span className="block font-bold text-amber-600 dark:text-amber-400">
                        {cls.lateCount}
                      </span>
                      <span className="text-[10px] text-slate-400">Late</span>
                    </div>
                    <div>
                      <span className="block font-bold text-rose-600 dark:text-rose-400">
                        {cls.absentCount}
                      </span>
                      <span className="text-[10px] text-slate-400">Absent</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectClassForRoster(cls.name)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-xl transition-colors"
                >
                  <span>Open Class Roster</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two columns: Daily Period Schedule Timeline + Absentee/Tardy Attention Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Daily Class Schedule Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Period-level roll logs for {selectedDate}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              5 Scheduled Blocks
            </span>
          </div>

          <div className="space-y-3">
            {PERIOD_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 border border-brand-200/40 dark:border-brand-800/40">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {slot.subject}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {slot.periodName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {slot.teacher} • {slot.room} • {slot.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {slot.timeRange}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {slot.status === 'COMPLETED' ? `${slot.attendanceRate}% Logged` : slot.status === 'IN_PROGRESS' ? 'In Progress' : 'Upcoming'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenHistoryDrawer(records[0] || ({} as any))
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Absentees & Tardiness Log */}
        <div className="space-y-6">
          {/* Absentees Alert Board */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-rose-500" />
                <span>Absentees ({absentees.length})</span>
              </h3>
            </div>

            {absentees.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  🎉 No absences logged for today!
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  All enrolled students are present or on scheduled leave.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {absentees.map((student) => (
                  <div
                    key={student.id || student.studentId}
                    className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/50 bg-rose-50/40 dark:bg-rose-950/20 flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {student.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {student.class} • {student.note || 'No reason specified'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenNoteModal(student)}
                      className="px-2 py-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 rounded-lg hover:bg-rose-200 transition-colors shrink-0"
                    >
                      {student.note ? 'Edit Note' : 'Add Excuse'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tardiness Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Late Check-Ins ({tardies.length})</span>
              </h3>
            </div>

            {tardies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <p className="font-semibold text-slate-600 dark:text-slate-400">
                  No late arrivals recorded today.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tardies.map((student) => (
                  <div
                    key={student.id || student.studentId}
                    className="p-3 rounded-xl border border-amber-100 dark:border-amber-950/50 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {student.studentName}
                      </div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-mono">
                        Arrived: {student.checkIn || '08:24 AM'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenHistoryDrawer(student)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
