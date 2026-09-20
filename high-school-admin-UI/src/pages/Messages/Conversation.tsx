// src/pages/Messages/Conversation.tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Star,
  FileText,
  Download,
  CheckCheck,
  RefreshCw,
  Info,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  messageService,
  type MessageItem,
  type MessageThread,
} from '@/services/messageService'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function timeOf(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Conversation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [thread, setThread] = useState<MessageThread | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyText, setReplyText] = useState('')

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const detail = await messageService.getThread(id)
      if (!detail) {
        setThread(null)
        setMessages([])
        return
      }
      setThread(detail.thread)
      setMessages(detail.messages)
      // Mark read once loaded — best-effort, ignore failure.
      if (detail.thread.unread) {
        messageService.setRead(id, true).catch(() => {})
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load conversation.'
      showToast(msg, 'error')
      setThread(null)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !replyText.trim()) return

    const text = replyText.trim()
    setSending(true)
    try {
      const sent = await messageService.sendMessage(id, { body: text })
      setMessages((prev) => [...prev, sent])
      setReplyText('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to send.'
      showToast(msg, 'error')
    } finally {
      setSending(false)
    }
  }

  const toggleStar = async () => {
    if (!thread) return
    const next = !thread.starred
    setThread({ ...thread, starred: next })
    try {
      await messageService.setStarred(thread.id, next)
    } catch (err) {
      setThread({ ...thread, starred: !next })
      const msg = err instanceof Error ? err.message : 'Unable to update.'
      showToast(msg, 'error')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-secondary text-sm flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin" />
        Loading conversation...
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Info className="mx-auto mb-3 h-10 w-10 text-secondary" />
        <p className="text-sm font-semibold text-color">
          Conversation not available
        </p>
        <p className="mt-1 text-xs text-secondary max-w-md mx-auto">
          The messaging module is not yet implemented on the backend, or this
          conversation no longer exists.
        </p>
        <Link
          to="/messages"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to inbox
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-145">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-sm border border-surface bg-surface/40">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            className="p-2 rounded-xl bg-surface hover:bg-surface-strong text-secondary transition"
          >
            <ArrowLeft size={18} />
          </Link>
          {thread.counterpartyAvatarUrl ? (
            <img
              src={thread.counterpartyAvatarUrl}
              alt={thread.counterpartyName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-surface"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white bg-linear-to-tr from-brand-600 to-brand-400 ring-1 ring-surface">
              {initials(thread.counterpartyName)}
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-color">
              {thread.counterpartyName}
            </h2>
            <p className="text-xs text-secondary truncate max-w-md">
              {thread.subject}
            </p>
          </div>
        </div>

        <button
          onClick={toggleStar}
          className={`p-2 rounded-xl transition ${
            thread.starred
              ? 'text-warning'
              : 'text-secondary hover:text-color hover:bg-surface'
          }`}
          title={thread.starred ? 'Unstar' : 'Star'}
        >
          <Star size={16} className={thread.starred ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl glass-sm border border-surface bg-surface/30 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-secondary text-xs">
            No messages in this conversation yet.
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === 'me'
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-surface text-color border border-surface rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.body}</p>

                  {m.attachment && (
                    <a
                      href={m.attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2.5 flex items-center justify-between p-2.5 rounded-xl border ${
                        isMe
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-surface-strong border-surface text-color'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={16} className="text-brand-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[11px] truncate">
                            {m.attachment.name}
                          </div>
                          <div className="text-[10px] opacity-75">
                            {m.attachment.size}
                          </div>
                        </div>
                      </div>
                      <Download size={14} className="shrink-0" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-secondary mt-1 px-1 flex items-center gap-1">
                  {timeOf(m.createdAt)}
                  {isMe && (
                    <CheckCheck size={12} className="text-brand-500" />
                  )}
                </span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-2.5 rounded-2xl glass-sm border border-surface bg-surface flex items-center gap-2"
      >
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-xs text-color placeholder:text-secondary focus:outline-none px-2"
        />
        <button
          type="submit"
          disabled={!replyText.trim() || sending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
        >
          {sending ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  )
}