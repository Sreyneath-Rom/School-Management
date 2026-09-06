// src/features/students/StudentCardGrid.tsx
import React from 'react'
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
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
        const gpa = (student as any).gpa || 3.82
        const parentName = student.fatherName || student.motherName || student.guardianName || 'Guardian'
        const parentPhone = student.parentPhone || student.phone || '—'

        return (
          <div
            key={student.id}
            id={`student-card-${student.id}`}
            className={`group relative flex flex-col justify-between rounded-2xl border bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 shadow-xs transition hover:shadow-md ${
              isSelected
                ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                : 'border-stone-200/80 dark:border-white/10 hover:border-brand-500/40'
            }`}
          >
            {/* Top Selection & Status */}
            <div>
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(student.id)}
                  aria-label={`Select student ${student.firstName} ${student.lastName}`}
                  className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
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

              {/* Student Header */}
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 font-bold text-lg text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20 shadow-xs">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-stone-900 dark:text-white text-sm">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">
                    {student.studentId || student.id}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-stone-200 dark:border-white/10 bg-stone-100/80 dark:bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-stone-800 dark:text-stone-200">
                      {student.grade} • {student.class}
                    </span>
                    {(student.role as string) === 'mazer' && (
                      <span className="rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        Mazer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="mt-3 space-y-1 rounded-xl bg-stone-50/80 dark:bg-white/5 p-2.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Guardian:</span>
                  <span className="font-semibold truncate max-w-[130px]">{parentName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3 text-stone-400" />
                    {parentPhone}
                  </span>
                </div>
              </div>

              {/* Micro-Metrics Bar (GPA & Attendance) */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-stone-200/60 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 p-2 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">GPA Score</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>{Number(gpa).toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200/60 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 p-2 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Attendance</div>
                  <div className="mt-0.5 font-bold text-emerald-700 dark:text-emerald-400">
                    {attendance}%
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-white/5 flex items-center justify-between gap-1">
              <button
                onClick={() => onViewDetails(student)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 transition cursor-pointer"
                title="View Full Profile Dossier"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Dossier</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(student)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10 dark:hover:text-white transition"
                  title="Edit Student"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onToggleStatus(student)}
                  className={`rounded-lg p-1.5 transition ${
                    student.status === 'active'
                      ? 'text-stone-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30'
                      : 'text-stone-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30'
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
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition"
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
