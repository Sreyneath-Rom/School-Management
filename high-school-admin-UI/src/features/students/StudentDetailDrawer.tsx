// src/features/students/StudentDetailDrawer.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Edit2,
  Printer,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  User,
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
  student,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
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

  const handlePrint = () => {
    window.print()
  }

  const handleGoToFullProfile = () => {
    onClose()
    navigate(`/students/profiles?id=${student.id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-white/10 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
            <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>Student Profile Dossier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoToFullProfile}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
              title="Open full 360° profile page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Full Profile</span>
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10 dark:hover:text-white transition"
              title="Print Summary"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10 dark:hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Student Profile Hero Card */}
          <div className="flex items-start gap-4 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 text-2xl font-bold text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {student.firstName} {student.lastName}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    student.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/40'
                      : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      student.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                    }`}
                  />
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300 mt-0.5">
                {student.studentId || student.id}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-800 px-2.5 py-1 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {student.grade} - {student.class}
                </span>
                {(student.role as string) === 'mazer' && (
                  <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    Mazer Prefect
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-200/80 dark:border-white/10 bg-stone-50/50 dark:bg-white/5 p-3.5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Cumulative GPA</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xl font-black text-amber-700 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
                <span>{Number(gpa).toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Rank: Top 5% of Grade</div>
            </div>

            <div className="rounded-xl border border-stone-200/80 dark:border-white/10 bg-stone-50/50 dark:bg-white/5 p-3.5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Attendance Rate</div>
              <div className="mt-1 text-xl font-black text-emerald-700 dark:text-emerald-400">
                {attendance}%
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">177 / 180 Days Present</div>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="flex items-center gap-1 border-b border-stone-200/80 dark:border-white/10 pb-2 text-xs font-bold">
            <button
              onClick={() => setDrawerTab('overview')}
              className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                drawerTab === 'overview'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5'
              }`}
            >
              Overview & Contacts
            </button>
            <button
              onClick={() => setDrawerTab('academic')}
              className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                drawerTab === 'academic'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5'
              }`}
            >
              Academics
            </button>
            <button
              onClick={() => setDrawerTab('attendance')}
              className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                drawerTab === 'attendance'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5'
              }`}
            >
              Attendance
            </button>
          </div>

          {/* Tab 1: Overview */}
          {drawerTab === 'overview' && (
            <div className="space-y-4 text-xs">
              {/* Guardian Information */}
              <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                  <HeartHandshake className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span>Guardian & Emergency Contact</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Primary Contact:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{parentName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Phone:</span>
                    <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">{parentPhone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Email:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{parentEmail}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-400">Relationship:</span>
                    <span className="font-semibold capitalize text-stone-800 dark:text-stone-200">
                      {student.relationship || 'Parent / Legal Guardian'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Demographics */}
              <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Personal Details</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Email:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{student.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Date of Birth:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{student.dateOfBirth || '2009-04-12'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-white/5">
                    <span className="text-stone-400">Gender:</span>
                    <span className="font-medium capitalize text-stone-800 dark:text-stone-200">{student.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-400">Address:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                      {student.address || '742 Evergreen Terrace, Springfield'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic */}
          {drawerTab === 'academic' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                  <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span>Enrolled Courses & Standing</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">Advanced Biology</div>
                      <div className="text-[11px] text-stone-400">Dr. John Whitfield • Grade 10-A</div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">94% (A+)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">Calculus BC</div>
                      <div className="text-[11px] text-stone-400">Prof. Marcus Kane • Grade 10-A</div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">96% (A+)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">AP Computer Science</div>
                      <div className="text-[11px] text-stone-400">Elena Vance • Grade 10-A</div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">98% (A+)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Attendance */}
          {drawerTab === 'attendance' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Semester Attendance Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-800/30">
                    <div className="text-[10px] text-emerald-600 uppercase font-bold">Present</div>
                    <div className="text-base font-black text-emerald-700 dark:text-emerald-300">177 Days</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30">
                    <div className="text-[10px] text-amber-600 uppercase font-bold">Late Arrival</div>
                    <div className="text-base font-black text-amber-700 dark:text-amber-300">2 Days</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-800/30">
                    <div className="text-[10px] text-blue-600 uppercase font-bold">Excused</div>
                    <div className="text-base font-black text-blue-700 dark:text-blue-300">1 Day</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200/80 dark:border-white/10 px-6 py-4 flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-white/5">
          <button
            onClick={() => onToggleStatus(student)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 transition"
          >
            {student.status === 'active' ? (
              <>
                <XCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Activate</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
