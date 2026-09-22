// src/layouts/Header.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Menu,
  LogOut,
  ChevronDown,
  UserCircle,
  Settings,
  CircleHelp,
  CheckCheck,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { useSchool } from '@/hooks/useSchool'
import { useNotifications } from '@/hooks/useNotifications'
import ThemeToggle from '@/components/common/ThemeToggle'
import LanguageSelector from './LanguageSelector'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl'
import { useTranslations } from '@/i18n'
import type { Notification } from '@/types/notification'

function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/* Neumorphic hairline seams. Under this theme a 1px border in the page
   color is invisible; a 1px hard-edged box-shadow using --neu-shadow-dark
   reads as a proper seam. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const navigate = useNavigate()
  const { user, logout, role } = useAuth()
  const { school } = useSchool()
  const { t } = useTranslations()

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const { notifications, unreadCount, isUnread, markRead, markAllRead } =
    useNotifications()

  const activeRole = (role ?? 'admin').toLowerCase()

  // Badges sit on a --glass-bg surface, so a `bg-surface` fill + a
  // sunken shadow reads as a carved-in chip. `border-surface` removed:
  // same color as the surface behind it → invisible.
  const roleBadgeMap: Record<
    string,
    { label: string; badge: string; dot: string }
  > = {
    admin: {
      label: 'Administrator',
      badge: 'bg-surface text-brand-600 dark:text-brand-300 shadow-[var(--shadow-emboss-sunken)]',
      dot: 'bg-brand-500',
    },
    teacher: {
      label: 'Faculty Member',
      badge: 'bg-surface text-success shadow-[var(--shadow-emboss-sunken)]',
      dot: 'bg-success',
    },
    student: {
      label: 'Enrolled Scholar',
      badge: 'bg-surface text-info shadow-[var(--shadow-emboss-sunken)]',
      dot: 'bg-info',
    },
    parent: {
      label: 'Parent / Guardian',
      badge: 'bg-surface text-warning shadow-[var(--shadow-emboss-sunken)]',
      dot: 'bg-warning',
    },
  }
  const roleMeta = roleBadgeMap[activeRole] ?? roleBadgeMap.admin

  const avatarUrl = user?.avatarUrl ? resolveAssetUrl(user.avatarUrl) : null
  const initials = getInitials(user?.name)

  const filteredNotifications = useMemo(
    () => (filter === 'unread' ? notifications.filter(isUnread) : notifications),
    [notifications, filter, isUnread]
  )

  const formattedDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }, [])

  const termName = String(
    (school?.settings as { academicTerm?: unknown } | undefined)?.academicTerm ?? ''
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleNotificationClick = async (item: Notification) => {
    if (isUnread(item)) await markRead(item.id)
    setNotifOpen(false)
  }

  const menuItemClass =
    'group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-secondary transition-all duration-150 hover:text-[color:var(--text-color)] cursor-pointer'

  return (
    <header className="app-header sticky top-0 z-30 select-none transition-colors">
      <div className="app-header-inner flex h-14 sm:h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation drawer"
            className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-2xl glass-sm glass-interactive text-color lg:hidden"
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Static date / term chip — not interactive, so no glass-interactive */}
          <div className="hidden sm:flex items-center gap-2 rounded-2xl glass-sm h-9.5 px-3 py-1.5 text-xs font-semibold text-color">
            <Calendar size={13} className="text-brand-600 dark:text-brand-400" />
            <span className="text-color">{formattedDate}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {termName && (
              <span
                className="max-w-32 truncate text-[10.5px] font-bold text-secondary"
                title={termName}
              >
                {termName}
              </span>
            )}
          </div>

          <LanguageSelector />

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label={t('header.notifications')}
              aria-expanded={notifOpen}
              aria-haspopup="menu"
              onClick={() => {
                setNotifOpen((o) => !o)
                setMenuOpen(false)
              }}
              className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl glass-sm glass-interactive ${
                notifOpen
                  ? 'ring-1 ring-brand-500/40 text-color'
                  : 'text-secondary'
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                // The ring is the same color as the button surface, so it
                // reads as a "cut-out" that separates badge from button —
                // this is intentional. ring-surface-strong = --glass-strong-bg
                // = --glass-bg, i.e. the button color.
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-black text-white ring-2 ring-surface-strong">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-84 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Header row — shadow seam replaces the old invisible
                    `border-b border-surface`. bg-surface-strong dropped:
                    it's the same color as the dropdown itself. */}
                <div className={`flex items-center justify-between px-3.5 py-2.5 ${SEAM_B}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-color">
                      {t('header.notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 cursor-pointer transition"
                    >
                      <CheckCheck size={13} />
                      {t('header.markAllRead')}
                    </button>
                  )}
                </div>

                {/* Filter row */}
                <div className={`flex gap-1 px-3 py-1.5 ${SEAM_B}`}>
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] transition cursor-pointer ${
                      filter === 'all'
                        ? 'text-color font-bold shadow-sunken'
                        : 'text-secondary hover:text-fg'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('unread')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] transition cursor-pointer ${
                      filter === 'unread'
                        ? 'text-color font-bold shadow-sunken'
                        : 'text-secondary hover:text-fg'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                <div className="max-h-76 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-secondary shadow-sunken">
                        <Bell size={16} />
                      </div>
                      <p className="text-xs font-medium text-secondary">
                        {t('header.allCaughtUp')}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`group flex gap-2.5 px-3.5 py-2.5 transition cursor-pointer ${SEAM_B} hover:shadow-sunken`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs bg-surface text-brand-600 dark:text-brand-400">
                          <Bell size={13} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <p className="text-xs font-bold text-color leading-snug">
                              {n.title}
                            </p>
                            {isUnread(n) && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-secondary leading-normal line-clamp-2">
                            {n.body}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-secondary">
                              {relativeTime(n.createdAt)}
                            </span>
                            {isUnread(n) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markRead(n.id)
                                }}
                                className="text-[10px] font-semibold text-brand-600 hover:text-brand-500 hover:underline dark:text-brand-400 cursor-pointer"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="Open account options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setMenuOpen((o) => !o)
                setNotifOpen(false)
              }}
              className={`group flex items-center gap-2 rounded-2xl glass-sm glass-interactive h-9.5 p-1 pr-2 sm:pr-2.5 ${
                menuOpen
                  ? 'ring-1 ring-brand-500/40 text-color'
                  : 'text-secondary'
              }`}
            >
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name ?? 'User'}
                    // ring-surface = --glass-bg = the button color → the
                    // ring is a 1px matte gap, which is the intent.
                    className="h-7.5 w-7.5 rounded-xl object-cover ring-1 ring-surface"
                  />
                ) : (
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-linear-to-tr from-brand-600 to-brand-400 text-white text-xs font-black">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-surface-strong" />
              </div>

              <div className="hidden text-left md:block min-w-0">
                <p className="max-w-28 truncate text-xs font-bold text-color leading-tight">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-[10px] font-semibold text-secondary leading-tight">
                  {roleMeta.label}
                </p>
              </div>

              <ChevronDown
                size={13}
                className={`hidden text-secondary transition-transform duration-200 md:block ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Profile card — sunken well instead of a bordered box */}
                <div className="mb-1 rounded-xl p-3 bg-surface shadow-sunken">
                  <div className="flex items-center gap-2.5">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name ?? 'User'}
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-surface"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-brand-600 to-brand-400 text-white text-sm font-black">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-color">
                        {user?.name ?? 'User'}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${roleMeta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dot}`} />
                          {roleMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-2 pb-1 pt-1.5 text-[9.5px] font-bold uppercase tracking-wider text-secondary">
                  Account & System
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/profile')
                  }}
                  className={menuItemClass}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-secondary group-hover:bg-brand-600 group-hover:text-white transition">
                    <UserCircle size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight text-color">
                      {t('header.myProfile')}
                    </span>
                    <span className="block text-[10px] text-secondary font-normal">
                      Personal profile & credentials
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/settings')
                  }}
                  className={menuItemClass}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-secondary group-hover:bg-brand-600 group-hover:text-white transition">
                    <Settings size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight text-color">
                      {t('header.settings')}
                    </span>
                    <span className="block text-[10px] text-secondary font-normal">
                      Preferences & localization
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/help')
                  }}
                  className={menuItemClass}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-secondary group-hover:bg-brand-600 group-hover:text-white transition">
                    <CircleHelp size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight text-color">
                      Help & Knowledge Base
                    </span>
                    <span className="block text-[10px] text-secondary font-normal">
                      Documentation & support
                    </span>
                  </div>
                </button>

                <div className={`my-1.5 ${SEAM_T}`} />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-error transition cursor-pointer hover:text-error"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-error group-hover:bg-error group-hover:text-white transition">
                    <LogOut size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight text-error">
                      {t('header.logOut')}
                    </span>
                    <span className="block text-[10px] text-error/80 font-normal">
                      End active session safely
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}