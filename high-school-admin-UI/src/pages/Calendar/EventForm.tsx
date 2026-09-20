// src/pages/Calendar/EventForm.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Bell,
  RotateCw,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  eventService,
  type EventCategory,
  type EventAudience,
  type EventPayload,
} from '@/services/eventService'

type FormState = EventPayload

const EMPTY_FORM: FormState = {
  title: '',
  category: 'Meeting',
  targetAudience: 'All',
  date: new Date().toISOString().slice(0, 10),
  isAllDay: false,
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  organizer: '',
  description: '',
}

export default function EventForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [notifyAttendees, setNotifyAttendees] = useState(true)
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const evt = await eventService.getById(id)
        if (cancelled) return
        setForm({
          title: evt.title,
          category: evt.category,
          targetAudience: evt.targetAudience,
          date: evt.date.slice(0, 10),
          isAllDay: evt.isAllDay,
          startTime: evt.startTime,
          endTime: evt.endTime,
          location: evt.location,
          organizer: evt.organizer,
          description: evt.description,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to load event.'
        showToast(msg, 'error')
        navigate('/calendar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate, showToast])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      showToast('Title is required', 'error')
      return
    }
    if (!form.date) {
      showToast('Date is required', 'error')
      return
    }

    setSaving(true)
    try {
      if (isEditing && id) {
        await eventService.update(id, form)
        showToast('Event updated', 'success')
      } else {
        await eventService.create(form)
        showToast('Event created', 'success')
      }
      navigate('/calendar')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save event.'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-secondary text-sm flex items-center justify-center gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading event...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="p-2 rounded-xl bg-surface hover:bg-surface-strong text-secondary transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-color">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h1>
            <p className="text-xs text-secondary">
              {isEditing
                ? 'Update this event and save your changes.'
                : 'Schedule an activity on the school calendar.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/calendar')}
            className="px-4 py-2 rounded-xl border border-surface text-secondary text-xs font-semibold hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>{isEditing ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-sm border border-surface space-y-4 bg-surface/40 text-xs">
        <div>
          <label className="block font-semibold text-secondary mb-1">
            Event title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Annual Sports Day"
            className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-secondary mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as EventCategory)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            >
              <option value="Academic">Academic Milestone</option>
              <option value="Exam">Exam / Assessment</option>
              <option value="Holiday">Holiday / Break</option>
              <option value="Extracurricular">Extracurricular / Sports</option>
              <option value="Meeting">Meeting / Conference</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Target audience
            </label>
            <select
              value={form.targetAudience}
              onChange={(e) =>
                set('targetAudience', e.target.value as EventAudience)
              }
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            >
              <option value="All">All School Community</option>
              <option value="Students">Students Only</option>
              <option value="Teachers">Faculty / Teachers Only</option>
              <option value="Parents">Parents &amp; Guardians</option>
              <option value="Staff">Administrative Staff</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-surface">
          <div>
            <label className="block font-semibold text-secondary mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Start time
            </label>
            <input
              type="time"
              disabled={form.isAllDay}
              value={form.startTime}
              onChange={(e) => set('startTime', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              End time
            </label>
            <input
              type="time"
              disabled={form.isAllDay}
              value={form.endTime}
              onChange={(e) => set('endTime', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="allDayCheck"
            checked={form.isAllDay}
            onChange={(e) => set('isAllDay', e.target.checked)}
            className="rounded border-surface text-brand-600 focus:ring-brand-500"
          />
          <label
            htmlFor="allDayCheck"
            className="text-color font-medium"
          >
            All-day event (no specific time)
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface">
          <div>
            <label className="block font-semibold text-secondary mb-1">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Main Auditorium"
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-secondary mb-1">
              Organizer / Host
            </label>
            <input
              type="text"
              value={form.organizer}
              onChange={(e) => set('organizer', e.target.value)}
              placeholder="e.g. Athletics Department"
              className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-secondary mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What attendees should expect, materials needed, dress code..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
          />
        </div>

        {/*
          Notifications and recurrence are not stored on the backend yet.
          Shown disabled with a note rather than faked as working toggles.
        */}
        <div className="space-y-2 pt-2 border-t border-surface opacity-60">
          <label className="flex items-center gap-2.5 cursor-not-allowed">
            <input
              type="checkbox"
              checked={notifyAttendees}
              disabled
              onChange={(e) => setNotifyAttendees(e.target.checked)}
              className="rounded border-surface"
            />
            <span className="text-color font-medium flex items-center gap-1.5">
              <Bell size={13} className="text-brand-500" />
              Notify targeted audience
              <span className="text-secondary text-[10px] font-normal">
                (not yet supported)
              </span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-not-allowed">
            <input
              type="checkbox"
              checked={isRecurring}
              disabled
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-surface"
            />
            <span className="text-color font-medium flex items-center gap-1.5">
              <RotateCw size={13} className="text-brand-500" />
              Weekly recurrence
              <span className="text-secondary text-[10px] font-normal">
                (not yet supported)
              </span>
            </span>
          </label>
        </div>
      </div>
    </form>
  )
}