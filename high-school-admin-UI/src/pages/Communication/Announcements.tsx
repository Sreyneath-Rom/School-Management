// src/pages/Communication/Announcements.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Megaphone,
  Plus,
  Search,
  Users,
  Pin,
  Trash2,
  Edit3,
  AlertCircle,
  X,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { announcementService } from '@/services/announcementService'
import type { Announcement } from '@/types/announcement'

/**
 * View model. The backend `Announcement` shape drives what's shown, but
 * several fields (category, priority, pinned, author name) are optional —
 * if the API doesn't return them, the UI hides the corresponding elements
 * rather than inventing values.
 */
interface AnnouncementView {
  id: string
  title: string
  content: string
  audience: string
  createdAt: string
  authorName?: string
  category?: string
  priority?: 'Urgent' | 'High' | 'Normal'
  pinned: boolean
}

function toView(raw: Announcement): AnnouncementView {
  const r = raw as Announcement & {
    author?: { name?: string; firstName?: string; lastName?: string }
    pinned?: boolean
    isPinned?: boolean
    category?: string
    priority?: string
  }

  const first = r.author?.firstName ?? ''
  const last = r.author?.lastName ?? ''
  const fullName =
    r.author?.name ?? [first, last].filter(Boolean).join(' ').trim()

  const priorityRaw = r.priority?.toLowerCase()
  const priority: AnnouncementView['priority'] =
    priorityRaw === 'urgent' || priorityRaw === 'high' || priorityRaw === 'normal'
      ? (priorityRaw.charAt(0).toUpperCase() + priorityRaw.slice(1) as AnnouncementView['priority'])
      : undefined

  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    audience: String(raw.audience ?? 'all'),
    createdAt: raw.createdAt,
    authorName: fullName || undefined,
    category: r.category,
    priority,
    pinned: Boolean(r.pinned ?? r.isPinned),
  }
}

interface FormState {
  title: string
  content: string
  audience: 'all' | 'admin' | 'teacher' | 'student' | 'parent'
}

const EMPTY_FORM: FormState = {
  title: '',
  content: '',
  audience: 'all',
}

const AUDIENCE_LABELS: Record<FormState['audience'], string> = {
  all: 'All Community',
  admin: 'Administrators',
  teacher: 'Teachers',
  student: 'Students',
  parent: 'Parents & Guardians',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Announcements() {
  const { showToast } = useToast()

  const [items, setItems] = useState<AnnouncementView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState('')
  const [audienceFilter, setAudienceFilter] = useState<string>('all')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await announcementService.list()
      const list = Array.isArray(data) ? data : []
      setItems(list.map(toView))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    return items.filter((a) => {
      if (audienceFilter !== 'all' && a.audience.toLowerCase() !== audienceFilter) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          (a.authorName ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, search, audienceFilter])

  const stats = useMemo(
    () => ({
      total: items.length,
      pinned: items.filter((a) => a.pinned).length,
      urgent: items.filter((a) => a.priority === 'Urgent').length,
      audiencesCovered: new Set(items.map((a) => a.audience)).size,
    }),
    [items]
  )

  const kpiCards: StatCard[] = [
    { id: 'total', label: 'Announcements', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'published', icon: 'Megaphone', tint: 'blue' },
    { id: 'urgent', label: 'Urgent', value: String(stats.urgent), delta: '-', deltaDirection: 'neutral', deltaLabel: 'flagged urgent', icon: 'AlertCircle', tint: 'red' },
    { id: 'pinned', label: 'Pinned', value: String(stats.pinned), delta: '-', deltaDirection: 'neutral', deltaLabel: 'priority posts', icon: 'Pin', tint: 'violet' },
    { id: 'audiences', label: 'Audiences', value: String(stats.audiencesCovered), delta: '-', deltaDirection: 'neutral', deltaLabel: 'distinct groups', icon: 'Users', tint: 'green' },
  ]

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: AnnouncementView) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      content: item.content,
      audience: (item.audience.toLowerCase() as FormState['audience']) ?? 'all',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Title and content are required', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await announcementService.update(editingId, {
          title: form.title.trim(),
          content: form.content.trim(),
          audience: form.audience,
        })
        showToast('Announcement updated', 'success')
      } else {
        await announcementService.create({
          title: form.title.trim(),
          content: form.content.trim(),
          audience: form.audience,
        })
        showToast('Announcement published', 'success')
      }
      setIsModalOpen(false)
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save announcement.'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await announcementService.delete(id)
      setItems((prev) => prev.filter((a) => a.id !== id))
      showToast('Announcement removed', 'info')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to delete.'
      showToast(msg, 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Announcements"
          subtitle="Publish official broadcasts and institutional notices."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Announcement</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-surface">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-secondary" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-color placeholder:text-secondary focus:outline-none"
          />
        </div>

        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-surface text-xs text-color focus:outline-none cursor-pointer w-full sm:w-52"
        >
          <option value="all">All Audiences</option>
          {announcementService.audiences.map((a) => (
            <option key={a} value={a}>
              {AUDIENCE_LABELS[a as FormState['audience']] ?? a}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-16 text-center text-secondary text-sm rounded-2xl glass-sm border border-surface">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading announcements...
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-error/30 bg-error/5 text-center">
          <p className="text-sm font-bold text-error">Couldn't load announcements</p>
          <p className="mt-1 text-xs text-secondary">{error.message}</p>
          <button
            onClick={load}
            className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-secondary rounded-2xl glass-sm border border-surface text-xs">
          {items.length === 0
            ? 'No announcements yet. Click "New Announcement" to publish the first one.'
            : 'No announcements match your filters.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl glass-sm border transition shadow-sm space-y-3 ${
                item.pinned
                  ? 'border-brand-500/40 bg-brand-500/2'
                  : 'border-surface bg-surface/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-600">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    {item.priority && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.priority === 'Urgent'
                            ? 'bg-error/15 text-error'
                            : item.priority === 'High'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-surface-strong text-secondary'
                        }`}
                      >
                        {item.priority}
                      </span>
                    )}
                    {item.category && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-strong text-secondary">
                        {item.category}
                      </span>
                    )}
                    <span className="text-[11px] text-secondary">
                      Audience: <strong className="text-color">
                        {AUDIENCE_LABELS[item.audience.toLowerCase() as FormState['audience']] ?? item.audience}
                      </strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-color">{item.title}</h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-surface text-secondary hover:text-color transition"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg hover:bg-error/10 text-secondary hover:text-error transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-color leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-surface text-[11px] text-secondary">
                <div className="flex items-center gap-3">
                  {item.authorName && (
                    <>
                      <span>
                        By <strong className="text-color">{item.authorName}</strong>
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface pb-3">
              <h3 className="text-base font-bold text-color flex items-center gap-2">
                <Megaphone size={18} className="text-brand-500" />
                <span>
                  {editingId ? 'Edit Announcement' : 'New Announcement'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Term 2 examination timetable"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Audience
                </label>
                <select
                  value={form.audience}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      audience: e.target.value as FormState['audience'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none"
                >
                  {announcementService.audiences.map((a) => (
                    <option key={a} value={a}>
                      {AUDIENCE_LABELS[a as FormState['audience']] ?? a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Announcement body..."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface text-secondary text-xs font-semibold hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {editingId ? 'Save' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}