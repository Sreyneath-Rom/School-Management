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
import { getActiveTerm } from '@/data/terms'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  category?: 'academic' | 'attendance' | 'exam' | 'system'
  link?: string
}
const CURRENT_TERM_NAME = getActiveTerm()?.name ?? ''



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
      badge: 'bg-surface text-brand-600 dark:text-brand-300 border-surface',
      dot: 'bg-brand-500',
    },
    teacher: {
      label: 'Faculty Member',
      badge: 'bg-surface text-success border-surface',
      dot: 'bg-success',
    },
    student: {
      label: 'Enrolled Scholar',
      badge: 'bg-surface text-info border-surface',
      dot: 'bg-info',
    },
    parent: {
      label: 'Parent / Guardian',
      badge: 'bg-surface text-warning border-surface',
      dot: 'bg-warning',
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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const menuItemClass =
    'group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-secondary transition-all duration-150 hover:bg-surface hover:text-color cursor-pointer'

  return (
    <header className="app-header sticky top-0 z-30 select-none transition-colors">
      <div className="app-header-inner flex h-14 sm:h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        {/* ================================================================= */}
        {/* LEFT: MOBILE TOGGLE ONLY (NO REDUNDANT SCHOOL PROFILE/LOGO)       */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Hamburger Toggle (Visible on screens < lg) */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation drawer"
            className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-2xl glass-sm text-color lg:hidden cursor-pointer transition hover:bg-surface active:scale-95"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* ================================================================= */}
        {/* RIGHT: LIVE CALENDAR, LANGUAGE, NOTIFICATIONS, THEME, USER MENU   */}
        {/* ================================================================= */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Academic Session Date Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-2xl glass-sm h-9.5 px-3 py-1.5 text-xs font-semibold text-color">
            <Calendar size={13} className="text-brand-600 dark:text-brand-400" />
            <span className="text-color">{formattedDate}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span
              className="max-w-32 truncate text-[10.5px] font-bold text-secondary"
              title={CURRENT_TERM_NAME}
            >
              {CURRENT_TERM_NAME}
            </span>
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
                  className={`flex h-9.5 items-center gap-1.5 rounded-2xl px-2.5 text-xs font-semibold transition cursor-pointer glass-sm ${
                    langOpen
                      ? 'ring-1 ring-brand-500/30 text-color'
                      : 'text-secondary hover:text-color'
                  }`}
                >
                  <span className="text-sm">{safeActiveLang.flag}</span>
                  <span className="hidden sm:inline font-bold uppercase text-[10.5px] text-color">
                    {safeActiveLang.code}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 text-secondary ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langOpen && (
                  <div
                    role="menu"
                    className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
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
                              ? 'bg-brand-600 text-white font-semibold shadow-xs'
                              : 'text-secondary hover:bg-surface hover:text-color'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
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
              className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl glass-sm transition cursor-pointer ${
                notifOpen
                  ? 'ring-1 ring-brand-500/30 text-color'
                  : 'text-secondary hover:text-color hover:bg-surface'
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-black text-white ring-2 ring-surface-strong">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-84 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Notifications Header */}
                <div className="flex items-center justify-between border-b border-surface px-3.5 py-2.5 bg-surface-strong">
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

                {/* Filter tabs */}
                <div className="flex gap-1 border-b border-surface px-3 py-1.5 bg-surface">
                  <button
                    type="button"
                    onClick={() => setActiveFilterCategory('all')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] transition cursor-pointer ${
                      activeFilterCategory === 'all'
                        ? 'bg-surface-strong text-color shadow-xs font-bold'
                        : 'text-secondary hover:text-color'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilterCategory('unread')}
                    className={`rounded-lg px-2.5 py-1 text-[11px] transition cursor-pointer ${
                      activeFilterCategory === 'unread'
                        ? 'bg-surface-strong text-color shadow-xs font-bold'
                        : 'text-secondary hover:text-color'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Notification items list */}
                <div className="max-h-76 overflow-y-auto divide-y divide-surface">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center bg-surface/30">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-secondary">
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
                        className={`group flex gap-2.5 px-3.5 py-2.5 transition cursor-pointer hover:bg-surface ${
                          !n.read ? 'bg-surface/50' : ''
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs bg-surface text-brand-600 dark:text-brand-400">
                          <Bell size={13} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <p className="text-xs font-bold text-color leading-snug">
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-secondary leading-normal line-clamp-2">
                            {n.message}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-secondary">
                              {n.time}
                            </span>
                            {!n.read && (
                              <button
                                type="button"
                                onClick={(e) => markOneRead(n.id, e)}
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
              className={`group flex items-center gap-2 rounded-2xl glass-sm h-9.5 p-1 pr-2 sm:pr-2.5 transition cursor-pointer ${
                menuOpen
                  ? 'ring-1 ring-brand-500/30 text-color'
                  : 'text-secondary hover:text-color'
              }`}
            >
              {/* User Avatar with Presence Badge */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name ?? 'User'}
                    className="h-7.5 w-7.5 rounded-xl object-cover ring-1 ring-surface"
                  />
                ) : (
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-linear-to-tr from-brand-600 to-brand-400 text-white text-xs font-black shadow-xs">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-surface-strong" />
              </div>

              {/* User Name & Role Label */}
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

            {/* User Dropdown Panel */}
            {menuOpen && (
              <div
                role="menu"
                className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Executive Header Identity Card */}
                <div className="mb-1 rounded-xl p-3 bg-surface-strong border border-surface">
                  <div className="flex items-center gap-2.5">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name ?? 'User'}
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-surface"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-brand-600 to-brand-400 text-white text-sm font-black shadow-xs">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-color">
                        {user?.name ?? 'Administrator'}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold border ${roleMeta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dot}`} />
                          {roleMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
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
                    <span className="block leading-tight text-color group-hover:text-color">{t('header.myProfile')}</span>
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
                    <span className="block leading-tight text-color group-hover:text-color">{t('header.settings')}</span>
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
                    <span className="block leading-tight text-color group-hover:text-color">Help & Knowledge Base</span>
                    <span className="block text-[10px] text-secondary font-normal">
                      Documentation & support
                    </span>
                  </div>
                </button>

                {/* Sign Out Action */}
                <div className="my-1.5 border-t border-surface" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-error hover:bg-surface hover:text-error transition cursor-pointer"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-error group-hover:bg-error group-hover:text-white transition">
                    <LogOut size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block leading-tight text-error">{t('header.logOut')}</span>
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