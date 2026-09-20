// src/pages/Academic/Classes.tsx
import { useState, useMemo, useEffect, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  School,
  Plus,
  Search,
  Users,
  User,
  DoorOpen,
  BookOpen,
  CalendarDays,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  classService,
  type ClassRecord,
  type CreateClassPayload,
  type UpdateClassPayload,
} from '@/services/classService'

/**
 * Row shape the page renders. Built from `ClassRecord` — anything the
 * backend doesn't return is derived or shown as a dash, never fabricated.
 */
interface ClassRow {
  id: string
  name: string
  gradeLevel: string   // "Grade 10" for display
  section: string      // "A"
  room: string
  classTeacher: string
  studentCount: number
  maxCapacity: number
  subjectsCount: number
}

interface ClassFormState {
  name: string
  gradeLevel: string   // "Grade 10"
  section: string
  room: string
  classTeacher: string
  maxCapacity: number
}

const DEFAULT_FORM: ClassFormState = {
  name: '',
  gradeLevel: 'Grade 10',
  section: 'A',
  room: '',
  classTeacher: '',
  maxCapacity: 35,
}

function sectionFromName(name: string): string {
  // "Grade 10-A" → "A"
  const part = name.split('-').pop()?.trim()
  return part && part.length <= 3 ? part.toUpperCase() : 'A'
}

function teacherFullName(
  teacher: ClassRecord['homeroomTeacher'] | undefined
): string {
  const user = teacher?.user
  if (!user) return ''
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
}

function recordToRow(record: ClassRecord): ClassRow {
  return {
    id: record.id,
    name: record.name,
    gradeLevel: `Grade ${record.gradeLevel}`,
    section: sectionFromName(record.name),
    room: (record as ClassRecord & { room?: string }).room ?? '—',
    classTeacher: teacherFullName(record.homeroomTeacher) || 'Unassigned',
    studentCount: (record as ClassRecord & { studentCount?: number }).studentCount ?? 0,
    maxCapacity: (record as ClassRecord & { maxCapacity?: number }).maxCapacity ?? 0,
    subjectsCount:
      (record as ClassRecord & { subjectsCount?: number }).subjectsCount ?? 0,
  }
}

