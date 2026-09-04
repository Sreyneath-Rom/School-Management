// src/features/students/StudentCardGrid.tsx
import React from 'react'
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
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

export const StudentCardGrid: React.FC<StudentCardGridProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((student) => {
        const isSelected = selectedIds.includes(student.id)
        const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
        const attendance = (student as any).attendanceRate || 95
        const gpa = (student as any).gpa || 3.8
        const parentName = student.fatherName || student.motherName || student.guardianName || 'Parent'
        const parentPhone = student.parentPhone || student.phone || '—'

        return (
          <div
            key={student.id}
            id={`student-card-${student.id}`}
            className={`group relative flex flex-col justify-between rounded-2xl border bg-surface-card p-5 transition hover:shadow-md ${
              isSelected
                ? 'border-brand-500 bg-brand-500/5'
                : 'border-border-card/60 hover:border-brand-500/40'
            }`}
          >
            {/* Top Selection & Status */}
            <div>
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(student.id)}
                  className="h-4 w-4 rounded border-border-card text-brand-600 focus:ring-brand-500"
                />
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

              {/* Student Header */}
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-base font-bold text-brand-600 dark:text-brand-400">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="truncate font-semibold text-text-main text-sm">
                      {student.firstName} {student.lastName}
                    </h4>
                  </div>
                  <p className="font-mono text-xs text-text-main/50">
                    {student.studentId || student.id}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded-md border border-border-card bg-surface-base px-1.5 py-0.5 text-[10px] font-medium text-text-main">
                      {student.grade} - {student.class}
                    </span>
                    {(student.role as string) === 'mazer' && (
                      <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                        Mazer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic & Stats Indicators */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-surface-base/60 p-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-text-main/50">Attendance</span>
                  <div className="mt-0.5 flex items-center gap-1 font-semibold text-text-main">
                    <span>{attendance}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-text-main/50">GPA Standing</span>
                  <div className="mt-0.5 flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>{Number(gpa).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1.5 text-xs text-text-main/65">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-text-main/40" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-text-main/40" />
                  <span>{parentPhone} ({parentName})</span>
                </div>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border-card/40 pt-3">
              <button
                onClick={() => onViewDetails(student)}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition hover:underline dark:text-brand-400"
              >
                <Eye className="h-3.5 w-3.5" />
                View Profile
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(student)}
                  className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-blue-600"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onToggleStatus(student)}
                  className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-amber-600"
                  title="Toggle Status"
                >
                  {student.status === 'active' ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(student)}
                  className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-red-500/10 hover:text-red-600"
                  title="Delete"
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
