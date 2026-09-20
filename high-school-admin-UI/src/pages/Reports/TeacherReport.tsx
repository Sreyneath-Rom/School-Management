// src/pages/Reports/TeacherReport.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Search,
  Download,
  Printer,
  RefreshCw,
  Info,
  Users,
  BookOpen,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { teacherService, type TeacherRecord } from '@/services/teacherService'
import { classService, type ClassRecord } from '@/services/classService'

// STRIPPED: `TeacherProfileView` has no `name`, `employeeId`, `department`.
// Only `id`, `firstName`, `lastName`, `email`, `avatarUrl` are guaranteed.

interface TeacherRow {
  id: string
  name: string
  email: string
  classCount: number
}

type ClassWithMeta = ClassRecord & {
  homeroomTeacherId?: string
  homeroomTeacher?: { id?: string }
}

function displayName(t: TeacherRecord): string {
  const composed = `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()
  return composed || t.email || t.id
}

export default function TeacherReport() {
  const { showToast } = useToast()

  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [teacherList, classList] = await Promise.all([
        teacherService.list({ limit: 500 }),
        classService.list().catch(() => []),
      ])
      const classes = (Array.isArray(classList) ? classList : []) as ClassWithMeta[]
      const rows: TeacherRow[] = (Array.isArray(teacherList) ? teacherList : []).map(
        (t) => ({
          id: t.id,
          name: displayName(t),
          email: t.email ?? '',
          classCount: classes.filter(
            (c) => (c.homeroomTeacherId ?? c.homeroomTeacher?.id) === t.id
          ).length,
        })
      )
      setTeachers(rows)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(
    () =>
      teachers.filter((t) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
        )
      }),
    [teachers, search]
  )

  const stats = useMemo(() => {
    const total = filtered.length
    const avgClasses =
      total > 0
        ? filtered.reduce((sum, t) => sum + t.classCount, 0) / total
        : 0
    return { total, avgClasses }
  }, [filtered])

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      showToast('Nothing to export', 'info')
      return
    }
    const headers = ['Name', 'Email', 'Classes Led']
    const data = filtered.map((t) => [`"${t.name}"`, t.email, t.classCount])
    const csv = [headers.join(','), ...data.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Teacher_Report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Report exported', 'success')
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Teacher Report"
          subtitle="Faculty roster with class assignments."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-medium hover:bg-surface-strong disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-medium hover:bg-surface-strong"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          Workload and outcome metrics are not computed — the backend doesn't
          return them. This report shows class assignment counts only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-surface bg-surface shadow-sm">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-600" />
            Faculty Count
          </span>
          <div className="text-3xl font-extrabold text-color mt-2">{stats.total}</div>
        </div>
        <div className="p-5 rounded-2xl border border-surface bg-surface shadow-sm">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-600" />
            Avg Classes Led
          </span>
          <div className="text-3xl font-extrabold text-color mt-2">
            {stats.avgClasses.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-surface bg-surface text-color"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading faculty...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load faculty</p>
            <p className="mt-1 text-xs text-secondary">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-secondary text-sm">
            {teachers.length === 0 ? 'No teachers in the roster.' : 'No matches.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong text-secondary font-semibold border-b border-surface">
                <tr>
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3 text-center">Classes Led</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-medium text-color">{t.name}</td>
                    <td className="py-3 px-3 text-secondary text-[11px]">{t.email || '—'}</td>
                    <td className="py-3 px-3 text-center font-mono">{t.classCount}</td>
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