// src/features/students/StudentTable.tsx
import React, { useState } from 'react'
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type { StudentUser } from '@/types/user'
import StatusBadge from '@/components/common/StatusBadge'

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
      <div className="overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-surface-base" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-surface-base" />
                <div className="h-3 w-32 rounded bg-surface-base" />
              </div>
              <div className="h-6 w-20 rounded bg-surface-base" />
              <div className="h-6 w-16 rounded bg-surface-base" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-card bg-surface-card p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-base text-text-main/40">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-text-main">No Students Found</h3>
        <p className="mt-1 max-w-sm text-xs text-text-main/55">
          No student records match your active search and filter criteria. Try clearing some filters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-card/60 bg-surface-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-text-main">
          <thead className="border-b border-border-card/60 bg-surface-base/80 text-[11px] font-semibold uppercase tracking-wider text-text-main/60">
            <tr>
              <th scope="col" className="w-10 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-border-card text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center gap-1.5 font-semibold text-text-main/70 hover:text-text-main"
                >
                  Student Name & ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('grade')}
                  className="inline-flex items-center gap-1.5 font-semibold text-text-main/70 hover:text-text-main"
                >
                  Grade & Class
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                Parent / Guardian
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('attendance')}
                  className="inline-flex items-center gap-1.5 font-semibold text-text-main/70 hover:text-text-main"
                >
                  Attendance
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => handleSort('gpa')}
                  className="inline-flex items-center gap-1.5 font-semibold text-text-main/70 hover:text-text-main"
                >
                  GPA
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
          <tbody className="divide-y divide-border-card/40">
            {sortedStudents.map((student) => {
              const isSelected = selectedIds.includes(student.id)
              const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST'
              const attendance = (student as any).attendanceRate || 95
              const gpa = (student as any).gpa || 3.8
              const parentName = student.fatherName || student.motherName || student.guardianName || 'Not Listed'
              const parentPhone = student.parentPhone || student.phone || '—'

              return (
                <tr
                  key={student.id}
                  id={`student-row-${student.id}`}
                  className={`group transition hover:bg-surface-base/50 ${
                    isSelected ? 'bg-brand-500/5' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      className="h-4 w-4 rounded border-border-card text-brand-600 focus:ring-brand-500"
                    />
                  </td>

                  {/* Student Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 font-bold text-brand-600 dark:text-brand-400">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>
                            {student.firstName} {student.lastName}
                          </span>
                          {(student.role as string) === 'mazer' && (
                            <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                              Mazer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-text-main/50">
                          <span className="font-mono">{student.studentId || student.id}</span>
                          <span>•</span>
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Grade & Class */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-lg border border-border-card bg-surface-base px-2 py-0.5 font-medium text-text-main">
                      {student.grade} - {student.class}
                    </span>
                    <div className="mt-0.5 text-[10px] text-text-main/50">
                      AY {student.academicYear || '2025-2026'}
                    </div>
                  </td>

                  {/* Parent / Guardian */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-text-main">{parentName}</div>
                    <div className="flex items-center gap-1 text-[11px] text-text-main/50">
                      <Phone className="h-3 w-3" />
                      <span>{parentPhone}</span>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-base">
                        <div
                          className={`h-full rounded-full ${
                            attendance >= 90
                              ? 'bg-emerald-500'
                              : attendance >= 75
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${attendance}%` }}
                        />
                      </div>
                      <span className="font-medium">{attendance}%</span>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-3 w-3" />
                      {Number(gpa).toFixed(2)}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
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
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details */}
                      <button
                        id={`btn-view-student-${student.id}`}
                        onClick={() => onViewDetails(student)}
                        className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-brand-600"
                        title="View Full Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        id={`btn-edit-student-${student.id}`}
                        onClick={() => onEdit(student)}
                        className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-surface-base hover:text-blue-600"
                        title="Edit Student"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Toggle Status */}
                      <button
                        id={`btn-status-student-${student.id}`}
                        onClick={() => onToggleStatus(student)}
                        className={`rounded-lg p-1.5 transition ${
                          student.status === 'active'
                            ? 'text-text-main/50 hover:bg-surface-base hover:text-amber-600'
                            : 'text-text-main/50 hover:bg-surface-base hover:text-emerald-600'
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
                        className="rounded-lg p-1.5 text-text-main/50 transition hover:bg-red-500/10 hover:text-red-600"
                        title="Delete Student"
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
      <div className="flex items-center justify-between border-t border-border-card/60 bg-surface-base/50 px-4 py-3 text-xs text-text-main/60">
        <span>
          Showing <strong>{sortedStudents.length}</strong> of <strong>{students.length}</strong> students
        </span>
        <span className="text-[11px]">Click column headers to sort</span>
      </div>
    </div>
  )
}
