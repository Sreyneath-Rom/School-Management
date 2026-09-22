// src/features/students/StudentCardGrid.tsx
import React from 'react'
import {
  Eye, Edit2, Trash2, Phone, Sparkles, CheckCircle2, XCircle, GraduationCap,
} from 'lucide-react'
import type { StudentUser } from '@/types/user'

interface StudentCardGridProps {
  students: StudentUser[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onViewDetails: (student: StudentUser) => void
  onEdit: (student: StudentUser) => void
  onDelete: (student: StudentUser) => void
  onToggleStatus: (student: StudentUser) => void
}

const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

export const StudentCardGrid: React.FC<StudentCardGridProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl glass p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-fg-muted shadow-sunken">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-fg">No Students Found</h3>
        <p className="mt-1 max-w-sm text-xs text-fg-muted">
          No student records match your active search and filter criteria. Try clearing or adjusting filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((student) => {
        const isSelected = selectedIds.includes(student.id)
        const initials =
          `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
        const attendance = (student as any).attendanceRate || 95
        const gpa = (student as any).gpa || 3.82
        const parentName =
          student.fatherName || student.motherName || student.guardianName || 'Guardian'
        const parentPhone = student.parentPhone || student.phone || '—'

        return (
          <div
            key={student.id}
            id={`student-card-${student.id}`}
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-shadow duration-300 ${
              isSelected
                ? 'shadow-sunken ring-1 ring-brand-500/30'
                : 'glass hover:shadow-(--glass-strong-shadow)'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(student.id)}
                  aria-label={`Select student ${student.firstName} ${student.lastName}`}
                  className="h-4 w-4 rounded accent-brand-500 cursor-pointer"
                />
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
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

              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 font-bold text-lg text-brand-700 dark:text-brand-300 shadow-sunken ring-1 ring-surface">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-fg text-sm">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">
                    {student.studentId || student.id}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-fg shadow-sunken">
                      {student.grade} • {student.class}
                    </span>
                    {(student.role as string) === 'mazer' && (
                      <span className="rounded-md bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                        Mazer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1 rounded-xl p-2.5 text-xs text-fg-muted shadow-sunken">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-muted/70">Guardian:</span>
                  <span className="font-semibold truncate max-w-32.5 text-fg">{parentName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-muted/70">Phone:</span>
                  <span className="font-mono font-medium flex items-center gap-1 text-fg">
                    <Phone className="h-3 w-3 text-fg-muted/70" />
                    {parentPhone}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl p-2 text-center shadow-sunken">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                    GPA Score
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1 font-bold text-warning">
                    <Sparkles className="h-3 w-3" />
                    <span>{Number(gpa).toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-xl p-2 text-center shadow-sunken">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                    Attendance
                  </div>
                  <div className="mt-0.5 font-bold text-success">{attendance}%</div>
                </div>
              </div>
            </div>

            <div className={`mt-4 pt-3 ${SEAM_T} flex items-center justify-between gap-1`}>
              <button
                onClick={() => onViewDetails(student)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-fg hover:text-brand-600 dark:hover:text-brand-300 shadow-sunken transition cursor-pointer"
                title="View Full Profile Dossier"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Dossier</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(student)}
                  className="rounded-lg p-1.5 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                  title="Edit Student"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onToggleStatus(student)}
                  className={`rounded-lg p-1.5 transition cursor-pointer ${
                    student.status === 'active'
                      ? 'text-fg-muted hover:text-warning hover:shadow-sunken'
                      : 'text-fg-muted hover:text-success hover:shadow-sunken'
                  }`}
                  title={student.status === 'active' ? 'Deactivate Student' : 'Activate Student'}
                >
                  {student.status === 'active' ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onDelete(student)}
                  className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                  title="Delete Student"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}