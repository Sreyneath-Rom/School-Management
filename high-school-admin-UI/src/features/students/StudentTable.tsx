// src/features/students/StudentTable.tsx
import React, { useState } from 'react'
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type { StudentUser } from '@/types/user'

interface StudentTableProps {
  students: StudentUser[]
  isLoading?: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onViewDetails: (student: StudentUser) => void
  onEdit: (student: StudentUser) => void
  onDelete: (student: StudentUser) => void
  onToggleStatus: (student: StudentUser) => void
}

type SortField = 'name' | 'grade' | 'gpa' | 'attendance'
type SortOrder = 'asc' | 'desc'

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    let result = 0
    if (sortField === 'name') {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
      result = nameA.localeCompare(nameB)
    } else if (sortField === 'grade') {
      result = (a.grade || '').localeCompare(b.grade || '')
    } else if (sortField === 'gpa') {
      const gpaA = (a as any).gpa || 3.5
      const gpaB = (b as any).gpa || 3.5
      result = gpaA - gpaB
    } else if (sortField === 'attendance') {
      const attA = (a as any).attendanceRate || 95
      const attB = (b as any).attendanceRate || 95
      result = attA - attB
    }
    return sortOrder === 'asc' ? result : -result
  })

  const isAllSelected =
    students.length > 0 && students.every((s) => selectedIds.includes(s.id))
  const isIndeterminate =
    selectedIds.length > 0 && !isAllSelected

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-stone-200 dark:bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-stone-200 dark:bg-white/10" />
                <div className="h-3 w-32 rounded bg-stone-200 dark:bg-white/10" />
              </div>
              <div className="h-6 w-20 rounded bg-stone-200 dark:bg-white/10" />
              <div className="h-6 w-16 rounded bg-stone-200 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 dark:border-white/15 bg-white/50 dark:bg-stone-900/40 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-white/10 text-stone-400">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-stone-900 dark:text-white">No Students Found</h3>
        <p className="mt-1 max-w-sm text-xs text-stone-500">
          No student records match your active search and filter criteria. Try clearing or adjusting filters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-stone-200/80 dark:border-white/10 bg-stone-100/70 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            <tr>
              <th scope="col" className="w-10 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={onToggleSelectAll}
                  aria-label="Select all students"
                  className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center gap-1.5 font-bold hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                >
                  Student & Roster ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('grade')}
                  className="inline-flex items-center gap-1.5 font-bold hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                >
                  Grade & Section
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                Parent / Guardian
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('attendance')}
                  className="inline-flex items-center gap-1.5 font-bold hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                >
                  Attendance
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('gpa')}
                  className="inline-flex items-center gap-1.5 font-bold hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                >
                  GPA Score
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/60 dark:divide-white/5">
            {sortedStudents.map((student) => {
              const isSelected = selectedIds.includes(student.id)
              const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
              const attendance = (student as any).attendanceRate || 95
              const gpa = (student as any).gpa || 3.82
              const parentName = student.fatherName || student.motherName || student.guardianName || 'Not Listed'
              const parentPhone = student.parentPhone || student.phone || '—'

              return (
                <tr
                  key={student.id}
                  id={`student-row-${student.id}`}
                  className={`group transition hover:bg-stone-50/80 dark:hover:bg-white/5 ${
                    isSelected ? 'bg-brand-500/10 dark:bg-brand-500/15' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      aria-label={`Select student ${student.firstName} ${student.lastName}`}
                      className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </td>

                  {/* Student Info */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 font-bold text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </span>
                          {(student.role as string) === 'mazer' && (
                            <span className="rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Mazer Prefect
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="font-mono font-medium text-brand-700 dark:text-brand-300">
                            {student.studentId || student.id}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[160px]">{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Grade & Class */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-lg border border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-white/5 px-2.5 py-1 font-semibold text-stone-800 dark:text-stone-200">
                      {student.grade} - {student.class}
                    </span>
                    <div className="mt-1 text-[10px] text-stone-400">
                      AY {student.academicYear || '2025–2026'}
                    </div>
                  </td>

                  {/* Parent / Guardian */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-stone-800 dark:text-stone-200">{parentName}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                      <Phone className="h-3 w-3 text-stone-400" />
                      <span className="font-mono">{parentPhone}</span>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            attendance >= 90
                              ? 'bg-emerald-500'
                              : attendance >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${attendance}%` }}
                        />
                      </div>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{attendance}%</span>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="px-4 py-3.5">
                    <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      <Sparkles className="h-3 w-3" />
                      <span>{Number(gpa).toFixed(2)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
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
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details / Dossier */}
                      <button
                        id={`btn-view-student-${student.id}`}
                        onClick={() => onViewDetails(student)}
                        className="rounded-lg p-1.5 text-stone-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 transition"
                        title="View Full Profile Dossier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        id={`btn-edit-student-${student.id}`}
                        onClick={() => onEdit(student)}
                        className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-white/10 dark:hover:text-white transition"
                        title="Edit Student Information"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Toggle Status */}
                      <button
                        id={`btn-status-student-${student.id}`}
                        onClick={() => onToggleStatus(student)}
                        className={`rounded-lg p-1.5 transition ${
                          student.status === 'active'
                            ? 'text-stone-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30'
                            : 'text-stone-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30'
                        }`}
                        title={student.status === 'active' ? 'Deactivate Student' : 'Activate Student'}
                      >
                        {student.status === 'active' ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        id={`btn-delete-student-${student.id}`}
                        onClick={() => onDelete(student)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition"
                        title="Remove Student Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Summary */}
      <div className="flex items-center justify-between border-t border-stone-200/80 dark:border-white/10 bg-stone-50/70 dark:bg-white/5 px-4 py-3 text-xs text-stone-500 dark:text-stone-400">
        <span>
          Showing <strong>{sortedStudents.length}</strong> of <strong>{students.length}</strong> students
        </span>
        <span className="text-[11px]">Click column headers to sort</span>
      </div>
    </div>
  )
}
