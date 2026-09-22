// src/pages/Communication/Notifications.tsx
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  Bell, CheckCheck, Trash2, RefreshCw, Mail, Smartphone, Monitor, Circle,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { useNotifications } from '@/hooks/useNotifications'
import { notificationService } from '@/services/notificationService'
import type { Notification, NotificationChannel } from '@/types/notification'

type Filter = 'all' | 'unread'

const CHANNEL_META: Record<
  NotificationChannel,
  { label: string; Icon: typeof Mail }
> = {
  EMAIL:   { label: 'Email',   Icon: Mail },
  PUSH:    { label: 'Push',    Icon: Smartphone },
  IN_APP:  { label: 'In-app',  Icon: Monitor },
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function NotificationsPage() {
  const { showToast } = useToast()
  const {
    notifications, loading, unreadCount,
    isUnread, markRead, markAllRead, refetch,
  } = useNotifications()

  const [filter, setFilter] = useState<Filter>('all')
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered: Notification[] = useMemo(() => {
    return filter === 'unread' ? notifications.filter(isUnread) : notifications
  }, [notifications, filter, isUnread])

  const handleDismiss = async (id: string) => {
    setBusyId(id)
    try {
      await notificationService.delete(id)
      await refetch()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to delete notification.'
      showToast(msg, 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
    showToast('All notifications marked read', 'success')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Notifications"
          subtitle="In-app alerts, academic milestones, and system notices."
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={refetch}
            disabled={loading}
            className="glass-sm glass-interactive p-2 rounded-xl text-fg-muted hover:text-fg disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="glass-sm glass-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-fg text-xs font-semibold"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter tray — border removed, hover is now visible */}
      <div className="flex items-center gap-1.5 p-3 rounded-2xl glass-sm overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'all'
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
              : 'text-fg-muted hover:text-fg hover:shadow-sunken'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'unread'
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
              : 'text-fg-muted hover:text-fg hover:shadow-sunken'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-sm">
          <Bell className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-xs text-fg-muted">
            {notifications.length === 0
              ? "You don't have any notifications yet."
              : "You're all caught up."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const channelMeta = CHANNEL_META[item.channel] ?? CHANNEL_META.IN_APP
            const { Icon: ChannelIcon } = channelMeta
            const unread = isUnread(item)

            return (
              <div
                key={item.id}
                // Unread: same raised surface + brand ring as the pinned
                // announcements. Read: raised surface with no ring. Both
                // replaced the previous `border-brand-500/30 bg-brand-500/3`
                // (nearly invisible) and `border-surface bg-surface/40`
                // (fully no-op) — neither read visually under neumorphism.
                className={`p-4 rounded-2xl glass-sm flex items-start justify-between gap-4 ${
                  unread ? 'ring-1 ring-brand-500/30 bg-brand-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Icon well → sunken */}
                  <div className="p-2.5 rounded-xl text-fg-muted shrink-0 mt-0.5 shadow-sunken">
                    <ChannelIcon size={16} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xs font-bold ${unread ? 'text-fg' : 'text-fg-muted'}`}>
                        {item.title}
                      </h3>
                      {unread && (
                        <Circle size={6} className="text-brand-500 fill-brand-500 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-fg leading-relaxed">{item.body}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-fg-muted">
                      <span>{relativeTime(item.createdAt)}</span>
                      <span>•</span>
                      <span>{channelMeta.label}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {unread && (
                    <button
                      onClick={() => markRead(item.id)}
                      className="p-1 rounded text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                      title="Mark as read"
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(item.id)}
                    disabled={busyId === item.id}
                    className="p-1 rounded text-fg-muted hover:text-error hover:shadow-sunken disabled:opacity-50 transition cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="text-center pt-4">
        <Link
          to="/settings"
          className="text-[11px] text-fg-muted hover:text-fg underline"
        >
          Notification preferences
        </Link>
      </div>
    </div>
  )
}