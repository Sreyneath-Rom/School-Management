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
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Profiles"
          subtitle="Faculty directory, credentials, and institutional assignments."
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-surface bg-surface p-1 shadow-2xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-lg text-secondary hover:text-color hover:bg-surface-strong disabled:opacity-30 transition cursor-pointer"
              title="Previous faculty member"
              aria-label="Previous faculty member"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-semibold text-secondary px-2">
              {currentIndex + 1} / {faculty.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex >= faculty.length - 1}
              className="p-1.5 rounded-lg text-secondary hover:text-color hover:bg-surface-strong disabled:opacity-30 transition cursor-pointer"
              title="Next faculty member"
              aria-label="Next faculty member"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <select
            value={teacher.id}
            onChange={(e) => handleSelect(e.target.value)}
            className="h-9.5 px-3 text-xs font-semibold rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1.5 focus:ring-brand-500 shadow-2xs"
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {displayName(f)}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="inline-flex h-9.5 items-center gap-1.5 px-3.5 rounded-xl border border-surface bg-surface text-color text-xs font-semibold hover:bg-surface-strong shadow-2xs transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-secondary" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-surface bg-surface/70 backdrop-blur-md p-6 sm:p-7 shadow-xs">
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            {teacher.avatarUrl ? (
              <img
                src={teacher.avatarUrl}
                alt={name}
                className="h-22 w-22 sm:h-24 sm:w-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            ) : (
              <div className="flex h-22 w-22 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 text-white text-2xl sm:text-3xl font-black shadow-lg shadow-brand-600/25 ring-4 ring-brand-500/15">
                {inits}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-emerald-500 shadow-xs"
              title="Active Faculty"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-color">{name}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                <GraduationCap className="h-3.5 w-3.5" />
                Faculty
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-secondary">
              <a
                href={`mailto:${teacher.email}`}
                className="flex items-center gap-1.5 text-secondary hover:text-brand-600 transition"
              >
                <Mail className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                <span>{teacher.email}</span>
              </a>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                ID: {teacher.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="rounded-2xl border border-surface bg-surface/70 backdrop-blur-xs p-5 space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-color flex items-center gap-2">
            <GraduationCap size={16} className="text-brand-600 dark:text-brand-400" />
            Employment & Identity
          </h3>
          <div className="divide-y divide-surface">
            <Field label="Teacher ID" value={teacher.id} />
            <Field label="First name" value={teacher.firstName} />
            <Field label="Last name" value={teacher.lastName} />
            <Field label="Institutional email" value={teacher.email} />
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-surface/70 backdrop-blur-xs p-5 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-color flex items-center gap-2">
              <Mail size={16} className="text-brand-600 dark:text-brand-400" />
              Communication
            </h3>
            <div className="divide-y divide-surface">
              <Field label="Primary email" value={teacher.email} />
              <Field label="System UUID" value={teacher.id} />
            </div>
          </div>

          <div className="rounded-2xl border border-info/30 bg-info/5 p-3.5 flex items-start gap-3 mt-4">
            <Info size={15} className="text-info shrink-0 mt-0.5" />
            <p className="text-secondary text-[11px] leading-relaxed">
              Department, employee ID, workload, and evaluation panels require fields
              on <code className="font-mono text-color">TeacherProfileView</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}