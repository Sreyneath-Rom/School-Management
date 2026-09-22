// src/pages/Messages/Conversation.tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Send, Star, FileText, Download, CheckCheck,
  RefreshCw, Info,
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

  useEffect(() => { load() }, [load])

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
      <div className="max-w-4xl mx-auto py-16 text-center text-fg-muted text-sm flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin" />
        Loading conversation...
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Info className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
        <p className="text-sm font-semibold text-fg">Conversation not available</p>
        <p className="mt-1 text-xs text-fg-muted max-w-md mx-auto">
          The messaging module is not yet implemented on the backend, or this
          conversation no longer exists.
        </p>
        <Link
          to="/messages"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
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
      <div className="flex items-center justify-between p-4 rounded-2xl glass-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            aria-label="Back to inbox"
            className="glass-sm glass-interactive p-2 rounded-xl text-fg-muted hover:text-fg"
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
            <h2 className="text-sm font-bold text-fg">{thread.counterpartyName}</h2>
            <p className="text-xs text-fg-muted truncate max-w-md">{thread.subject}</p>
          </div>
        </div>

        {/* Star toggle: warning tint when active, sunken press-in when not */}
        <button
          onClick={toggleStar}
          className={`p-2 rounded-xl transition cursor-pointer ${
            thread.starred
              ? 'text-warning bg-warning/15'
              : 'text-fg-muted hover:text-fg hover:shadow-sunken'
          }`}
          title={thread.starred ? 'Unstar' : 'Star'}
          aria-label={thread.starred ? 'Unstar conversation' : 'Star conversation'}
        >
          <Star size={16} className={thread.starred ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl glass-sm space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-fg-muted text-xs">
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
                {/* Bubbles: "mine" is a flat brand-filled chip (color
                    is the signal for which side you're on — no shadow
                    needed). "Theirs" is a sunken well — the neumorphic
                    equivalent of a received message carved into the page. */}
                <div
                  className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'text-fg rounded-bl-none shadow-sunken'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.body}</p>

                  {m.attachment && (
                    <a
                      href={m.attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2.5 flex items-center justify-between p-2.5 rounded-xl ${
                        isMe
                          ? 'bg-white/10 text-white'
                          : 'text-fg shadow-sunken'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText
                          size={16}
                          className={`shrink-0 ${
                            isMe ? 'text-white/80' : 'text-brand-600 dark:text-brand-400'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-[11px] truncate">
                            {m.attachment.name}
                          </div>
                          <div className={`text-[10px] ${isMe ? 'opacity-75' : 'text-fg-muted'}`}>
                            {m.attachment.size}
                          </div>
                        </div>
                      </div>
                      <Download size={14} className="shrink-0" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-fg-muted mt-1 px-1 flex items-center gap-1">
                  {timeOf(m.createdAt)}
                  {isMe && <CheckCheck size={12} className="text-brand-600 dark:text-brand-400" />}
                </span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — raised pill holding a sunken-well input. The input's
          sunken styling comes from globals.css (.neu-inset); no
          `bg-transparent` override so it inherits the treatment. */}
      <form
        onSubmit={handleSend}
        className="p-2.5 rounded-2xl glass-sm flex items-center gap-2"
      >
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-xl px-2 py-1.5 text-xs text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!replyText.trim() || sending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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