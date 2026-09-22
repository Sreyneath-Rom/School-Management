// src/features/students/StudentTable.tsx
import React, { useState } from 'react'
import {
  Eye, Edit2, Trash2, Phone, GraduationCap, Sparkles, ArrowUpDown,
  CheckCircle2, XCircle,
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

/* Neumorphic hairline seam. Matches the SEAM_T constant in StatsGrid
   and StudentCardGrid. The abbreviated `shadow-sunken` utility is a
   full 4px inset well, not a hairline, so this stays as an
   arbitrary-value form. */
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

export const StudentTable: React.FC<StudentTableProps> = ({
  students, isLoading, selectedIds, onToggleSelect, onToggleSelectAll,
  onViewDetails, onEdit, onDelete, onToggleStatus,
}) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('asc') }
  }

  const sortedStudents = [...students].sort((a, b) => {
    let result = 0
    if (sortField === 'name') {
      result = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
        .localeCompare(`${b.firstName || ''} ${b.lastName || ''}`.toLowerCase())
    } else if (sortField === 'grade') {
      result = (a.grade || '').localeCompare(b.grade || '')
    } else if (sortField === 'gpa') {
      result = ((a as any).gpa || 3.5) - ((b as any).gpa || 3.5)
    } else if (sortField === 'attendance') {
      result = ((a as any).attendanceRate || 95) - ((b as any).attendanceRate || 95)
    }
    return sortOrder === 'asc' ? result : -result
  })

  const isAllSelected = students.length > 0 && students.every((s) => selectedIds.includes(s.id))
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl glass-sm">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 skeleton rounded" />
                <div className="h-3 w-32 skeleton rounded" />
              </div>
              <div className="h-6 w-20 skeleton rounded" />
              <div className="h-6 w-16 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      // Raised `.glass` surface — matches the empty state in
      // StudentCardGrid and the card surface level used by StatsGrid.
      // The previous comment referenced a dashed border that was never
      // actually applied; removed so the code and comment agree.
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

  const sortableHeader = 'inline-flex items-center gap-1.5 font-bold hover:text-fg transition cursor-pointer'

  return (
    <div className="overflow-hidden rounded-2xl glass-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[11px] font-bold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <tr>
              <th scope="col" className="w-10 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => { if (input) input.indeterminate = isIndeterminate }}
                  onChange={onToggleSelectAll}
                  aria-label="Select all students"
                  className="h-4 w-4 rounded accent-brand-500 cursor-pointer"
                />
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button onClick={() => handleSort('name')} className={sortableHeader}>
                  Student & Roster ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button onClick={() => handleSort('grade')} className={sortableHeader}>
                  Grade & Section
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">Parent / Guardian</th>
              <th scope="col" className="px-4 py-3.5">
                <button onClick={() => handleSort('attendance')} className={sortableHeader}>
                  Attendance
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button onClick={() => handleSort('gpa')} className={sortableHeader}>
                  GPA Score
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
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
                  // Selected: pressed-in sunken well + brand ring, matching
                  // the selected-card treatment in StudentCardGrid.
                  // Hover: pressed-in sunken well (the row reads as "in
                  // focus" while you're scanning it). The distinction is
                  // the ring — selected has it, plain hover doesn't.
                  className={`group transition-shadow ${
                    isSelected
                      ? 'shadow-sunken ring-1 ring-brand-500/30'
                      : 'hover:shadow-sunken'
                  }`}
                >
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      aria-label={`Select student ${student.firstName} ${student.lastName}`}
                      className="h-4 w-4 rounded accent-brand-500 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar chip — matches StudentCardGrid's avatar:
                          sunken well, brand tint, matte `ring-surface`
                          gap. */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-brand-700 dark:text-brand-300 shadow-sunken ring-1 ring-surface">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-fg">
                            {student.firstName} {student.lastName}
                          </span>
                          {(student.role as string) === 'mazer' && (
                            <span className="rounded-md bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                              Mazer Prefect
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                          <span className="font-mono font-medium text-brand-700 dark:text-brand-300">
                            {student.studentId || student.id}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-40">{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 font-semibold text-fg shadow-sunken">
                      {student.grade} - {student.class}
                    </span>
                    <div className="mt-1 text-[10px] text-fg-muted">
                      AY {student.academicYear || '2025–2026'}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-fg">{parentName}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-fg-muted mt-0.5">
                      <Phone className="h-3 w-3 text-fg-muted/70" />
                      <span className="font-mono">{parentPhone}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {/* Progress track: sunken well, fill keeps the
                          threshold-based semantic color (matches
                          StudentStats and the KPI cards in StatsGrid) */}
                      <div className="h-2 w-16 overflow-hidden rounded-full shadow-sunken">
                        <div
                          className={`h-full rounded-full ${
                            attendance >= 90 ? 'bg-success' : attendance >= 75 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${attendance}%` }}
                        />
                      </div>
                      <span className="font-bold text-fg">{attendance}%</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {/* GPA chip keeps its amber accent, matching the
                        GPA tint in StudentStats and StudentCardGrid */}
                    <div className="inline-flex items-center gap-1 rounded-lg bg-warning/15 px-2 py-1 font-bold text-warning">
                      <Sparkles className="h-3 w-3" />
                      <span>{Number(gpa).toFixed(2)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
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
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        id={`btn-view-student-${student.id}`}
                        onClick={() => onViewDetails(student)}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-brand-600 dark:hover:text-brand-300 hover:shadow-sunken transition cursor-pointer"
                        title="View Full Profile Dossier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        id={`btn-edit-student-${student.id}`}
                        onClick={() => onEdit(student)}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                        title="Edit Student Information"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        id={`btn-status-student-${student.id}`}
                        onClick={() => onToggleStatus(student)}
                        className={`rounded-lg p-1.5 transition cursor-pointer ${
                          student.status === 'active'
                            ? 'text-fg-muted hover:text-warning hover:shadow-sunken'
                            : 'text-fg-muted hover:text-success hover:shadow-sunken'
                        }`}
                        title={student.status === 'active' ? 'Deactivate Student' : 'Activate Student'}
                      >
                        {student.status === 'active' ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        id={`btn-delete-student-${student.id}`}
                        onClick={() => onDelete(student)}
                        className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
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

      {/* Footer — shadow seam. Uses the SEAM_T constant. */}
      <div className={`flex items-center justify-between px-4 py-3 text-xs text-fg-muted ${SEAM_T}`}>
        <span>
          Showing <strong className="text-fg">{sortedStudents.length}</strong> of{' '}
          <strong className="text-fg">{students.length}</strong> students
        </span>
        <span className="text-[11px]">Click column headers to sort</span>
      </div>
    </div>
  )
}