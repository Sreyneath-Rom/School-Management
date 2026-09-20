// src/pages/Teachers/TeacherProfiles.tsx
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  Mail,
  CheckCircle2,
  Printer,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  RefreshCw,
  Info,
} from 'lucide-react'
import { teacherService, type TeacherRecord } from '@/services/teacherService'

// STRIPPED: TeacherProfileView does not expose department, employeeId,
// status, position, qualifications, specialization, weeklyTeachingHours,
// assignedClasses, subjectsTaught, performanceRating, joiningDate, phone.
// Only id, firstName, lastName, email, avatarUrl, teacherCode are used.

function initials(first?: string, last?: string): string {
  const a = (first ?? '').charAt(0)
  const b = (last ?? '').charAt(0)
  return (a + b).toUpperCase() || 'FC'
}

function displayName(t: TeacherRecord): string {
  const composed = `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()
  return composed || t.email || t.id
}

function Field({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex justify-between py-2 border-b border-surface last:border-0">
      <span className="text-secondary">{label}:</span>
      <span className="font-medium text-color text-right max-w-xs truncate">
        {value === undefined || value === null || value === '' ? '—' : value}
      </span>
    </div>
  )
}

export default function TeacherProfiles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [faculty, setFaculty] = useState<TeacherRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await teacherService.list()
      setFaculty(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setFaculty([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const urlId = searchParams.get('id')
  const selectedId =
    urlId && faculty.some((f) => f.id === urlId) ? urlId : faculty[0]?.id ?? ''
  const currentIndex = faculty.findIndex((f) => f.id === selectedId)
  const teacher = faculty[currentIndex >= 0 ? currentIndex : 0]

  const handleSelect = (id: string) => setSearchParams({ id })
  const handlePrev = () => currentIndex > 0 && handleSelect(faculty[currentIndex - 1].id)
  const handleNext = () =>
    currentIndex < faculty.length - 1 && handleSelect(faculty[currentIndex + 1].id)

  if (loading) {
    return (
      <div className="py-16 text-center text-secondary text-sm">
        <RefreshCw size={16} className="inline animate-spin mr-2" />
        Loading faculty...
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
        <GraduationCap className="mx-auto mb-3 h-10 w-10 text-secondary" />
        <p className="text-sm font-semibold text-color">
          {error ? "Couldn't load faculty" : 'No faculty in the roster'}
        </p>
        <p className="text-xs text-secondary mt-1">
          {error ? error.message : 'Add a teacher to get started.'}
        </p>
      </div>
    )
  }

  const name = displayName(teacher)
  const inits = initials(teacher.firstName, teacher.lastName)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Profiles"
          subtitle="Faculty directory."
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-surface bg-surface p-0.5">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-lg text-secondary hover:text-color disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= faculty.length - 1}
              className="p-1.5 rounded-lg text-secondary hover:text-color disabled:opacity-30 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <select
            value={teacher.id}
            onChange={(e) => handleSelect(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {displayName(f)}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border border-surface bg-surface text-color text-xs font-semibold hover:bg-surface-strong transition"
          >
            <Printer className="h-3.5 w-3.5 text-secondary" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-surface bg-surface/40 backdrop-blur-md p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative shrink-0">
            {teacher.avatarUrl ? (
              <img
                src={teacher.avatarUrl}
                alt={name}
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 text-3xl font-black text-brand-700 dark:text-brand-300 ring-4 ring-brand-500/20">
                {inits}
              </div>
            )}
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-success">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-color">{name}</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-secondary">
              <a
                href={`mailto:${teacher.email}`}
                className="flex items-center gap-1.5 hover:text-brand-600 transition"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{teacher.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-surface bg-surface p-5 space-y-3 shadow-xs text-xs">
        <h3 className="font-bold text-sm text-color">Employment</h3>
        <Field label="Teacher ID" value={teacher.id} />
        <Field label="First name" value={teacher.firstName} />
        <Field label="Last name" value={teacher.lastName} />
        <Field label="Email" value={teacher.email} />
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          Department, employee ID, workload, and evaluation panels require fields
          on <code className="font-mono">TeacherProfileView</code> that aren't
          currently exposed. Paste <code className="font-mono">src/types/teacherProfile.ts</code> to restore them.
        </p>
      </div>
    </div>
  )
}