export default function Classes() {
  const { showToast } = useToast()

  const [rows, setRows] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  const [detailRow, setDetailRow] = useState<ClassRow | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<ClassRow | null>(null)
  const [formData, setFormData] = useState<ClassFormState>({ ...DEFAULT_FORM })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const records = await classService.list()
      setRows(Array.isArray(records) ? records.map(recordToRow) : [])
    } catch {
      showToast('Could not load classes', 'error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.classTeacher.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q)
      const matchesGrade = gradeFilter === 'All' || c.gradeLevel === gradeFilter
      return matchesSearch && matchesGrade
    })
  }, [rows, searchTerm, gradeFilter])

  const stats = useMemo(() => {
    const totalStudents = rows.reduce((sum, c) => sum + c.studentCount, 0)
    const totalCapacity = rows.reduce((sum, c) => sum + c.maxCapacity, 0)
    const fillRate =
      totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0
    return { total: rows.length, totalStudents, totalCapacity, fillRate }
  }, [rows])

  const kpiCards: StatCard[] = [
    { id: 'active-classes', label: 'Active Classes', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'sections', icon: 'School', tint: 'blue' },
    { id: 'enrolled-students', label: 'Enrolled Students', value: stats.totalStudents.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'enrolled', icon: 'Users', tint: 'green' },
    { id: 'desk-capacity', label: 'Total Desk Capacity', value: stats.totalCapacity.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'available seats', icon: 'DoorOpen', tint: 'amber' },
    { id: 'fill-rate', label: 'Average Fill Rate', value: `${stats.fillRate}%`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'capacity used', icon: 'GraduationCap', tint: 'violet' },
  ]

  const resetForm = () => {
    setFormData({ ...DEFAULT_FORM })
    setEditingId(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const handleOpenEdit = (row: ClassRow) => {
    setEditingId(row.id)
    setFormData({
      name: row.name,
      gradeLevel: row.gradeLevel,
      section: row.section,
      room: row.room === '—' ? '' : row.room,
      classTeacher: row.classTeacher === 'Unassigned' ? '' : row.classTeacher,
      maxCapacity: row.maxCapacity || 35,
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const section = formData.section.trim().toUpperCase()
    if (!section) {
      showToast('Section identifier is required', 'error')
      return
    }

    const gradeLevelNumber = Number(formData.gradeLevel.replace(/\D/g, '')) || 10
    const composedName =
      formData.name.trim() || `Grade ${gradeLevelNumber}-${section}`

    try {
      if (editingId) {
        const payload: UpdateClassPayload = {
          name: composedName,
          gradeLevel: gradeLevelNumber,
        }
        await classService.update(editingId, payload)
        showToast(`Class "${composedName}" updated`, 'success')
      } else {
        const payload: CreateClassPayload = {
          name: composedName,
          gradeLevel: gradeLevelNumber,
        }
        await classService.create(payload)
        showToast(`Class "${composedName}" created`, 'success')
      }
      setIsFormOpen(false)
      resetForm()
      await load()
    } catch {
      showToast('Could not save the class', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return

    if (deleteCandidate.studentCount > 0) {
      showToast(
        `Cannot delete "${deleteCandidate.name}" — ${deleteCandidate.studentCount} students enrolled. Reassign them first.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    try {
      await classService.delete(deleteCandidate.id)
      if (detailRow?.id === deleteCandidate.id) setDetailRow(null)
      showToast(`Class "${deleteCandidate.name}" deleted`, 'success')
      setDeleteCandidate(null)
      await load()
    } catch {
      showToast('Could not delete the class', 'error')
      setDeleteCandidate(null)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Classes & Sections"
          subtitle="Cohort sections, homeroom assignments, capacity, and course distribution"
        />

        <button
          id="btn-create-class"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition shrink-0"
        >
          <Plus size={16} />
          <span>Create Class</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-surface">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-secondary" />
          <input
            type="text"
            placeholder="Search class name, homeroom teacher, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface border border-surface focus:outline-none focus:ring-1 focus:ring-brand-500 text-color"
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-surface border border-surface focus:outline-none focus:ring-1 focus:ring-brand-500 text-color cursor-pointer w-full sm:w-44"
        >
          <option value="All">All Grade Levels</option>
          {[7, 8, 9, 10, 11, 12].map((g) => (
            <option key={g} value={`Grade ${g}`}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-secondary">
          Loading classes...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-sm rounded-2xl border border-surface p-12 text-center">
          <School className="mx-auto mb-3 h-12 w-12 text-secondary" />
          <h3 className="text-base font-semibold text-color">
            {rows.length === 0 ? 'No classes yet' : 'No matches'}
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-md mx-auto">
            {rows.length === 0
              ? 'Click "Create Class" to add the first section.'
              : 'Try a different search or grade filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => {
            const fillPct =
              cls.maxCapacity > 0
                ? Math.round((cls.studentCount / cls.maxCapacity) * 100)
                : 0

            return (
              <div
                key={cls.id}
                className="rounded-2xl p-5 glass-sm border border-surface flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <School size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-color">
                          {cls.name}
                        </h3>
                        <div className="text-xs text-secondary font-medium">
                          {cls.gradeLevel} • Section {cls.section}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 py-3 border-y border-surface text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <User size={13} /> Class Teacher:
                      </span>
                      <span className="font-semibold text-color">
                        {cls.classTeacher}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <DoorOpen size={13} /> Room:
                      </span>
                      <span className="font-medium text-color">{cls.room}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <BookOpen size={13} /> Subjects:
                      </span>
                      <span className="font-medium text-color">
                        {cls.subjectsCount}
                      </span>
                    </div>

                    {cls.maxCapacity > 0 && (
                      <div className="pt-1.5">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-secondary">Capacity</span>
                          <span className="font-bold text-color">
                            {cls.studentCount} / {cls.maxCapacity} ({fillPct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fillPct > 90
                                ? 'bg-warning'
                                : fillPct > 75
                                  ? 'bg-brand-500'
                                  : 'bg-success'
                            }`}
                            style={{ width: `${Math.min(fillPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDetailRow(cls)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-surface hover:bg-brand-500/10 hover:text-brand-600 text-color transition flex items-center gap-1"
                    >
                      <Eye size={13} /> Details
                    </button>
                    <Link
                      to="/academic/schedules"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-surface hover:bg-brand-500 hover:text-white text-color transition flex items-center gap-1"
                    >
                      <CalendarDays size={13} /> Timetable
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(cls)}
                      className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <School size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-color">{detailRow.name}</h3>
                  <p className="text-xs text-secondary">
                    {detailRow.gradeLevel} • Section {detailRow.section}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailRow(null)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary flex items-center gap-1">
                  <User size={12} /> Homeroom
                </span>
                <span className="font-semibold text-color">
                  {detailRow.classTeacher}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary flex items-center gap-1">
                  <DoorOpen size={12} /> Room
                </span>
                <span className="font-semibold text-color">{detailRow.room}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary flex items-center gap-1">
                  <BookOpen size={12} /> Subjects
                </span>
                <span className="font-semibold text-color">
                  {detailRow.subjectsCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary flex items-center gap-1">
                  <Users size={12} /> Enrollment
                </span>
                <span className="font-semibold text-color">
                  {detailRow.studentCount} / {detailRow.maxCapacity || '—'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface">
              <button
                onClick={() => {
                  const r = detailRow
                  setDetailRow(null)
                  handleOpenEdit(r)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
              >
                Edit
              </button>
              <button
                onClick={() => setDetailRow(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface">
              <h3 className="text-base font-bold text-color">
                {editingId ? 'Edit Class' : 'Create Class'}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false)
                  resetForm()
                }}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Class Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10-A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    Grade Level
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, gradeLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {[7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Grade ${g}`}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    Section *
                  </label>
                  <input
                    type="text"
                    placeholder="A, B, C"
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCapacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
                >
                  {editingId ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-error">
              <div className="p-3 rounded-xl bg-error/10 border border-error/30">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-color">Delete Class</h3>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Permanently delete{' '}
              <span className="font-bold text-color">
                "{deleteCandidate.name}"
              </span>
              ?
            </p>

            {deleteCandidate.studentCount > 0 && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning">
                This class has {deleteCandidate.studentCount} enrolled students.
                Deletion will be blocked until they are reassigned.
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error hover:opacity-90 text-white transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}