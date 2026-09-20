// src/pages/Messages/Inbox.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  Inbox as InboxIcon,
  Send,
  Star,
  Trash2,
  Search,
  Plus,
  Users,
  Mail,
  Paperclip,
  X,
  RefreshCw,
  Info,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  messageService,
  type MessageFolder,
  type MessageThread,
} from '@/services/messageService'

type FolderView =
  | 'inbox'
  | 'unread'
  | 'starred'
  | 'teachers'
  | 'parents'
  | 'sent'

const ROLE_LABELS: Record<MessageThread['counterpartyRole'], string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

interface ComposeState {
  recipientName: string
  recipientId: string
  subject: string
  body: string
}

const EMPTY_COMPOSE: ComposeState = {
  recipientName: '',
  recipientId: '',
  subject: '',
  body: '',
}

export default function Inbox() {
  const { showToast } = useToast()

  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activeFolder, setActiveFolder] = useState<FolderView>('inbox')
  const [search, setSearch] = useState('')

  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [compose, setCompose] = useState<ComposeState>({ ...EMPTY_COMPOSE })
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await messageService.listThreads()
      setThreads(list)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setThreads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleStar = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const target = threads.find((t) => t.id === id)
    if (!target) return
    const next = !target.starred
    // Optimistic
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: next } : t))
    )
    try {
      await messageService.setStarred(id, next)
    } catch (err) {
      // Roll back on failure
      setThreads((prev) =>
        prev.map((t) => (t.id === id ? { ...t, starred: !next } : t))
      )
      const msg =
        err instanceof Error ? err.message : 'Unable to update.'
      showToast(msg, 'error')
    }
  }

  const deleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Delete this conversation?')) return
    try {
      await messageService.deleteThread(id)
      setThreads((prev) => prev.filter((t) => t.id !== id))
      showToast('Conversation deleted', 'info')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to delete.'
      showToast(msg, 'error')
    }
  }

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        const matches =
          t.counterpartyName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.preview.toLowerCase().includes(q)
        if (!matches) return false
      }
      switch (activeFolder) {
        case 'inbox':
          return t.folder === 'inbox'
        case 'unread':
          return t.folder === 'inbox' && t.unread
        case 'starred':
          return t.starred
        case 'teachers':
          return t.folder === 'inbox' && t.counterpartyRole === 'teacher'
        case 'parents':
          return t.folder === 'inbox' && t.counterpartyRole === 'parent'
        case 'sent':
          return t.folder === 'sent'
        default:
          return true
      }
    })
  }, [threads, search, activeFolder])

  const unreadCount = threads.filter(
    (t) => t.folder === 'inbox' && t.unread
  ).length

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!compose.recipientId.trim() || !compose.subject.trim() || !compose.body.trim()) {
      showToast('Recipient, subject, and body are required', 'error')
      return
    }
    setSending(true)
    try {
      await messageService.createThread({
        recipientId: compose.recipientId.trim(),
        subject: compose.subject.trim(),
        body: compose.body.trim(),
      })
      showToast('Message sent', 'success')
      setIsComposeOpen(false)
      setCompose({ ...EMPTY_COMPOSE })
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to send message.'
      showToast(msg, 'error')
    } finally {
      setSending(false)
    }
  }

  const renderFolderButton = (
    key: FolderView,
    Icon: typeof InboxIcon,
    label: string,
    badge?: number
  ) => (
    <button
      key={key}
      onClick={() => setActiveFolder(key)}
      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
        activeFolder === key
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-secondary hover:bg-surface'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeFolder === key
              ? 'bg-white/20 text-white'
              : 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Inbox"
          subtitle="Direct messaging between staff, teachers, parents, and students."
        />
        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Compose</span>
        </button>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          The messaging module is not yet implemented on the backend. This
          inbox is empty until the Message and MessageThread models land.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 rounded-2xl glass-sm border border-surface p-4 shadow-sm min-h-145">
        {/* Folder sidebar */}
        <div className="md:col-span-3 space-y-1.5 border-b md:border-b-0 md:border-r border-surface pb-4 md:pb-0 md:pr-4">
          {renderFolderButton('inbox', InboxIcon, 'All Received', unreadCount)}
          {renderFolderButton('unread', Mail, 'Unread', unreadCount)}
          {renderFolderButton('starred', Star, 'Starred')}

          <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
            By Role
          </div>
          {renderFolderButton('teachers', Users, 'Teachers')}
          {renderFolderButton('parents', Users, 'Parents')}

          <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
            Outbox
          </div>
          {renderFolderButton('sent', Send, 'Sent')}
        </div>

        {/* Thread list */}
        <div className="md:col-span-9 flex flex-col">
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3.5 top-2.5 text-secondary"
            />
            <input
              type="text"
              placeholder="Search by sender, subject, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface text-xs text-color placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-16 text-secondary text-sm">
              <RefreshCw size={16} className="inline animate-spin mr-2" />
              Loading messages...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-error">
                Couldn't load messages
              </p>
              <p className="mt-1 text-xs text-secondary">{error.message}</p>
              <button
                onClick={load}
                className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-secondary text-xs">
              <Mail size={32} className="mb-3 opacity-40" />
              <p>
                {threads.length === 0
                  ? 'No messages yet.'
                  : 'No messages in this folder.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-surface border border-surface rounded-2xl overflow-hidden bg-surface/40">
              {filtered.map((thread) => (
                <div
                  key={thread.id}
                  className={`flex items-start justify-between p-3.5 gap-3 transition cursor-pointer hover:bg-surface ${
                    thread.unread ? 'bg-brand-500/3' : ''
                  }`}
                >
                  <Link
                    to={`/messages/${thread.id}`}
                    className="flex items-start gap-3 min-w-0 flex-1"
                  >
                    <button
                      onClick={(e) => toggleStar(thread.id, e)}
                      className={`p-1 rounded-lg transition shrink-0 ${
                        thread.starred
                          ? 'text-warning'
                          : 'text-secondary hover:text-color'
                      }`}
                    >
                      <Star
                        size={16}
                        className={thread.starred ? 'fill-current' : ''}
                      />
                    </button>

                    {thread.counterpartyAvatarUrl ? (
                      <img
                        src={thread.counterpartyAvatarUrl}
                        alt={thread.counterpartyName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-surface"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black text-white bg-linear-to-tr from-brand-600 to-brand-400 ring-1 ring-surface">
                        {initials(thread.counterpartyName)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-color font-bold truncate">
                          {thread.folder === 'sent'
                            ? `To: ${thread.counterpartyName}`
                            : thread.counterpartyName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface text-secondary">
                          {ROLE_LABELS[thread.counterpartyRole]}
                        </span>
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-color font-medium truncate mt-0.5">
                        {thread.subject}
                      </div>
                      <p className="text-[11px] text-secondary truncate">
                        {thread.preview}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3 shrink-0 self-start">
                    {thread.hasAttachment && (
                      <Paperclip size={14} className="text-secondary" />
                    )}
                    <span className="text-[11px] text-secondary whitespace-nowrap">
                      {relativeTime(thread.lastMessageAt)}
                    </span>
                    <button
                      onClick={(e) => deleteThread(thread.id, e)}
                      className="p-1 rounded text-secondary hover:text-error transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compose modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface pb-3">
              <h3 className="text-base font-bold text-color flex items-center gap-2">
                <Send size={16} className="text-brand-500" />
                <span>Compose Message</span>
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Recipient user ID *
                </label>
                <input
                  type="text"
                  required
                  value={compose.recipientId}
                  onChange={(e) =>
                    setCompose({ ...compose, recipientId: e.target.value })
                  }
                  placeholder="e.g. usr_abc123"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
                <p className="mt-1 text-[10px] text-secondary">
                  A recipient picker will replace this field once the backend
                  exposes a directory endpoint.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={compose.subject}
                  onChange={(e) =>
                    setCompose({ ...compose, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={compose.body}
                  onChange={(e) =>
                    setCompose({ ...compose, body: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface text-secondary text-xs font-semibold hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {sending ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}