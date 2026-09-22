// src/pages/Communication/Announcements.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Megaphone, Plus, Search, Users, Pin, Trash2, Edit3,
  AlertCircle, X, CheckCircle2, RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { announcementService } from '@/services/announcementService'
import type { Announcement } from '@/types/announcement'

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
  const fullName = r.author?.name ?? [first, last].filter(Boolean).join(' ').trim()

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

const EMPTY_FORM: FormState = { title: '', content: '', audience: 'all' }

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
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
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

  useEffect(() => { load() }, [load])

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
    { id: 'total',    label: 'Announcements', value: String(stats.total),            delta: '-', deltaDirection: 'neutral', deltaLabel: 'published',       icon: 'Megaphone',   tint: 'blue' },
    { id: 'urgent',   label: 'Urgent',        value: String(stats.urgent),           delta: '-', deltaDirection: 'neutral', deltaLabel: 'flagged urgent',  icon: 'AlertCircle', tint: 'red' },
    { id: 'pinned',   label: 'Pinned',        value: String(stats.pinned),           delta: '-', deltaDirection: 'neutral', deltaLabel: 'priority posts',  icon: 'Pin',         tint: 'violet' },
    { id: 'audiences', label: 'Audiences',    value: String(stats.audiencesCovered), delta: '-', deltaDirection: 'neutral', deltaLabel: 'distinct groups', icon: 'Users',       tint: 'green' },
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

  // Shared modal input styling — inherits the sunken-well look from
  // globals.css. Only padding + focus ring live here.
  const modalInput =
    'w-full px-3 py-2 rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
  const modalLabel = 'block font-semibold text-fg-muted mb-1'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Announcements"
          subtitle="Publish official broadcasts and institutional notices."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-600/25 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>New Announcement</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {/* Filter bar — border removed (was invisible) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-fg-muted z-10" />
          {/* Input gets the sunken-well treatment from globals.css.
              Previously `bg-transparent border-none`, which meant the
              input read as plain text floating on the glass card. */}
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer w-full sm:w-52"
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
        <div className="p-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading announcements...
        </div>
      ) : error ? (
        // Semantic error — tinted, kept
        <div className="p-6 rounded-2xl border border-error/30 bg-error/10 text-center">
          <p className="text-sm font-bold text-error">Couldn't load announcements</p>
          <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          <button
            onClick={load}
            className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-fg-muted rounded-2xl glass-sm text-xs">
          {items.length === 0
            ? 'No announcements yet. Click "New Announcement" to publish the first one.'
            : 'No announcements match your filters.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              // Pinned items get a brand ring + subtle tint ON TOP of the
              // same raised `glass-sm` surface. Previously the pinned
              // state used `border-brand-500/40 bg-brand-500/2` — the
              // border was on an invisible surface, and 2% opacity brand
              // background is imperceptible on the flat page color.
              className={`p-5 rounded-2xl glass-sm space-y-3 ${
                item.pinned ? 'ring-1 ring-brand-500/40 bg-brand-500/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    {/* Priority chip — semantic tints, kept */}
                    {item.priority && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.priority === 'Urgent'
                            ? 'bg-error/15 text-error'
                            : item.priority === 'High'
                              ? 'bg-warning/15 text-warning'
                              : 'text-fg-muted shadow-sunken'
                        }`}
                      >
                        {item.priority}
                      </span>
                    )}
                    {item.category && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-fg-muted shadow-sunken">
                        {item.category}
                      </span>
                    )}
                    <span className="text-[11px] text-fg-muted">
                      Audience:{' '}
                      <strong className="text-fg">
                        {AUDIENCE_LABELS[item.audience.toLowerCase() as FormState['audience']] ?? item.audience}
                      </strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-fg">{item.title}</h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-fg leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {/* Footer divider — shadow seam replaces invisible border */}
              <div className="flex items-center justify-between pt-2 shadow-[0_-1px_0_var(--neu-shadow-dark)] text-[11px] text-fg-muted">
                <div className="flex items-center gap-3">
                  {item.authorName && (
                    <>
                      <span>By <strong className="text-fg">{item.authorName}</strong></span>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}
        >
          <div className="w-full max-w-lg rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <Megaphone size={18} className="text-brand-600 dark:text-brand-400" />
                <span>{editingId ? 'Edit Announcement' : 'New Announcement'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className={modalLabel}>Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Term 2 examination timetable"
                  className={modalInput}
                />
              </div>

              <div>
                <label className={modalLabel}>Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) =>
                    setForm({ ...form, audience: e.target.value as FormState['audience'] })
                  }
                  className={`${modalInput} cursor-pointer`}
                >
                  {announcementService.audiences.map((a) => (
                    <option key={a} value={a}>
                      {AUDIENCE_LABELS[a as FormState['audience']] ?? a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={modalLabel}>Content *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Announcement body..."
                  className={modalInput}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-fg-muted hover:text-fg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm shadow-brand-600/25 disabled:opacity-50 cursor-pointer"
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