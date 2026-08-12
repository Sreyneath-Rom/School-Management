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

// ============================================================================
// TYPES
// ============================================================================

type SearchResultType =
  | 'student'
  | 'staff'
  | 'record'

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

interface HeaderLanguage {
  code: string
  label: string
  flag: string
  locale: string
}

type TranslationMap = Record<
  string,
  Record<string, string>
>

// ============================================================================
// STORAGE KEYS
// ============================================================================

const LANGUAGE_STORAGE_KEY =
  'app.language'

const LANGUAGES_STORAGE_KEY =
  'translations.languages'

const DATA_STORAGE_KEY =
  'translations.data'

// ============================================================================
// DEFAULT LANGUAGE
// ============================================================================

const DEFAULT_LANGUAGE: HeaderLanguage = {
  code: 'en',
  label: 'English',
  flag: '🇬🇧',
  locale: 'en-US',
}

// ============================================================================
// AUTOMATIC FLAG DETECTION
// ============================================================================

function getFlagFromLanguageCode(
  code: string,
): string {
  const flags: Record<string, string> = {
    en: '🇬🇧',
    km: '🇰🇭',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    th: '🇹🇭',
    vi: '🇻🇳',
    fr: '🇫🇷',
    de: '🇩🇪',
    es: '🇪🇸',
    it: '🇮🇹',
    pt: '🇵🇹',
    ru: '🇷🇺',
    ar: '🇸🇦',
    hi: '🇮🇳',
    id: '🇮🇩',
    ms: '🇲🇾',
    tl: '🇵🇭',
    ph: '🇵🇭',
    tr: '🇹🇷',
    nl: '🇳🇱',
    pl: '🇵🇱',
    uk: '🇺🇦',
    sv: '🇸🇪',
    no: '🇳🇴',
    da: '🇩🇰',
    fi: '🇫🇮',
    cs: '🇨🇿',
    ro: '🇷🇴',
    hu: '🇭🇺',
    el: '🇬🇷',
    he: '🇮🇱',
    my: '🇲🇲',
    lo: '🇱🇦',
    ne: '🇳🇵',
    si: '🇱🇰',
    bn: '🇧🇩',
    ur: '🇵🇰',
    fa: '🇮🇷',
    mn: '🇲🇳',
  }

  return (
    flags[code.toLowerCase()] ??
    '🌐'
  )
}

// ============================================================================
// LOCALE DETECTION
// ============================================================================

function getLocaleFromCode(
  code: string,
): string {
  const locales: Record<
    string,
    string
  > = {
    en: 'en-US',
    km: 'km-KH',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    th: 'th-TH',
    vi: 'vi-VN',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
    it: 'it-IT',
    pt: 'pt-PT',
    ru: 'ru-RU',
    ar: 'ar-SA',
    hi: 'hi-IN',
    id: 'id-ID',
    ms: 'ms-MY',
    tl: 'fil-PH',
    tr: 'tr-TR',
    nl: 'nl-NL',
    pl: 'pl-PL',
    uk: 'uk-UA',
    sv: 'sv-SE',
    no: 'nb-NO',
    da: 'da-DK',
    fi: 'fi-FI',
    cs: 'cs-CZ',
    ro: 'ro-RO',
    hu: 'hu-HU',
    el: 'el-GR',
    he: 'he-IL',
    my: 'my-MM',
    lo: 'lo-LA',
    ne: 'ne-NP',
    si: 'si-LK',
    bn: 'bn-BD',
    ur: 'ur-PK',
    fa: 'fa-IR',
    mn: 'mn-MN',
  }

  return (
    locales[code] ??
    `${code}-${code.toUpperCase()}`
  )
}

// ============================================================================
// LOAD LANGUAGES FROM TRANSLATION MANAGER
// ============================================================================

