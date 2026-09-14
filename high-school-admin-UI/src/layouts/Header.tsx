import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Menu,
  LogOut,
  ChevronDown,
  Check,
  UserCircle,
  Settings,
  CircleHelp,
  CheckCheck,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/common/ThemeToggle'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl'
import { useTranslations } from '@/i18n'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  category?: 'academic' | 'attendance' | 'exam' | 'system'
  link?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Grade 12 Physics Term Exam Marks Ready',
    message: 'Teacher Sovann has submitted the final semester scores for Class 12-A.',
    time: '15m ago',
    read: false,
    category: 'exam',
    link: '/academic/grades',
  },
  {
    id: 'notif-2',
    title: 'Daily Attendance Report Finalized',
    message: '97.8% attendance recorded across all secondary grades today.',
    time: '1h ago',
    read: false,
    category: 'attendance',
    link: '/students/attendance',
  },
  {
    id: 'notif-3',
    title: 'Semester II Schedule Verification',
    message: 'Academic committee approved the revised room allocations.',
    time: '3h ago',
    read: true,
    category: 'academic',
    link: '/academic/schedules',
  },
]

function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void
}) {
  const navigate = useNavigate()
  const { user, logout, role } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | 'unread'>('all')

  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  const activeRole = (role || 'admin').toLowerCase()

  // ---------------------------------------------------------------------------
  // USER META
  // ---------------------------------------------------------------------------
  const roleBadgeMap: Record<string, { label: string; badge: string; dot: string }> = {
    admin: {
      label: 'Administrator',
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
      dot: 'bg-blue-500',
    },
    teacher: {
      label: 'Faculty Member',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    student: {
      label: 'Enrolled Scholar',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
      dot: 'bg-purple-500',
    },
    parent: {
      label: 'Parent / Guardian',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      dot: 'bg-amber-500',
    },
  }

  const roleMeta = roleBadgeMap[activeRole] || roleBadgeMap.admin
  const avatarUrl = (user as { avatarUrl?: string } | null)?.avatarUrl
    ? resolveAssetUrl((user as { avatarUrl?: string }).avatarUrl!)
    : null
  const initials = getInitials(user?.name)

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS STATE
  // ---------------------------------------------------------------------------
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const filteredNotifications = useMemo(() => {
    if (activeFilterCategory === 'unread') {
      return notifications.filter((n) => !n.read)
    }
    return notifications
  }, [notifications, activeFilterCategory])

  const markOneRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (item: NotificationItem) => {
    markOneRead(item.id)
    setNotifOpen(false)
    if (item.link) {
      navigate(item.link)
    }
  }

  // ---------------------------------------------------------------------------
  // LANGUAGE & LOCALIZATION
  // ---------------------------------------------------------------------------
  const {
    language,
    setLanguage,
    languages,
    activeLanguage,
    t,
  } = useTranslations()

  const formattedDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString(activeLanguage?.locale || 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'Mon, Sep 14'
    }
  }, [activeLanguage?.locale])

  // Close menus on outside click & escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false)
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotifOpen(false)
        setLangOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const menuItemClass =
    'group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer'

  return (
    <header className="app-header sticky top-0 z-30 select-none bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        {/* ================================================================= */}
        {/* LEFT: MOBILE TOGGLE ONLY (NO REDUNDANT SCHOOL PROFILE/LOGO)       */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Hamburger Toggle (Visible on screens < lg) */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation drawer"
            className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden cursor-pointer transition active:scale-95"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* ================================================================= */}
        {/* RIGHT: LIVE CALENDAR, LANGUAGE, NOTIFICATIONS, THEME, USER MENU   */}
        {/* ================================================================= */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Academic Session Date Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1.5 border border-slate-200/70 dark:border-slate-700/70 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Calendar size={13} className="text-teal-600 dark:text-teal-400" />
            <span>{formattedDate}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-[10.5px] font-bold text-teal-700 dark:text-teal-300">Sem II</span>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* LANGUAGE SELECTOR                                             */}
          {/* ------------------------------------------------------------- */}
          {(() => {
            const safeLanguages = Array.isArray(languages) ? languages : []
            const safeActiveLang = activeLanguage || {
              code: 'en',
              name: 'English',
              flag: '🇬🇧',
            }

            return (
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  aria-label={`${t('header.changeLanguage')}: ${safeActiveLang.name}`}
                  aria-expanded={langOpen}
                  aria-haspopup="menu"
                  onClick={() => {
                    setLangOpen((o) => !o)
                    setMenuOpen(false)
                    setNotifOpen(false)
                  }}
                  className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition cursor-pointer ${
                    langOpen
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-teal-500/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm">{safeActiveLang.flag}</span>
                  <span className="hidden sm:inline font-bold uppercase text-[10.5px]">
                    {safeActiveLang.code}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 text-slate-400 ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {t('header.changeLanguage')}
                    </div>

                    <div className="space-y-0.5">
                      {safeLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setLanguage(lang.code)
                            setLangOpen(false)
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition cursor-pointer ${
                            lang.code === language
                              ? 'bg-teal-600 text-white font-semibold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                          {lang.code === language && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* ------------------------------------------------------------- */}
          {/* NOTIFICATIONS CENTER                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label={t('header.notifications')}
              aria-expanded={notifOpen}
              aria-haspopup="menu"
              onClick={() => {
                setNotifOpen((o) => !o)
                setMenuOpen(false)
                setLangOpen(false)
              }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
                notifOpen
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-teal-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-84 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-150">
                {/* Notifications Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('header.notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-teal-500/15 px-1.5 py-0.2 text-[10px] font-extrabold text-teal-700 dark:text-teal-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 cursor-pointer"
                    >
                      <CheckCheck size={13} />
                      {t('header.markAllRead')}
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 border-b border-slate-100 dark:border-slate-800 px-3 py-1.5 bg-slate-50/60 dark:bg-slate-900/40">
                  <button
                    type="button"
                    onClick={() => setActiveFilterCategory('all')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      activeFilterCategory === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilterCategory('unread')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      activeFilterCategory === 'unread'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Notification items list */}
                <div className="max-h-76 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Bell size={16} />
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('header.allCaughtUp')}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`group flex gap-2.5 px-3.5 py-2.5 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          !n.read ? 'bg-teal-500/5 dark:bg-teal-500/10' : ''
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                            n.category === 'exam'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                              : n.category === 'attendance'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          }`}
                        >
                          <Bell size={13} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                            {n.message}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {n.time}
                            </span>
                            {!n.read && (
                              <button
                                type="button"
                                onClick={(e) => markOneRead(n.id, e)}
                                className="text-[10px] font-semibold text-teal-600 hover:underline dark:text-teal-400"
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

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* ------------------------------------------------------------- */}
          {/* USER EXECUTIVE PROFILE MENU                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="Open account options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setMenuOpen((o) => !o)
                setNotifOpen(false)
                setLangOpen(false)
              }}
              className={`group flex items-center gap-2 rounded-xl p-1 pr-2 sm:pr-2.5 transition cursor-pointer ${
                menuOpen
                  ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-teal-500/30'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {/* User Avatar with Presence Badge */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name ?? 'User'}
                    className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white text-xs font-black shadow-xs">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              {/* User Name & Role Label */}
              <div className="hidden text-left md:block min-w-0">
                <p className="max-w-28 truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                  {roleMeta.label}
                </p>
              </div>

              <ChevronDown
                size={13}
                className={`hidden text-slate-400 transition-transform duration-200 md:block ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Dropdown Panel */}
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Executive Header Identity Card */}
                <div className="mb-1 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 border border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-center gap-2.5">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name ?? 'User'}
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white text-sm font-black shadow-xs">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {user?.name ?? 'Administrator'}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[9.5px] font-bold border ${roleMeta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dot}`} />
                          {roleMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="px-2 pb-1 pt-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-teal-600 group-hover:text-white transition">
                    <UserCircle size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight">{t('header.myProfile')}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-teal-600 group-hover:text-white transition">
                    <Settings size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight">{t('header.settings')}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-teal-600 group-hover:text-white transition">
                    <CircleHelp size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight">Help & Knowledge Base</span>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Documentation & support
                    </span>
                  </div>
                </button>

                {/* Sign Out Action */}
                <div className="my-1.5 border-t border-slate-200/80 dark:border-slate-800/80" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300 transition cursor-pointer"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 dark:bg-rose-950/40 dark:group-hover:bg-rose-950/70 transition">
                    <LogOut size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight">{t('header.logOut')}</span>
                    <span className="block text-[10px] text-rose-400/80 font-normal">
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
