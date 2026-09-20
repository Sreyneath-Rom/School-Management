// src/pages/Exams/ExamForm.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Loader2,
  Info,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { examService, type ExamRecord } from '@/services/examService'

interface FormState {
  title: string
  academicYear: string
  term: string
  startDate: string
  endDate: string
  status: ExamRecord['status']
}

const EMPTY_FORM: FormState = {
  title: '',
  academicYear: new Date().getFullYear() + '–' + (new Date().getFullYear() + 1),
  term: '',
  startDate: '',
  endDate: '',
  status: 'UPCOMING',
}

export default function ExamForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const exam = await examService.getById(id)
        if (cancelled) return
        setForm({
          title: exam.title,
          academicYear: exam.academicYear,
          term: exam.term,
          startDate: exam.startDate.slice(0, 10),
          endDate: exam.endDate.slice(0, 10),
          status: exam.status,
        })
      } catch {
        if (!cancelled) {
          showToast('Unable to load exam', 'error')
          navigate('/academic/exams')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate, showToast])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.term.trim() || !form.startDate || !form.endDate) {
      showToast('Title, term, and both dates are required', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        academicYear: form.academicYear.trim(),
        term: form.term.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      }
      if (isEditing && id) {
        await examService.update(id, payload)
        showToast('Exam updated', 'success')
      } else {
        await examService.create({ ...payload, totalSubjects: 0, classesCovered: [] })
        showToast('Exam created', 'success')
      }
      navigate('/academic/exams')
    } catch (err) {
      const msg = err instanceof Error ? err.message : examService.stubMessage
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-secondary text-sm flex items-center justify-center gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading exam...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/academic/exams"
            className="p-2 rounded-xl bg-surface hover:bg-surface-strong text-secondary transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-color">
              {isEditing ? 'Edit Examination' : 'Create Examination'}
            </h1>
            <p className="text-xs text-secondary">
              Configure session dates, term, and lifecycle status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/academic/exams')}
            className="px-4 py-2 rounded-xl border border-surface text-secondary text-xs font-semibold hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{isEditing ? 'Save' : 'Create'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          The exams module is not yet implemented on the backend. Submitting
          this form will surface a 501 until the Exam model lands.
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-sm border border-surface space-y-5 bg-surface/40 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block font-semibold text-secondary mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Midterm Examination Term 2"
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as FormState['status'])}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Academic Year *
            </label>
            <input
              type="text"
              required
              value={form.academicYear}
              onChange={(e) => set('academicYear', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Term *
            </label>
            <input
              type="text"
              required
              value={form.term}
              onChange={(e) => set('term', e.target.value)}
              placeholder="e.g. Term 2"
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-surface">
          <div>
            <label className="block font-semibold text-secondary mb-1">
              Start date *
            </label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-secondary mb-1">
              End date *
            </label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  )
}