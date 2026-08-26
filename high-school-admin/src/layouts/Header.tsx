import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Calendar,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Check,
  Loader2,
  Users2,
  UserCog,
  FileText,
  UserCircle,
  Settings,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/common/ThemeToggle'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl'
import { useTranslations } from '@/i18n'

// ============================================================================
// TYPES (unchanged)
// ============================================================================
type SearchResultType = 'student' | 'staff' | 'record'
interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle: string
}
interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

// ============================================================================
// SEARCH (unchanged)
// ============================================================================
const SEARCH_TYPE_ICON: Record<SearchResultType, typeof Users2> = {
  student: Users2,
  staff: UserCog,
  record: FileText,
}
const SEARCH_TYPE_PATH: Record<SearchResultType, string> = {
  student: '/students',
  staff: '/teachers',
  record: '/reports',
}
const MOCK_SEARCH_INDEX: SearchResult[] = [
  { id: 's1', type: 'student', title: 'Sophie Anderson', subtitle: 'Grade 10 · STU-1042' },
  { id: 's2', type: 'student', title: 'Samuel Osei', subtitle: 'Grade 8 · STU-0871' },
  { id: 's3', type: 'student', title: 'Sarah Chen', subtitle: 'Grade 11 · STU-1190' },
  { id: 't1', type: 'staff', title: 'Daniel Kim', subtitle: 'Mathematics Teacher' },
  { id: 't2', type: 'staff', title: 'Maria Lopez', subtitle: 'School Counselor' },
  { id: 'r1', type: 'record', title: 'Attendance Report — September', subtitle: 'Records · Attendance' },
  { id: 'r2', type: 'record', title: 'Grade 9 Report Cards', subtitle: 'Records · Grades' },
]
async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  const q = query.trim().toLowerCase()
  if (!q) return []
  return MOCK_SEARCH_INDEX.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
  )
}

// ============================================================================
// NOTIFICATIONS (unchanged)
// ============================================================================
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'New leave request', message: 'Samuel Osei submitted a leave request for review.', time: '5m ago', read: false },
  { id: 'n2', title: 'Attendance flagged', message: 'Grade 9B has 3 unexcused absences today.', time: '1h ago', read: false },
  { id: 'n3', title: 'Report ready', message: 'The monthly grade report has finished generating.', time: 'Yesterday', read: true },
]