function loadHeaderLanguages(): HeaderLanguage[] {
  if (
    typeof window ===
    'undefined'
  ) {
    return [DEFAULT_LANGUAGE]
  }

  try {
    const raw =
      window.localStorage.getItem(
        LANGUAGES_STORAGE_KEY,
      )

    if (!raw) {
      return [DEFAULT_LANGUAGE]
    }

    const storedLanguages =
      JSON.parse(raw) as Array<{
        code?: string
        name?: string
        flag?: string
      }>

    if (!Array.isArray(storedLanguages)) {
      return [DEFAULT_LANGUAGE]
    }

    const additionalLanguages =
      storedLanguages
        .filter(
          (language) =>
            Boolean(language.code) &&
            Boolean(language.name) &&
            language.code !== 'en',
        )
        .map((language) => {
          const code =
            language.code!.toLowerCase()

          return {
            code,
            label: language.name!,
            flag:
              language.flag ||
              getFlagFromLanguageCode(
                code,
              ),
            locale:
              getLocaleFromCode(code),
          }
        })

    return [
      DEFAULT_LANGUAGE,
      ...additionalLanguages,
    ]
  } catch {
    return [DEFAULT_LANGUAGE]
  }
}

// ============================================================================
// LOAD TRANSLATION DATA
// ============================================================================

function loadTranslationData(): TranslationMap {
  if (
    typeof window ===
    'undefined'
  ) {
    return {}
  }

  try {
    const raw =
      window.localStorage.getItem(
        DATA_STORAGE_KEY,
      )

    if (!raw) {
      return {}
    }

    const parsed =
      JSON.parse(raw)

    if (
      !parsed ||
      typeof parsed !== 'object'
    ) {
      return {}
    }

    return parsed as TranslationMap
  } catch {
    return {}
  }
}

// ============================================================================
// TRANSLATION KEYS
// ============================================================================

const EN_TRANSLATIONS = {
  'header.searchPlaceholder':
    'Search students, staff, or records...',

  'header.searching':
    'Searching...',

  'header.noResults':
    'No results found',

  'header.notifications':
    'Notifications',

  'header.markAllRead':
    'Mark all read',

  'header.allCaughtUp':
    "You're all caught up.",

  'header.myProfile':
    'My Profile',

  'header.settings':
    'Settings',

  'header.logOut':
    'Log out',

  'header.account':
    'Account',

  'header.changeLanguage':
    'Change language',

  'search.student':
    'Student',

  'search.staff':
    'Staff',

  'search.record':
    'Record',
} as const

type TranslationKey =
  keyof typeof EN_TRANSLATIONS

// ============================================================================
// SEARCH
// ============================================================================

const SEARCH_TYPE_ICON: Record<
  SearchResultType,
  typeof Users2
> = {
  student: Users2,
  staff: UserCog,
  record: FileText,
}

const SEARCH_TYPE_PATH: Record<
  SearchResultType,
  string
> = {
  student: '/students',
  staff: '/teachers',
  record: '/reports',
}

const MOCK_SEARCH_INDEX: SearchResult[] = [
  {
    id: 's1',
    type: 'student',
    title: 'Sophie Anderson',
    subtitle:
      'Grade 10 · STU-1042',
  },
  {
    id: 's2',
    type: 'student',
    title: 'Samuel Osei',
    subtitle:
      'Grade 8 · STU-0871',
  },
  {
    id: 's3',
    type: 'student',
    title: 'Sarah Chen',
    subtitle:
      'Grade 11 · STU-1190',
  },
  {
    id: 't1',
    type: 'staff',
    title: 'Daniel Kim',
    subtitle:
      'Mathematics Teacher',
  },
  {
    id: 't2',
    type: 'staff',
    title: 'Maria Lopez',
    subtitle:
      'School Counselor',
  },
  {
    id: 'r1',
    type: 'record',
    title:
      'Attendance Report — September',
    subtitle:
      'Records · Attendance',
  },
  {
    id: 'r2',
    type: 'record',
    title:
      'Grade 9 Report Cards',
    subtitle:
      'Records · Grades',
  },
]

async function fetchSearchResults(
  query: string,
): Promise<SearchResult[]> {
  await new Promise((resolve) =>
    setTimeout(resolve, 250),
  )

  const q =
    query.trim().toLowerCase()

  if (!q) {
    return []
  }

  return MOCK_SEARCH_INDEX.filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(q) ||
      item.subtitle
        .toLowerCase()
        .includes(q),
  )
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

