// src/pages/Teachers/TeacherAssignments.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import { Users, BookOpen, Search, RefreshCw, Info, Building2 } from 'lucide-react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { teacherService, type TeacherRecord } from '@/services/teacherService'
import { classService, type ClassRecord } from '@/services/classService'

// Rows are derived from homeroom class relationships only.
// Subject-level allocations require a dedicated endpoint.

interface AssignmentRow {
  id: string
  teacherId: string
  teacherName: string
  teacherEmail: string
  className: string
  gradeLevel: string
  studentCount: number
}

type ClassWithMeta = ClassRecord & {
  gradeLevel?: number | string
  studentCount?: number
  homeroomTeacherId?: string
  homeroomTeacher?: { id?: string; user?: { firstName?: string; lastName?: string } }
}

function teacherDisplayName(t: TeacherRecord): string {
  const composed = `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()
  return composed || t.email || t.id
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function deriveAssignments(
  teachers: TeacherRecord[],
  classes: ClassWithMeta[]
): AssignmentRow[] {
  const byId = new Map<string, TeacherRecord>()
  for (const t of teachers) byId.set(t.id, t)

  const rows: AssignmentRow[] = []
  for (const cls of classes) {
    const teacherId = cls.homeroomTeacherId ?? cls.homeroomTeacher?.id
    if (!teacherId) continue
    const teacher = byId.get(teacherId)
    if (!teacher) continue

    const gradeLevel =
      typeof cls.gradeLevel === 'number'
        ? `Grade ${cls.gradeLevel}`
        : String(cls.gradeLevel ?? '')

    rows.push({
      id: `${teacher.id}-${cls.id}`,
      teacherId: teacher.id,
      teacherName: teacherDisplayName(teacher),
      teacherEmail: teacher.email ?? '',
      className: cls.name,
      gradeLevel: gradeLevel || '—',
      studentCount: cls.studentCount ?? 0,
    })
  }
  return rows.sort(
    (a, b) =>
      a.teacherName.localeCompare(b.teacherName) ||
      a.className.localeCompare(b.className)
  )
}

export default function TeacherAssignments() {
  const [rows, setRows] = useState<AssignmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [teachers, classes] = await Promise.all([
        teacherService.list(),
        classService.list() as Promise<ClassWithMeta[]>,
      ])
      setRows(
        deriveAssignments(
          Array.isArray(teachers) ? teachers : [],
          Array.isArray(classes) ? classes : []
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        r.teacherName.toLowerCase().includes(q) ||
        r.className.toLowerCase().includes(q) ||
        r.teacherEmail.toLowerCase().includes(q)
      )
    })
  }, [rows, search])

  const stats = useMemo(() => {
    const uniqueTeachers = new Set(rows.map((r) => r.teacherId)).size
    const totalStudents = rows.reduce((sum, r) => sum + r.studentCount, 0)
    return { total: rows.length, uniqueTeachers, totalStudents }
  }, [rows])

  const kpiCards: StatCard[] = [
    { id: 'assigned-faculty', label: 'Assigned Faculty', value: String(stats.uniqueTeachers), delta: '-', deltaDirection: 'neutral', deltaLabel: 'with homeroom', icon: 'Users', tint: 'blue' },
    { id: 'allocations', label: 'Assignments', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'teacher × class', icon: 'BookOpen', tint: 'violet' },
    { id: 'students-covered', label: 'Students Covered', value: stats.totalStudents.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'in assigned classes', icon: 'Users', tint: 'green' },
    { id: 'unassigned', label: 'Unassigned', value: '0', delta: '-', deltaDirection: 'neutral', deltaLabel: 'needs coverage', icon: 'Building2', tint: 'amber' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Assignments"
          subtitle="Homeroom faculty allocated to each class section."
        />
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          Assignments are derived from each class's homeroom teacher. Subject-level
          allocations require a dedicated endpoint.
        </p>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-fg-muted" />
          <input
            type="text"
            placeholder="Search by teacher, class, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="rounded-2xl glass-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading assignments...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load assignments</p>
            <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            {rows.length === 0
              ? 'No homeroom teachers assigned yet.'
              : 'No assignments match the filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted theme-divider">
                <tr>
                  <th className="py-3.5 px-4">Faculty</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4 text-center">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark) text-xs text-fg">
                {filtered.map((row) => (
                  <tr key={row.id} className="transition-shadow hover:shadow-sunken">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white bg-linear-to-tr from-brand-600 to-brand-400 shrink-0">
                          {initials(row.teacherName)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-fg truncate">{row.teacherName}</div>
                          <div className="text-[11px] text-fg-muted truncate">{row.teacherEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-fg">{row.className}</div>
                      <div className="text-[11px] text-fg-muted">{row.gradeLevel}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">
                      {row.studentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}