// ============================================================================
// UTILITY (unchanged)
// ============================================================================
function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ============================================================================
// HEADER (with glass-sm added to the outer <header>)
// ============================================================================
export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const mobileSearchWrapRef = useRef<HTMLDivElement>(null)
  const searchRequestId = useRef(0)

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''
  const avatarUrl = (user as { avatarUrl?: string } | null)?.avatarUrl
    ? resolveAssetUrl((user as { avatarUrl?: string }).avatarUrl!)
    : null
  const initials = getInitials(user?.name)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length

  const { language, setLanguage, languages, activeLanguage, t } = useTranslations()
  const today = useMemo(() => {
    return new Date().toLocaleDateString(activeLanguage.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }, [activeLanguage.locale])

  // ==========================================================================
  // SEARCH EFFECT (unchanged)
  // ==========================================================================
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setIsSearching(false)
      setActiveIndex(-1)
      return
    }
    setIsSearching(true)
    const requestId = ++searchRequestId.current
    const timer = setTimeout(async () => {
      const found = await fetchSearchResults(q)
      if (requestId === searchRequestId.current) {
        setResults(found)
        setIsSearching(false)
        setActiveIndex(-1)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelectResult = (result: SearchResult) => {
    setQuery('')
    setResults([])
    setSearchOpen(false)
    setMobileSearchOpen(false)
    navigate(SEARCH_TYPE_PATH[result.type])
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        (event.target as HTMLInputElement).blur()
      }
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      handleSelectResult(results[activeIndex])
    } else if (event.key === 'Escape') {
      setSearchOpen(false);
      (event.target as HTMLInputElement).blur()
    }
  }

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // ==========================================================================
  // OUTSIDE CLICK (unchanged)
  // ==========================================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false)
      if (langRef.current && !langRef.current.contains(target)) setLangOpen(false)
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(target) &&
        mobileSearchWrapRef.current &&
        !mobileSearchWrapRef.current.contains(target)
      ) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderSearchDropdown = () => {
    if (isSearching) {
      return (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl glass-sm p-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <Loader2 size={15} className="animate-spin" />
            {t('header.searching')}
          </div>
        </div>
      )
    }
    if (!query.trim() || !searchOpen) return null
    if (!results.length) {
      return (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl glass-sm p-4 shadow-xl">
          <div className="text-sm text-stone-500 dark:text-stone-400">{t('header.noResults')}</div>
        </div>
      )
    }
    return (
      <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">
        {results.map((result, index) => {
          const Icon = SEARCH_TYPE_ICON[result.type]
          return (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelectResult(result)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                index === activeIndex
                  ? 'bg-stone-100 dark:bg-white/10'
                  : 'hover:bg-stone-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800">
                <Icon size={16} className="text-stone-600 dark:text-stone-300" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {result.title}
                </span>
                <span className="block truncate text-xs text-stone-500 dark:text-stone-400">
                  {result.subtitle}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (

    <header className="sticky top-0 z-30 backdrop-blur-md">
      <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>
          <div ref={searchWrapRef} className="relative hidden sm:block">
            <div className="flex min-w-72 lg:min-w-90 items-center gap-3 rounded-full glass-sm px-4 py-2.5 sm:py-3">
              <Search size={17} className="shrink-0 text-stone-600 dark:text-stone-400" />
              <input
                type="text"
                aria-label={t('header.searchPlaceholder')}
                placeholder={t('header.searchPlaceholder')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full border-0 bg-transparent px-3 text-sm text-stone-900 outline-none placeholder:text-stone-600 dark:text-stone-100 dark:placeholder:text-stone-400"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                  }}
                  className="shrink-0 text-stone-400 transition hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {renderSearchDropdown()}
          </div>
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full glass-sm text-stone-600 sm:hidden dark:text-stone-300"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-2 text-sm text-stone-500 xl:flex dark:text-stone-400">
            <Calendar size={16} />
            <span>{today}</span>
          </div>

          {/* LANGUAGE SWITCHER (unchanged) */}
          {(() => {
            const hasAdditionalLanguages = languages.length > 1
            if (!hasAdditionalLanguages) {
              return (
                <div className="inline-flex h-10 items-center gap-1.5 rounded-full glass-sm px-3 text-stone-600 dark:text-stone-300">
                  <span className="text-base leading-none">{activeLanguage.flag}</span>
                  <span className="hidden text-xs font-semibold uppercase sm:inline">
                    {activeLanguage.code}
                  </span>
                </div>
              )
            }
            return (
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  aria-label={`${t('header.changeLanguage')}: ${activeLanguage.name}`}
                  aria-expanded={langOpen}
                  onClick={() => setLangOpen((open) => !open)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full glass-sm px-3 text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
                >
                  <span className="text-base leading-none">{activeLanguage.flag}</span>
                  <span className="hidden text-xs font-semibold uppercase sm:inline">
                    {activeLanguage.code}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${langOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full z-40 mt-2 w-52 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
                      {t('header.changeLanguage')}
                    </div>
                    <div className="space-y-0.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code)
                            setLangOpen(false)
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-stone-50 dark:hover:bg-white/5 ${
                            lang.code === language
                              ? 'text-brand-700 dark:text-brand-300'
                              : 'text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base leading-none">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                          {lang.code === language && <Check size={15} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label={t('header.notifications')}
              onClick={() => setNotifOpen((open) => !open)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl glass-sm shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-200/60 px-4 py-3 dark:border-stone-700/60">
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {t('header.notifications')}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      {t('header.markAllRead')}
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-stone-500 dark:text-stone-400">
                      {t('header.allCaughtUp')}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markOneRead(notification.id)}
                        className={`flex w-full gap-3 border-b border-stone-200/50 px-4 py-3 text-left transition last:border-0 hover:bg-stone-50 dark:border-stone-800/50 dark:hover:bg-white/5 ${
                          notification.read
                            ? ''
                            : 'bg-brand-50/40 dark:bg-brand-950/10'
                        }`}
                      >
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <Bell size={14} className="text-stone-600 dark:text-stone-300" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                              {notification.title}
                            </span>
                            {!notification.read && (
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-stone-500 dark:text-stone-400">
                            {notification.message}
                          </span>
                          <span className="mt-1 block text-[10px] text-stone-400 dark:text-stone-500">
                            {notification.time}
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* USER MENU */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full glass-sm p-1.5 pr-3 transition hover:bg-stone-100 dark:hover:bg-white/5"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.name ?? 'User'} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {initials}
                </span>
              )}
              <span className="hidden text-left md:block">
                <span className="block max-w-28 truncate text-xs font-bold text-stone-800 dark:text-stone-100">
                  {user?.name ?? 'User'}
                </span>
                <span className="block text-[10px] text-stone-500 dark:text-stone-400">{roleLabel}</span>
              </span>
              <ChevronDown size={14} className="hidden text-stone-400 md:block" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/profile')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-white/5"
                >
                  <UserCircle size={17} />
                  <span>{t('header.myProfile')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-white/5"
                >
                  <Settings size={17} />
                  <span>{t('header.settings')}</span>
                </button>
                <div className="my-1 border-t border-stone-200/60 dark:border-stone-700/60" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut size={17} />
                  <span>{t('header.logOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH (unchanged) */}
      {mobileSearchOpen && (
        <div ref={mobileSearchWrapRef} className="border-t border-stone-200/60 px-4 py-3 sm:hidden dark:border-stone-800/60">
          <div className="relative">
            <div className="flex items-center gap-3 rounded-full glass-sm px-4 py-3">
              <Search size={17} className="shrink-0 text-stone-500" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('header.searchPlaceholder')}
                className="w-full border-0 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setResults([])
                  setMobileSearchOpen(false)
                }}
                className="text-stone-400"
              >
                <X size={16} />
              </button>
            </div>
            {renderSearchDropdown()}
          </div>
        </div>
      )}
    </header>
  )
}