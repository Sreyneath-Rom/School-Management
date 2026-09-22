// src/features/attendance/DailyCalendarScheduleView.tsx
import {
  Clock, UserX, ChevronRight, ArrowRight,
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
  { id: 'p1', periodName: 'Homeroom Roll Call', timeRange: '08:00 AM - 08:30 AM', subject: 'Daily Roll Call & Advisory', teacher: 'Sarah Chen (Homeroom Lead)', room: 'Room 101', class: 'Grade 10 - A', status: 'COMPLETED', attendanceRate: 96 },
  { id: 'p2', periodName: 'Period 1', timeRange: '08:35 AM - 09:50 AM', subject: 'Advanced Biology (SCI-301)', teacher: 'Dr. John Whitfield', room: 'Lab 302', class: 'Grade 10 - A', status: 'COMPLETED', attendanceRate: 94 },
  { id: 'p3', periodName: 'Period 2', timeRange: '10:05 AM - 11:20 AM', subject: 'Calculus BC (MTH-402)', teacher: 'Prof. Marcus Kane', room: 'Room 204', class: 'Grade 10 - A', status: 'IN_PROGRESS', attendanceRate: 98 },
  { id: 'p4', periodName: 'Period 3 (Post-Lunch)', timeRange: '12:15 PM - 01:30 PM', subject: 'Digital Illustration & UI (ART-105)', teacher: 'Liam Walker', room: 'Studio A', class: 'Grade 10 - A', status: 'UPCOMING', attendanceRate: 0 },
  { id: 'p5', periodName: 'Period 4', timeRange: '01:45 PM - 03:00 PM', subject: 'Modern World History (HUM-201)', teacher: 'Sarah Parker', room: 'Room 101', class: 'Grade 10 - A', status: 'UPCOMING', attendanceRate: 0 },
]

const CLASSES_SUMMARY = [
  { name: 'Grade 10 - A', grade: 'Grade 10', homeroom: 'Sarah Chen', room: 'Room 101', totalStudents: 28, presentCount: 27, lateCount: 1, absentCount: 0, excusedCount: 0, completionStatus: 'Completed' },
  { name: 'Grade 9 - A', grade: 'Grade 9', homeroom: 'David Miller', room: 'Room 202', totalStudents: 26, presentCount: 24, lateCount: 1, absentCount: 1, excusedCount: 0, completionStatus: 'Completed' },
  { name: 'Grade 11 - B', grade: 'Grade 11', homeroom: 'Claire Bennett', room: 'Room 304', totalStudents: 25, presentCount: 22, lateCount: 2, absentCount: 1, excusedCount: 0, completionStatus: 'Completed' },
  { name: 'Grade 12 - A', grade: 'Grade 12', homeroom: 'Elena Vance', room: 'Room 401', totalStudents: 24, presentCount: 23, lateCount: 0, absentCount: 1, excusedCount: 0, completionStatus: 'Completed' },
]

export default function DailyCalendarScheduleView({
  selectedDate, records, onSelectClassForRoster, onOpenNoteModal, onOpenHistoryDrawer,
}: DailyCalendarScheduleViewProps) {
  const absentees = records.filter((r) => r.status === 'ABSENT' || r.status === 'EXCUSED')
  const tardies = records.filter((r) => r.status === 'LATE')

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-fg uppercase tracking-wider">
              Class Section Rosters & Completion
            </h2>
            <p className="text-xs text-fg-muted">
              Real-time daily homeroom roll call submission status for {selectedDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLASSES_SUMMARY.map((cls) => {
            const pct = Math.round(((cls.presentCount + cls.lateCount) / cls.totalStudents) * 100)
            return (
              <div key={cls.name} className="glass rounded-2xl p-4 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-500/15 text-brand-700 dark:text-brand-300">
                      {cls.name}
                    </span>
                    <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      {cls.completionStatus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-fg">{cls.homeroom}</h3>
                  <p className="text-xs text-fg-muted">{cls.room}</p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-fg-muted">Turnout</span>
                      <span className="font-bold text-fg">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden shadow-sunken">
                      <div className="h-full bg-success rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-3 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] text-center text-xs">
                    <div>
                      <span className="block font-bold text-success">{cls.presentCount}</span>
                      <span className="text-[10px] text-fg-muted">Present</span>
                    </div>
                    <div>
                      <span className="block font-bold text-warning">{cls.lateCount}</span>
                      <span className="text-[10px] text-fg-muted">Late</span>
                    </div>
                    <div>
                      <span className="block font-bold text-error">{cls.absentCount}</span>
                      <span className="text-[10px] text-fg-muted">Absent</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectClassForRoster(cls.name)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-brand-600 dark:text-brand-400 rounded-xl transition-colors hover:shadow-sunken cursor-pointer"
                >
                  <span>Open Class Roster</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <div>
              <h3 className="text-sm font-bold text-fg uppercase tracking-wider">
                Daily Class Schedule Timeline
              </h3>
              <p className="text-xs text-fg-muted">
                Period-level roll logs for {selectedDate}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-fg-muted shadow-sunken">
              5 Scheduled Blocks
            </span>
          </div>

          <div className="space-y-3">
            {PERIOD_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl shadow-sunken flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-fg">{slot.subject}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-fg-muted shadow-sunken">
                        {slot.periodName}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted mt-0.5">
                      {slot.teacher} • {slot.room} • {slot.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-fg">{slot.timeRange}</div>
                    <div className="text-[11px] text-success font-semibold">
                      {slot.status === 'COMPLETED'
                        ? `${slot.attendanceRate}% Logged`
                        : slot.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : 'Upcoming'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenHistoryDrawer(records[0] || ({} as any))}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-error" />
                <span>Absentees ({absentees.length})</span>
              </h3>
            </div>

            {absentees.length === 0 ? (
              <div className="py-6 text-center text-xs text-fg-muted">
                <p className="font-semibold text-success">🎉 No absences logged for today!</p>
                <p className="text-[11px] mt-1">All enrolled students are present or on scheduled leave.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {absentees.map((student) => (
                  <div
                    key={student.id || student.studentId}
                    className="p-3 rounded-xl bg-error/10 flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-fg">{student.studentName}</div>
                      <div className="text-[11px] text-fg-muted">
                        {student.class} • {student.note || 'No reason specified'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenNoteModal(student)}
                      className="px-2 py-1 text-[10px] font-bold text-error rounded-lg shadow-sunken hover:opacity-80 transition shrink-0"
                    >
                      {student.note ? 'Edit Note' : 'Add Excuse'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-warning" />
                <span>Late Check-Ins ({tardies.length})</span>
              </h3>
            </div>

            {tardies.length === 0 ? (
              <div className="py-6 text-center text-xs text-fg-muted">
                <p className="font-semibold">No late arrivals recorded today.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tardies.map((student) => (
                  <div
                    key={student.id || student.studentId}
                    className="p-3 rounded-xl bg-warning/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-fg">{student.studentName}</div>
                      <div className="text-[11px] text-warning font-mono">
                        Arrived: {student.checkIn || '08:24 AM'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenHistoryDrawer(student)}
                      className="text-fg-muted hover:text-fg p-1"
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