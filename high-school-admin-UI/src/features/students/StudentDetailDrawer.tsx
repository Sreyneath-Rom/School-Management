// src/features/students/StudentDetailDrawer.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, GraduationCap, Sparkles, BookOpen, CheckCircle2, XCircle,
  Edit2, Printer, ExternalLink, HeartHandshake, User,
} from 'lucide-react'
import type { StudentUser } from '@/types/user'

interface StudentDetailDrawerProps {
  student: StudentUser | null
  isOpen: boolean
  onClose: () => void
  onEdit: (student: StudentUser) => void
  onToggleStatus: (student: StudentUser) => void
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student, isOpen, onClose, onEdit, onToggleStatus,
}) => {
  const navigate = useNavigate()
  const [drawerTab, setDrawerTab] = useState<'overview' | 'academic' | 'attendance'>('overview')

  if (!isOpen || !student) return null

  const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
  const attendance = (student as any).attendanceRate || 96.5
  const gpa = (student as any).gpa || 3.85
  const parentName = student.fatherName || student.motherName || student.guardianName || 'Not Listed'
  const parentPhone = student.parentPhone || student.phone || 'Not Provided'
  const parentEmail = student.parentEmail || 'Not Provided'

  const handlePrint = () => window.print()
  const handleGoToFullProfile = () => {
    onClose()
    navigate(`/students/profiles?id=${student.id}`)
  }

  const rowDivider = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'

  return (
    <div
      // Flat scrim — no backdrop-blur.
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col glass-strong shadow-(--glass-strong-shadow) animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-2 text-xs font-bold text-fg-muted uppercase tracking-wider">
            <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>Student Profile Dossier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoToFullProfile}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:shadow-sunken transition cursor-pointer"
              title="Open full 360° profile page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Full Profile</span>
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg p-1.5 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              title="Print Summary"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Hero card — sunken well */}
          <div className="flex items-start gap-4 rounded-2xl p-5 shadow-sunken">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-2xl font-bold text-brand-700 dark:text-brand-300 shadow-emboss">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-fg">
                  {student.firstName} {student.lastName}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    student.status === 'active'
                      ? 'bg-success/15 text-success border border-success/25'
                      : 'text-fg-muted shadow-sunken'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      student.status === 'active' ? 'bg-success animate-pulse' : 'bg-fg-muted/60'
                    }`}
                  />
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300 mt-0.5">
                {student.studentId || student.id}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-lg px-2.5 py-1 text-xs font-semibold text-fg shadow-sunken">
                  {student.grade} - {student.class}
                </span>
                {(student.role as string) === 'mazer' && (
                  <span className="rounded-lg bg-brand-500/15 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                    Mazer Prefect
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats — sunken wells */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3.5 text-center shadow-sunken">
              <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                Cumulative GPA
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-xl font-black text-warning">
                <Sparkles className="h-4 w-4" />
                <span>{Number(gpa).toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-fg-muted mt-0.5">Rank: Top 5% of Grade</div>
            </div>

            <div className="rounded-xl p-3.5 text-center shadow-sunken">
              <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                Attendance Rate
              </div>
              <div className="mt-1 text-xl font-black text-success">{attendance}%</div>
              <div className="text-[11px] text-fg-muted mt-0.5">177 / 180 Days Present</div>
            </div>
          </div>

          {/* Tabs — sunken tray, active brand-filled */}
          <div className="flex items-center gap-1 pb-2 text-xs font-bold shadow-[0_1px_0_var(--neu-shadow-dark)]">
            {(['overview', 'academic', 'attendance'] as const).map((tab) => {
              const labels: Record<typeof tab, string> = {
                overview: 'Overview & Contacts',
                academic: 'Academics',
                attendance: 'Attendance',
              }
              return (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                    drawerTab === tab
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {labels[tab]}
                </button>
              )
            })}
          </div>

          {drawerTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl p-4 space-y-3 shadow-sunken">
                <div className="flex items-center gap-2 font-bold text-fg">
                  <HeartHandshake className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span>Guardian & Emergency Contact</span>
                </div>
                <div className="space-y-2">
                  {[
                    ['Primary Contact:', parentName],
                    ['Phone:', parentPhone],
                    ['Email:', parentEmail],
                    ['Relationship:', student.relationship || 'Parent / Legal Guardian'],
                  ].map(([label, value], i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between py-1 ${
                        i < arr.length - 1 ? rowDivider : ''
                      }`}
                    >
                      <span className="text-fg-muted">{label}</span>
                      <span className="font-semibold text-fg capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4 space-y-3 shadow-sunken">
                <div className="flex items-center gap-2 font-bold text-fg">
                  <User className="h-4 w-4 text-info" />
                  <span>Personal Details</span>
                </div>
                <div className="space-y-2">
                  {[
                    ['Email:', student.email],
                    ['Date of Birth:', student.dateOfBirth || '2009-04-12'],
                    ['Gender:', student.gender || 'Not specified'],
                    ['Address:', student.address || '742 Evergreen Terrace, Springfield'],
                  ].map(([label, value], i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between py-1 ${
                        i < arr.length - 1 ? rowDivider : ''
                      }`}
                    >
                      <span className="text-fg-muted">{label}</span>
                      <span className="font-medium text-fg capitalize truncate max-w-50">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {drawerTab === 'academic' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl p-4 space-y-3 shadow-sunken">
                <div className="flex items-center gap-2 font-bold text-fg">
                  <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span>Enrolled Courses & Standing</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    ['Advanced Biology', 'Dr. John Whitfield • Grade 10-A', '94% (A+)'],
                    ['Calculus BC', 'Prof. Marcus Kane • Grade 10-A', '96% (A+)'],
                    ['AP Computer Science', 'Elena Vance • Grade 10-A', '98% (A+)'],
                  ].map(([subject, meta, grade]) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between p-2.5 rounded-xl shadow-emboss"
                    >
                      <div>
                        <div className="font-bold text-fg">{subject}</div>
                        <div className="text-[11px] text-fg-muted">{meta}</div>
                      </div>
                      <span className="font-bold text-success">{grade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {drawerTab === 'attendance' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl p-4 space-y-3 shadow-sunken">
                <div className="flex items-center gap-2 font-bold text-fg">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Semester Attendance Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-success/15">
                    <div className="text-[10px] text-success uppercase font-bold">Present</div>
                    <div className="text-base font-black text-success">177 Days</div>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/15">
                    <div className="text-[10px] text-warning uppercase font-bold">Late Arrival</div>
                    <div className="text-base font-black text-warning">2 Days</div>
                  </div>
                  <div className="p-3 rounded-xl bg-info/15">
                    <div className="text-[10px] text-info uppercase font-bold">Excused</div>
                    <div className="text-base font-black text-info">1 Day</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — shadow seam */}
        <div className="px-6 py-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleStatus(student)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-fg shadow-emboss hover:shadow-sunken transition cursor-pointer"
          >
            {student.status === 'active' ? (
              <>
                <XCircle className="h-3.5 w-3.5 text-warning" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Activate</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/25 transition cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-fg-muted hover:text-fg shadow-emboss hover:shadow-sunken transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}