const INITIAL_NOTIFICATIONS: NotificationItem[] =
  [
    {
      id: 'n1',
      title: 'New leave request',
      message:
        'Samuel Osei submitted a leave request for review.',
      time: '5m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Attendance flagged',
      message:
        'Grade 9B has 3 unexcused absences today.',
      time: '1h ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Report ready',
      message:
        'The monthly grade report has finished generating.',
      time: 'Yesterday',
      read: true,
    },
  ]

// ============================================================================
// UTILITY
// ============================================================================

function getInitials(
  name?: string | null,
): string {
  if (!name) {
    return '?'
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
}

// ============================================================================
// HEADER
// ============================================================================

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void
}) {
  const navigate = useNavigate()

  const { user, logout } =
    useAuth()

  // --------------------------------------------------------------------------
  // General UI
  // --------------------------------------------------------------------------

  const [
    mobileSearchOpen,
    setMobileSearchOpen,
  ] = useState(false)

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false)

  const [
    notifOpen,
    setNotifOpen,
  ] = useState(false)

  const [
    langOpen,
    setLangOpen,
  ] = useState(false)

  // --------------------------------------------------------------------------
  // Refs
  // --------------------------------------------------------------------------

  const menuRef =
    useRef<HTMLDivElement>(null)

  const notifRef =
    useRef<HTMLDivElement>(null)

  const langRef =
    useRef<HTMLDivElement>(null)

  const searchWrapRef =
    useRef<HTMLDivElement>(null)

  const mobileSearchWrapRef =
    useRef<HTMLDivElement>(null)

  const searchRequestId =
    useRef(0)

  // --------------------------------------------------------------------------
  // User
  // --------------------------------------------------------------------------

  const roleLabel = user?.role
    ? user.role
        .charAt(0)
        .toUpperCase() +
      user.role.slice(1)
    : ''

  const avatarUrl = (
    user as {
      avatarUrl?: string
    } | null
  )?.avatarUrl
    ? resolveAssetUrl(
        (
          user as {
            avatarUrl?: string
          }
        ).avatarUrl!,
      )
    : null

  const initials = getInitials(
    user?.name,
  )

  // --------------------------------------------------------------------------
  // Search state
  // --------------------------------------------------------------------------

  const [query, setQuery] =
    useState('')

  const [results, setResults] =
    useState<SearchResult[]>([])

  const [
    isSearching,
    setIsSearching,
  ] = useState(false)

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false)

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(-1)

  // --------------------------------------------------------------------------
  // Notifications
  // --------------------------------------------------------------------------

  const [
    notifications,
    setNotifications,
  ] = useState<
    NotificationItem[]
  >(INITIAL_NOTIFICATIONS)

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length

  // ==========================================================================
  // DYNAMIC LANGUAGES
  // ==========================================================================

  const [
    languages,
    setLanguages,
  ] = useState<HeaderLanguage[]>(
    () => loadHeaderLanguages(),
  )

  const [
    translationData,
    setTranslationData,
  ] = useState<TranslationMap>(
    () =>
      loadTranslationData(),
  )

  const [
    language,
    setLanguage,
  ] = useState<string>(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return 'en'
    }

    const stored =
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      )

    const available =
      loadHeaderLanguages()

    if (
      stored &&
      available.some(
        (lang) =>
          lang.code === stored,
      )
    ) {
      return stored
    }

    return 'en'
  })

  // ==========================================================================
  // SYNC HEADER WITH TRANSLATION MANAGER
  // ==========================================================================

  useEffect(() => {
    const syncLanguages = () => {
      const availableLanguages =
        loadHeaderLanguages()

      const availableTranslations =
        loadTranslationData()

      setLanguages(
        availableLanguages,
      )

      setTranslationData(
        availableTranslations,
      )

      setLanguage(
        (current) => {
          const stillExists =
            availableLanguages.some(
              (lang) =>
                lang.code ===
                current,
            )

          if (stillExists) {
            return current
          }

          window.localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            'en',
          )

          return 'en'
        },
      )
    }

    // Initial sync
    syncLanguages()

    // ------------------------------------------------------------------------
    // IMPORTANT:
    //
    // localStorage "storage" event does NOT fire in the same tab.
    //
    // TranslationManager sends "translations-updated" after adding/removing
    // a language, so listen for that event.
    // ------------------------------------------------------------------------

    const handleTranslationsUpdated =
      () => {
        syncLanguages()
      }

    window.addEventListener(
      'translations-updated',
      handleTranslationsUpdated,
    )

    // Cross-tab changes
    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
          LANGUAGES_STORAGE_KEY ||
        event.key ===
          DATA_STORAGE_KEY ||
        event.key ===
          LANGUAGE_STORAGE_KEY
      ) {
        syncLanguages()
      }
    }

    window.addEventListener(
      'storage',
      handleStorage,
    )

    return () => {
      window.removeEventListener(
        'translations-updated',
        handleTranslationsUpdated,
      )

      window.removeEventListener(
        'storage',
        handleStorage,
      )
    }
  }, [])

  // ==========================================================================
  // CURRENT LANGUAGE
  // ==========================================================================

  const activeLanguage =
    languages.find(
      (lang) =>
        lang.code === language,
    ) ??
    DEFAULT_LANGUAGE

  // ==========================================================================
  // TRANSLATION FUNCTION
  // ==========================================================================

  const t = (
    key: TranslationKey,
    fallback?: string,
  ): string => {
    if (language === 'en') {
      return EN_TRANSLATIONS[key]
    }

    const translated =
      translationData[
        language
      ]?.[key]?.trim()

    return (
      translated ||
      fallback ||
      EN_TRANSLATIONS[key]
    )
  }

  // ==========================================================================
  // SAVE SELECTED LANGUAGE
  // ==========================================================================

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language,
    )

    window.dispatchEvent(
      new Event('language-changed'),
    )
  }, [language])

  // ==========================================================================
  // DATE
  // ==========================================================================

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

  // ==========================================================================
  // SEARCH EFFECT
  // ==========================================================================

  useEffect(() => {
    const q =
      query.trim()

    if (!q) {
      setResults([])
      setIsSearching(false)
      setActiveIndex(-1)
      return
    }

    setIsSearching(true)

    const requestId =
      ++searchRequestId.current

    const timer =
      setTimeout(
        async () => {
          const found =
            await fetchSearchResults(
              q,
            )

          if (
            requestId ===
            searchRequestId.current
          ) {
            setResults(found)
            setIsSearching(false)
            setActiveIndex(-1)
          }
        },
        300,
      )

    return () =>
      clearTimeout(timer)
  }, [query])

  // ==========================================================================
  // SELECT SEARCH RESULT
  // ==========================================================================

  const handleSelectResult = (
    result: SearchResult,
  ) => {
    setQuery('')
    setResults([])
    setSearchOpen(false)
    setMobileSearchOpen(false)

    navigate(
      SEARCH_TYPE_PATH[
        result.type
      ],
    )
  }

  // ==========================================================================
  // SEARCH KEYBOARD
  // ==========================================================================

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!results.length) {
      if (
        event.key === 'Escape'
      ) {
        setSearchOpen(false)

        ;(
          event.target as HTMLInputElement
        ).blur()
      }

      return
    }

    if (
      event.key === 'ArrowDown'
    ) {
      event.preventDefault()

      setActiveIndex(
        (previous) =>
          (previous + 1) %
          results.length,
      )
    } else if (
      event.key === 'ArrowUp'
    ) {
      event.preventDefault()

      setActiveIndex(
        (previous) =>
          previous <= 0
            ? results.length - 1
            : previous - 1,
      )
    } else if (
      event.key === 'Enter' &&
      activeIndex >= 0
    ) {
      event.preventDefault()

      handleSelectResult(
        results[activeIndex],
      )
    } else if (
      event.key === 'Escape'
    ) {
      setSearchOpen(false)

      ;(
        event.target as HTMLInputElement
      ).blur()
    }
  }

  // ==========================================================================
  // NOTIFICATIONS
  // ==========================================================================

  const markOneRead = (
    id: string,
  ) => {
    setNotifications(
      (previous) =>
        previous.map(
          (notification) =>
            notification.id === id
              ? {
                  ...notification,
                  read: true,
                }
              : notification,
        ),
    )
  }

  const markAllRead = () => {
    setNotifications(
      (previous) =>
        previous.map(
          (notification) => ({
            ...notification,
            read: true,
          }),
        ),
    )
  }

  // ==========================================================================
  // OUTSIDE CLICK
  // ==========================================================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node

      if (
        menuRef.current &&
        !menuRef.current.contains(
          target,
        )
      ) {
        setMenuOpen(false)
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(
          target,
        )
      ) {
        setNotifOpen(false)
      }

      if (
        langRef.current &&
        !langRef.current.contains(
          target,
        )
      ) {
        setLangOpen(false)
      }

      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(
          target,
        ) &&
        mobileSearchWrapRef.current &&
        !mobileSearchWrapRef.current.contains(
          target,
        )
      ) {
        setSearchOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  // ==========================================================================
  // SEARCH DROPDOWN
  // ==========================================================================

  const renderSearchDropdown =
    () => {
      if (isSearching) {
        return (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl glass-sm p-4 shadow-xl">
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <Loader2
                size={15}
                className="animate-spin"
              />

              {t(
                'header.searching',
              )}
            </div>
          </div>
        )
      }

      if (
        !query.trim() ||
        !searchOpen
      ) {
        return null
      }

      if (!results.length) {
        return (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl glass-sm p-4 shadow-xl">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              {t(
                'header.noResults',
              )}
            </div>
          </div>
        )
      }

      return (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">
          {results.map(
            (
              result,
              index,
            ) => {
              const Icon =
                SEARCH_TYPE_ICON[
                  result.type
                ]

              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() =>
                    handleSelectResult(
                      result,
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    index ===
                    activeIndex
                      ? 'bg-stone-100 dark:bg-white/10'
                      : 'hover:bg-stone-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800">
                    <Icon
                      size={16}
                      className="text-stone-600 dark:text-stone-300"
                    />
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
            },
          )}
        </div>
      )
    }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <header className="sticky top-0 z-30">

      <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* ====================================================================
            LEFT
            ==================================================================== */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={
              onOpenSidebar
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>

          {/* Desktop search */}
          <div
            ref={searchWrapRef}
            className="relative hidden sm:block"
          >
            <div className="flex min-w-90 items-center gap-3 rounded-full glass-sm px-4 py-3">

              <Search
                size={17}
                className="shrink-0 text-stone-600 dark:text-stone-400"
              />

              <input
                type="text"
                aria-label={t(
                  'header.searchPlaceholder',
                )}
                placeholder={t(
                  'header.searchPlaceholder',
                )}
                value={query}
                onChange={(event) => {
                  setQuery(
                    event.target.value,
                  )

                  setSearchOpen(
                    true,
                  )
                }}
                onFocus={() =>
                  setSearchOpen(
                    true,
                  )
                }
                onKeyDown={
                  handleSearchKeyDown
                }
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

          {/* Mobile search */}
          <button
            type="button"
            onClick={() =>
              setMobileSearchOpen(
                true,
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full glass-sm text-stone-600 sm:hidden dark:text-stone-300"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

        </div>

        {/* ====================================================================
            RIGHT
            ==================================================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* ================================================================
              DATE
              ================================================================ */}

          <div className="hidden items-center gap-2 text-sm text-stone-500 lg:flex dark:text-stone-400">

            <Calendar size={16} />

            <span>
              {today}
            </span>

          </div>

          {/* ================================================================
              DYNAMIC LANGUAGE SWITCHER
              ================================================================ */}

          <div
            className="relative"
            ref={langRef}
          >

            <button
              type="button"
              aria-label={`${t(
                'header.changeLanguage',
              )}: ${
                activeLanguage.label
              }`}
              aria-expanded={
                langOpen
              }
              onClick={() =>
                setLangOpen(
                  (open) =>
                    !open,
                )
              }
              className="inline-flex h-10 items-center gap-1.5 rounded-full glass-sm px-3 text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
            >

              <span className="text-base leading-none">
                {
                  activeLanguage.flag
                }
              </span>

              <span className="hidden text-xs font-semibold uppercase sm:inline">
                {
                  activeLanguage.code
                }
              </span>

              <ChevronDown
                size={13}
                className={`transition-transform ${
                  langOpen
                    ? 'rotate-180'
                    : ''
                }`}
              />

            </button>

            {/* Language dropdown */}
            {langOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-52 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">

                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
                  {t(
                    'header.changeLanguage',
                  )}
                </div>

                <div className="space-y-0.5">

                  {languages.map(
                    (lang) => (
                      <button
                        key={
                          lang.code
                        }
                        type="button"
                        onClick={() => {
                          setLanguage(
                            lang.code,
                          )

                          setLangOpen(
                            false,
                          )
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-stone-50 dark:hover:bg-white/5 ${
                          lang.code ===
                          language
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >

                        <span className="flex items-center gap-2.5">

                          <span className="text-base leading-none">
                            {lang.flag}
                          </span>

                          <span>
                            {
                              lang.label
                            }
                          </span>

                        </span>

                        {lang.code ===
                          language && (
                          <Check
                            size={15}
                          />
                        )}

                      </button>
                    ),
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ================================================================
              NOTIFICATIONS
              ================================================================ */}

          <div
            className="relative"
            ref={notifRef}
          >

            <button
              type="button"
              aria-label={t(
                'header.notifications',
              )}
              onClick={() =>
                setNotifOpen(
                  (open) =>
                    !open,
                )
              }
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
                    {t(
                      'header.notifications',
                    )}
                  </div>

                  {unreadCount >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        markAllRead
                      }
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      {t(
                        'header.markAllRead',
                      )}
                    </button>
                  )}

                </div>

                <div className="max-h-80 overflow-y-auto">

                  {notifications.length ===
                  0 ? (
                    <div className="p-6 text-center text-sm text-stone-500 dark:text-stone-400">
                      {t(
                        'header.allCaughtUp',
                      )}
                    </div>
                  ) : (
                    notifications.map(
                      (
                        notification,
                      ) => (
                        <button
                          key={
                            notification.id
                          }
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
                              {
                                notification.time
                              }
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

          {/* ================================================================
              THEME
              ================================================================ */}

          <ThemeToggle />

          {/* ================================================================
              USER MENU
              ================================================================ */}

          <div
            className="relative"
            ref={menuRef}
          >

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (open) =>
                    !open,
                )
              }
              className="flex items-center gap-2 rounded-full glass-sm p-1.5 pr-3 transition hover:bg-stone-100 dark:hover:bg-white/5"
            >

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={
                    user?.name ??
                    'User'
                  }
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {initials}
                </span>
              )}

              <span className="hidden text-left md:block">

                <span className="block max-w-28 truncate text-xs font-bold text-stone-800 dark:text-stone-100">
                  {user?.name ??
                    'User'}
                </span>

                <span className="block text-[10px] text-stone-500 dark:text-stone-400">
                  {roleLabel}
                </span>

              </span>

              <ChevronDown
                size={14}
                className="hidden text-stone-400 md:block"
              />

            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl glass-sm p-2 shadow-xl">

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(
                      false,
                    )
                    navigate(
                      '/profile',
                    )
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-white/5"
                >
                  <UserCircle
                    size={17}
                  />

                  <span>
                    {t(
                      'header.myProfile',
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(
                      false,
                    )
                    navigate(
                      '/settings',
                    )
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-white/5"
                >
                  <Settings
                    size={17}
                  />

                  <span>
                    {t(
                      'header.settings',
                    )}
                  </span>
                </button>

                <div className="my-1 border-t border-stone-200/60 dark:border-stone-700/60" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(
                      false,
                    )
                    logout()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut
                    size={17}
                  />

                  <span>
                    {t(
                      'header.logOut',
                    )}
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ======================================================================
          MOBILE SEARCH
          ====================================================================== */}

      {mobileSearchOpen && (
        <div
          ref={mobileSearchWrapRef}
          className="border-t border-stone-200/60 px-4 py-3 sm:hidden dark:border-stone-800/60"
        >

          <div className="relative">

            <div className="flex items-center gap-3 rounded-full glass-sm px-4 py-3">

              <Search
                size={17}
                className="shrink-0 text-stone-500"
              />

              <input
                autoFocus
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(
                    event.target.value,
                  )
                  setSearchOpen(
                    true,
                  )
                }}
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder={t(
                  'header.searchPlaceholder',
                )}
                className="w-full border-0 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500 dark:text-stone-100"
              />

              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setResults([])
                  setMobileSearchOpen(
                    false,
                  )
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