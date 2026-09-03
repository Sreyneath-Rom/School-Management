// src/features/students/StudentDetailDrawer.tsx
import React from 'react'
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
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  Printer,
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
  if (!isOpen || !student) return null

  const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
  const attendance = (student as any).attendanceRate || 96
  const gpa = (student as any).gpa || 3.85
  const parentName = student.fatherName || student.motherName || student.guardianName || 'Not Listed'
  const parentPhone = student.parentPhone || student.phone || 'Not Provided'
  const parentEmail = student.parentEmail || 'Not Provided'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-border-card/60 bg-surface-card shadow-2xl animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-card/60 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-main/60 uppercase tracking-wider">
            <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>Student Profile Record</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-text-main"
              title="Print Summary"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-text-main"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Profile Card */}
          <div className="flex items-start gap-4 rounded-2xl border border-border-card/60 bg-surface-base/50 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-2xl font-bold text-brand-600 dark:text-brand-400">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text-main">
                  {student.firstName} {student.lastName}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    student.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      student.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-400'
                    }`}
                  />
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-main/60">
                <span className="font-mono font-semibold text-text-main">
                  {student.studentId || student.id}
                </span>
                <span>•</span>
                <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
                  {student.grade} ({student.class})
                </span>
                {(student.role as string) === 'mazer' && (
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    Class Rep
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Academic Key Metrics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main/60 mb-3">
              Academic Standing
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-card/60 bg-surface-card p-4">
                <div className="flex items-center justify-between text-xs text-text-main/60">
                  <span>Current GPA</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {Number(gpa).toFixed(2)}
                </div>
                <p className="mt-1 text-[11px] text-text-main/55">Scale 4.0 Max</p>
              </div>

              <div className="rounded-xl border border-border-card/60 bg-surface-card p-4">
                <div className="flex items-center justify-between text-xs text-text-main/60">
                  <span>Attendance Rate</span>
                  <Award className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {attendance}%
                </div>
                <p className="mt-1 text-[11px] text-text-main/55">Academic Year 2025-2026</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main/60 mb-3">
              Contact & Identity
            </h4>
            <div className="space-y-3 rounded-2xl border border-border-card/60 bg-surface-card p-4 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Student Email</span>
                </div>
                <span className="font-medium text-text-main">{student.email}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Phone Number</span>
                </div>
                <span className="font-medium text-text-main">{student.phone || '—'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Date of Birth</span>
                </div>
                <span className="font-medium text-text-main">
                  {student.dateOfBirth || '—'} ({student.gender})
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Enrollment Date</span>
                </div>
                <span className="font-medium text-text-main">
                  {student.enrollmentDate || '2023-08-15'}
                </span>
              </div>

              <div className="flex items-start justify-between py-1">
                <div className="flex items-center gap-2 text-text-main/60">
                  <MapPin className="h-3.5 w-3.5 mt-0.5" />
                  <span>Residential Address</span>
                </div>
                <span className="max-w-50 text-right font-medium text-text-main">
                  {student.address || 'Springfield Campus District'}
                </span>
              </div>
            </div>
          </div>

          {/* Parent / Guardian Information */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-main/60 mb-3">
              Parent & Guardian Details
            </h4>
            <div className="space-y-3 rounded-2xl border border-border-card/60 bg-surface-card p-4 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Guardian Name</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-text-main">{parentName}</span>
                  <span className="ml-1 text-[10px] text-text-main/50 capitalize">
                    ({student.relationship || 'Guardian'})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border-card/40">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Primary Emergency Phone</span>
                </div>
                <span className="font-medium text-text-main">{parentPhone}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-text-main/60">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Guardian Email</span>
                </div>
                <span className="font-medium text-text-main">{parentEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border-card/60 bg-surface-base/50 p-4">
          <button
            onClick={() => onToggleStatus(student)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              student.status === 'active'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
            }`}
          >
            {student.status === 'active' ? (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Deactivate Student
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Activate Student
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose()
              onEdit(student)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
