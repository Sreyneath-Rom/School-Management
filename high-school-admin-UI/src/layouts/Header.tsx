
import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Menu,
  LogOut,
  ChevronDown,
  Check,
  UserCircle,
  Settings,
  GraduationCap,
  ShieldCheck,
  CircleHelp,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { useSchool } from '@/context/SchoolContext'
import ThemeToggle from '@/components/common/ThemeToggle'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl'
import { useTranslations } from '@/i18n'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}
const INITIAL_NOTIFICATIONS: NotificationItem[] = []

function getInitials(name?: string | null): string {
  if (!name) return '?'

  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
}

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void
}) {
  const navigate = useNavigate()
  const { user, logout, role } = useAuth()
  const { school } = useSchool()

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // ---------------------------------------------------------------------------
  // SCHOOL IDENTITY
  // ---------------------------------------------------------------------------

  const activeRole = (role || 'admin').toLowerCase()

  const dashboardPath =
    activeRole === 'admin'
      ? '/dashboard'
      : `/${activeRole}/dashboard`

  const schoolName =
    school?.name || 'High School Academic OS'

  const schoolMotto =
    school?.settings?.motto ||
    'MoEYS Curriculum • 2025–2026'

  const logoUrl = resolveAssetUrl(school?.logoUrl)

  const [logoLoadFailed, setLogoLoadFailed] =
    useState(false)

  useEffect(() => {
    setLogoLoadFailed(false)
  }, [logoUrl])

  // ---------------------------------------------------------------------------
  // USER
  // ---------------------------------------------------------------------------

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() +
      user.role.slice(1)
    : ''

  const avatarUrl = (
    user as { avatarUrl?: string } | null
  )?.avatarUrl
    ? resolveAssetUrl(
        (user as { avatarUrl?: string }).avatarUrl!,
      )
    : null

  const initials = getInitials(user?.name)

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS
  // ---------------------------------------------------------------------------

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      INITIAL_NOTIFICATIONS,
    )

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  // ---------------------------------------------------------------------------
  // LANGUAGE
  // ---------------------------------------------------------------------------

  const {
    language,
    setLanguage,
    languages,
    activeLanguage,
    t,
  } = useTranslations()

  const today = useMemo(() => {
    return new Date().toLocaleDateString(
      activeLanguage.locale,
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      },
    )
  }, [activeLanguage.locale])

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    )
  }

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const openUserMenu = () => {
    setMenuOpen((open) => !open)
    setNotifOpen(false)
    setLangOpen(false)
  }

  const openNotifications = () => {
    setNotifOpen((open) => !open)
    setMenuOpen(false)
    setLangOpen(false)
  }

  const openLanguage = () => {
    setLangOpen((open) => !open)
    setMenuOpen(false)
    setNotifOpen(false)
  }

  // ---------------------------------------------------------------------------
  // OUTSIDE CLICK + ESC
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setNotifOpen(false)
      }

      if (
        langRef.current &&
        !langRef.current.contains(target)
      ) {
        setLangOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setMenuOpen(false)
      setNotifOpen(false)
      setLangOpen(false)
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )

      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [])

  // ---------------------------------------------------------------------------
  // MENU ITEM
  // ---------------------------------------------------------------------------

  const menuItemClass =
    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-700 transition-all duration-150 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/[0.06] dark:hover:text-white'

  return (
    <header className="app-header sticky top-0 z-30">
      <div className="app-header-inner flex h-16 items-center justify-between gap-2 px-3 sm:h-20 sm:gap-3 sm:px-6 lg:px-8">

        {/* ================================================================= */}
        {/* LEFT */}
        {/* ================================================================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* MOBILE SIDEBAR */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white lg:hidden"
          >
            <Menu size={19} />
          </button>

          {/* SCHOOL IDENTITY */}
          <Link
            to={dashboardPath}
            title={`${schoolName} — Dashboard`}
            className="group flex min-w-0 items-center gap-2.5 rounded-full py-1.5 pl-1 pr-3 transition-colors hover:bg-stone-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 dark:hover:bg-white/5 sm:py-2"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-sm shadow-brand-600/30 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
              {logoUrl && !logoLoadFailed ? (
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="h-full w-full object-cover"
                  onError={() =>
                    setLogoLoadFailed(true)
                  }
                />
              ) : (
                <GraduationCap size={18} />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <span className="block max-w-40 truncate text-[13px] font-bold tracking-tight text-stone-900 dark:text-stone-100 lg:max-w-56">
                {schoolName}
              </span>

              <span className="block max-w-40 truncate text-[10.5px] font-medium text-stone-500 dark:text-stone-400 lg:max-w-56">
                {schoolMotto}
              </span>
            </div>
          </Link>
        </div>

        {/* ================================================================= */}
        {/* RIGHT */}
        {/* ================================================================= */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

          {/* DATE */}
          <div className="hidden items-center gap-2 text-sm text-stone-500 xl:flex dark:text-stone-400">
            <Calendar size={16} />
            <span>{today}</span>
          </div>

          {/* ================================================================= */}
          {/* LANGUAGE */}
          {/* ================================================================= */}

          {(() => {
            const safeLanguages = Array.isArray(
              languages,
            )
              ? languages
              : []

            const safeActiveLang =
              activeLanguage || {
                code: 'en',
                name: 'English',
                flag: '🇬🇧',
              }

            if (safeLanguages.length <= 1) {
              return (
                <div className="inline-flex h-10 items-center gap-1.5 rounded-full glass-sm px-3 text-stone-600 dark:text-stone-300">
                  <span className="text-base">
                    {safeActiveLang.flag}
                  </span>

                  <span className="hidden text-[10px] font-bold uppercase tracking-[0.12em] sm:inline">
                    {safeActiveLang.code}
                  </span>

                  <span className="hidden text-xs font-semibold sm:inline">
                    {safeActiveLang.name}
                  </span>
                </div>
              )
            }

            return (
              <div
                className="relative"
                ref={langRef}
              >
                <button
                  type="button"
                  aria-label={`${t(
                    'header.changeLanguage',
                  )}: ${safeActiveLang.name}`}
                  aria-expanded={langOpen}
                  aria-haspopup="menu"
                  onClick={openLanguage}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full glass-sm px-3 text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
                >
                  <span className="text-base">
                    {safeActiveLang.flag}
                  </span>

                  <span className="hidden text-[10px] font-bold uppercase tracking-[0.12em] sm:inline">
                    {safeActiveLang.code}
                  </span>

                  <span className="hidden text-xs font-semibold sm:inline">
                    {safeActiveLang.name}
                  </span>

                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      langOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {langOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-200/60 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-stone-700/60 dark:bg-stone-900/95"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
                      {t(
                        'header.changeLanguage',
                      )}
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
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                            lang.code === language
                              ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                              : 'text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base">
                              {lang.flag}
                            </span>

                            <span>
                              {lang.name}
                            </span>
                          </span>

                          {lang.code ===
                            language && (
                            <Check size={15} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* ================================================================= */}
          {/* NOTIFICATIONS */}
          {/* ================================================================= */}

          <div
            className="relative"
            ref={notifRef}
          >
            <button
              type="button"
              aria-label={t(
                'header.notifications',
              )}
              aria-expanded={notifOpen}
              aria-haspopup="menu"
              onClick={openNotifications}
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-stone-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-stone-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-stone-700/60 dark:bg-stone-900/95">
                <div className="flex items-center justify-between border-b border-stone-200/60 px-4 py-3 dark:border-stone-700/60">
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {t(
                      'header.notifications',
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      {t(
                        'header.markAllRead',
                      )}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                        <Bell
                          size={17}
                          className="text-stone-400"
                        />
                      </div>

                      <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                        {t(
                          'header.allCaughtUp',
                        )}
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markOneRead(
                              notification.id,
                            )
                          }
                          className={`flex w-full gap-3 border-b border-stone-200/50 px-4 py-3 text-left transition last:border-0 hover:bg-stone-50 dark:border-stone-800/50 dark:hover:bg-white/5 ${
                            notification.read
                              ? ''
                              : 'bg-brand-50/40 dark:bg-brand-950/10'
                          }`}
                        >
                          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                            <Bell
                              size={14}
                              className="text-stone-600 dark:text-stone-300"
                            />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-2">
                              <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                {
                                  notification.title
                                }
                              </span>

                              {!notification.read && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                              )}
                            </span>

                            <span className="mt-0.5 block text-xs leading-5 text-stone-500 dark:text-stone-400">
                              {
                                notification.message
                              }
                            </span>

                            <span className="mt-1 block text-[10px] text-stone-400 dark:text-stone-500">
                              {notification.time}
                            </span>
                          </span>
                        </button>
                      ),
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* THEME */}
          <ThemeToggle />

          {/* ================================================================= */}
          {/* USER MENU */}
          {/* ================================================================= */}

          <div
            className="relative"
            ref={menuRef}
          >
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={openUserMenu}
              className={`group flex items-center gap-2 rounded-full p-1.5 pr-2.5 transition-all duration-200 sm:pr-3 ${
                menuOpen
                  ? 'bg-stone-100 shadow-sm dark:bg-white/10'
                  : 'glass-sm hover:bg-stone-100 dark:hover:bg-white/5'
              }`}
            >
              {/* AVATAR */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name ?? 'User'}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white/60 dark:ring-stone-700/60"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-brand-100 to-brand-200 text-xs font-bold text-brand-700 ring-2 ring-white/60 dark:from-brand-950 dark:to-brand-900 dark:text-brand-300 dark:ring-stone-700/60">
                    {initials}
                  </span>
                )}

                {/* ONLINE INDICATOR */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-stone-900" />
              </div>

              {/* NAME + ROLE */}
              <span className="hidden text-left md:block">
                <span className="block max-w-28 truncate text-xs font-bold text-stone-800 dark:text-stone-100">
                  {user?.name ?? 'User'}
                </span>

                <span className="block text-[10px] font-medium text-stone-500 dark:text-stone-400">
                  {roleLabel}
                </span>
              </span>

              <ChevronDown
                size={14}
                className={`hidden text-stone-400 transition-transform duration-200 md:block ${
                  menuOpen
                    ? 'rotate-180'
                    : ''
                }`}
              />
            </button>

            {/* USER DROPDOWN */}
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-stone-200/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-stone-700/70 dark:bg-stone-900/95"
              >
                {/* ========================================================= */}
                {/* PROFILE HEADER */}
                {/* ========================================================= */}

                <div className="mb-1 rounded-xl bg-stone-50/80 p-3 dark:bg-white/4">
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={
                          user?.name ?? 'User'
                        }
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-100 to-brand-200 text-sm font-bold text-brand-700 dark:from-brand-950 dark:to-brand-900 dark:text-brand-300">
                        {initials}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-stone-900 dark:text-white">
                        {user?.name ?? 'User'}
                      </p>

                      <div className="mt-0.5 flex items-center gap-1.5">
                        <ShieldCheck
                          size={12}
                          className="text-brand-600 dark:text-brand-400"
                        />

                        <p className="truncate text-[11px] font-medium text-stone-500 dark:text-stone-400">
                          {roleLabel ||
                            'User'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* ACCOUNT */}
                {/* ========================================================= */}

                <div className="px-2 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
                  Account
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300">
                    <UserCircle size={17} />
                  </span>

                  <span className="flex-1">
                    <span className="block">
                      {t(
                        'header.myProfile',
                      )}
                    </span>

                    <span className="block text-[10px] font-normal text-stone-400 dark:text-stone-500">
                      View and edit your profile
                    </span>
                  </span>
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300">
                    <Settings size={17} />
                  </span>

                  <span className="flex-1">
                    <span className="block">
                      {t(
                        'header.settings',
                      )}
                    </span>

                    <span className="block text-[10px] font-normal text-stone-400 dark:text-stone-500">
                      Preferences and system settings
                    </span>
                  </span>
                </button>

                {/* HELP */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/help')
                  }}
                  className={menuItemClass}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300">
                    <CircleHelp size={17} />
                  </span>

                  <span className="flex-1">
                    <span className="block">
                      Help & Support
                    </span>

                    <span className="block text-[10px] font-normal text-stone-400 dark:text-stone-500">
                      Get help using the system
                    </span>
                  </span>
                </button>

                {/* ========================================================= */}
                {/* LOGOUT */}
                {/* ========================================================= */}

                <div className="my-2 border-t border-stone-200/70 dark:border-stone-700/70" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 transition group-hover:bg-rose-100 dark:bg-rose-950/30 dark:group-hover:bg-rose-950/50">
                    <LogOut size={17} />
                  </span>

                  <span className="flex-1">
                    <span className="block">
                      {t('header.logOut')}
                    </span>

                    <span className="block text-[10px] font-normal text-rose-400 dark:text-rose-500">
                      Sign out of your account
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

