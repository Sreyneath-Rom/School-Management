// src/pages/Students/StudentProfiles.tsx
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  User,
  Mail,
  CheckCircle2,
  Printer,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CreditCard,
  Clock,
  BookOpen,
  RefreshCw,
  Info,
} from 'lucide-react'
import { studentService } from '@/services/studentService'
import type { StudentProfileView } from '@/types/studentProfile'

// STRIPPED: StudentProfileView does not expose name, profilePhoto, status,
// address, enrollmentDate, guardianName, relationship, parentPhone,
// parentEmail, nationality, grade. Uses firstName, lastName, email,
// studentCode, className, dateOfBirth, gender, enrolledAt.

type Tab = 'overview' | 'academic' | 'attendance' | 'finance'

function initials(first?: string, last?: string): string {
  const a = (first ?? '').charAt(0)
  const b = (last ?? '').charAt(0)
  return (a + b).toUpperCase() || 'ST'
}

function displayName(s: StudentProfileView): string {
  const composed = `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim()
  return composed || s.studentCode || s.id
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

function NotImplemented({ label, endpoint }: { label: string; endpoint: string }) {
  return (
    <div className="rounded-2xl border border-info/30 bg-info/5 p-8 text-center">
      <Info className="mx-auto mb-3 h-8 w-8 text-info" />
      <p className="text-sm font-semibold text-color">{label}</p>
      <p className="text-xs text-secondary mt-1 max-w-md mx-auto">
        Requires the <code className="font-mono">{endpoint}</code> endpoint.
      </p>
    </div>
  )
}

export default function StudentProfiles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [students, setStudents] = useState<StudentProfileView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await studentService.list()
      setStudents(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const urlId = searchParams.get('id')
  const selectedId =
    urlId && students.some((s) => s.id === urlId) ? urlId : students[0]?.id ?? ''
  const currentIndex = students.findIndex((s) => s.id === selectedId)
  const student = students[currentIndex >= 0 ? currentIndex : 0]

  const handleSelect = (id: string) => setSearchParams({ id })
  const handlePrev = () => currentIndex > 0 && handleSelect(students[currentIndex - 1].id)
  const handleNext = () =>
    currentIndex < students.length - 1 && handleSelect(students[currentIndex + 1].id)

  if (loading) {
    return (
      <div className="py-16 text-center text-secondary text-sm">
        <RefreshCw size={16} className="inline animate-spin mr-2" />
        Loading students...
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
        <GraduationCap className="mx-auto mb-3 h-10 w-10 text-secondary" />
        <p className="text-sm font-semibold text-color">
          {error ? "Couldn't load students" : 'No students in the roster'}
        </p>
        <p className="text-xs text-secondary mt-1">
          {error ? error.message : 'Enroll a student to get started.'}
        </p>
      </div>
    )
  }

  const name = displayName(student)
  const inits = initials(student.firstName, student.lastName)

  const tabs: Array<{ key: Tab; icon: typeof User; label: string }> = [
    { key: 'overview', icon: User, label: 'General' },
    { key: 'academic', icon: BookOpen, label: 'Academic' },
    { key: 'attendance', icon: Clock, label: 'Attendance' },
    { key: 'finance', icon: CreditCard, label: 'Finance' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading title="Student Profiles" subtitle="Roster with general information." />

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
              disabled={currentIndex >= students.length - 1}
              className="p-1.5 rounded-lg text-secondary hover:text-color disabled:opacity-30 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <select
            value={student.id}
            onChange={(e) => handleSelect(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {displayName(s)}
                {s.className ? ` (${s.className})` : ''}
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
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 text-3xl font-black text-brand-700 dark:text-brand-300 ring-4 ring-brand-500/20">
              {inits}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-success">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-color">{name}</h2>
              {student.className && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {student.className}
                </span>
              )}
              {student.studentCode && (
                <span className="font-mono text-xs font-semibold text-secondary bg-surface-strong px-2 py-1 rounded-lg">
                  {student.studentCode}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-secondary">
              {student.email && (
                <a
                  href={`mailto:${student.email}`}
                  className="flex items-center gap-1.5 hover:text-brand-600 transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{student.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-surface pb-2 overflow-x-auto text-xs font-bold">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
              activeTab === key
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-secondary hover:bg-surface'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="rounded-2xl border border-surface bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-color">Student Details</h3>
            <Field label="Student ID" value={student.studentCode ?? student.id} />
            <Field label="First name" value={student.firstName} />
            <Field label="Last name" value={student.lastName} />
            <Field label="Class" value={student.className} />
            <Field label="Date of birth" value={student.dateOfBirth} />
            <Field label="Gender" value={student.gender} />
            <Field label="Enrolled" value={student.enrolledAt} />
          </div>

          <div className="rounded-2xl border border-surface bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-color">Contact</h3>
            <Field label="Email" value={student.email} />
            <div className="rounded-2xl border border-info/30 bg-info/5 p-3 flex items-start gap-3 mt-3">
              <Info size={14} className="text-info shrink-0 mt-0.5" />
              <p className="text-secondary text-[11px]">
                Guardian contact, address, and photo require additional fields on{' '}
                <code className="font-mono">StudentProfileView</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <NotImplemented label="Academic performance panel" endpoint="/students/:id/grades" />
      )}
      {activeTab === 'attendance' && (
        <NotImplemented label="Attendance matrix panel" endpoint="/students/:id/attendance" />
      )}
      {activeTab === 'finance' && (
        <NotImplemented label="Tuition & finance panel" endpoint="/students/:id/invoices" />
      )}
    </div>
  )
}