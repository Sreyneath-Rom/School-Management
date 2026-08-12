import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  Languages,
  Plus,
  X,
  Search,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
} from 'lucide-react'

import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'

// ============================================================================
// TYPES
// ============================================================================

interface StringEntry {
  key: string
  category: string
  en: string
}

interface LanguageDef {
  code: string
  name: string
  flag: string
}

type TranslationMap = Record<
  string,
  Record<string, string>
>

// ============================================================================
// STORAGE KEYS
// ============================================================================

const LANGUAGES_STORAGE_KEY =
  'translations.languages'

const DATA_STORAGE_KEY =
  'translations.data'

const LANGUAGE_STORAGE_KEY =
  'app.language'

// ============================================================================
// DEFAULT LANGUAGE
// ============================================================================

const DEFAULT_LANG: LanguageDef = {
  code: 'en',
  name: 'English',
  flag: '🇬🇧',
}

// ============================================================================
// TRANSLATION STRINGS
// ============================================================================

const STRINGS: StringEntry[] = [
  // --------------------------------------------------------------------------
  // Header
  // --------------------------------------------------------------------------

  {
    key: 'header.searchPlaceholder',
    category: 'Header',
    en: 'Search students, staff, or records...',
  },
  {
    key: 'header.searching',
    category: 'Header',
    en: 'Searching...',
  },
  {
    key: 'header.noResults',
    category: 'Header',
    en: 'No results found',
  },
  {
    key: 'header.notifications',
    category: 'Header',
    en: 'Notifications',
  },
  {
    key: 'header.markAllRead',
    category: 'Header',
    en: 'Mark all read',
  },
  {
    key: 'header.allCaughtUp',
    category: 'Header',
    en: "You're all caught up.",
  },
  {
    key: 'header.myProfile',
    category: 'Header',
    en: 'My Profile',
  },
  {
    key: 'header.settings',
    category: 'Header',
    en: 'Settings',
  },
  {
    key: 'header.logOut',
    category: 'Header',
    en: 'Log out',
  },
  {
    key: 'header.account',
    category: 'Header',
    en: 'Account',
  },
  {
    key: 'header.changeLanguage',
    category: 'Header',
    en: 'Change language',
  },

  // --------------------------------------------------------------------------
  // Search
  // --------------------------------------------------------------------------

  {
    key: 'search.student',
    category: 'Search',
    en: 'Student',
  },
  {
    key: 'search.staff',
    category: 'Search',
    en: 'Staff',
  },
  {
    key: 'search.record',
    category: 'Search',
    en: 'Record',
  },

  // --------------------------------------------------------------------------
  // Sidebar
  // --------------------------------------------------------------------------

  {
    key: 'sidebar.dashboard',
    category: 'Sidebar',
    en: 'Dashboard',
  },
  {
    key: 'sidebar.setup',
    category: 'Sidebar',
    en: 'Setup',
  },
  {
    key: 'sidebar.schoolSetup',
    category: 'Sidebar',
    en: 'School Setup',
  },
  {
    key: 'sidebar.rolesPermissions',
    category: 'Sidebar',
    en: 'Roles & Permissions',
  },
  {
    key: 'sidebar.subjects',
    category: 'Sidebar',
    en: 'Subjects',
  },
  {
    key: 'sidebar.schedules',
    category: 'Sidebar',
    en: 'Schedules',
  },
  {
    key: 'sidebar.users',
    category: 'Sidebar',
    en: 'Users',
  },
  {
    key: 'sidebar.academic',
    category: 'Sidebar',
    en: 'Academic',
  },
  {
    key: 'sidebar.classes',
    category: 'Sidebar',
    en: 'Classes',
  },
  {
    key: 'sidebar.lessons',
    category: 'Sidebar',
    en: 'Lessons',
  },
  {
    key: 'sidebar.homework',
    category: 'Sidebar',
    en: 'Homework',
  },
  {
    key: 'sidebar.quizTests',
    category: 'Sidebar',
    en: 'Quiz & Tests',
  },
  {
    key: 'sidebar.grades',
    category: 'Sidebar',
    en: 'Grades',
  },
  {
    key: 'sidebar.students',
    category: 'Sidebar',
    en: 'Students',
  },
  {
    key: 'sidebar.studentList',
    category: 'Sidebar',
    en: 'Student List',
  },
  {
    key: 'sidebar.attendance',
    category: 'Sidebar',
    en: 'Attendance',
  },
  {
    key: 'sidebar.leaveRequests',
    category: 'Sidebar',
    en: 'Leave Requests',
  },
  {
    key: 'sidebar.teachers',
    category: 'Sidebar',
    en: 'Teachers',
  },
  {
    key: 'sidebar.teacherList',
    category: 'Sidebar',
    en: 'Teacher List',
  },
  {
    key: 'sidebar.teacherAssignments',
    category: 'Sidebar',
    en: 'Teacher Assignments',
  },
  {
    key: 'sidebar.communication',
    category: 'Sidebar',
    en: 'Communication',
  },
  {
    key: 'sidebar.announcements',
    category: 'Sidebar',
    en: 'Announcements',
  },
  {
    key: 'sidebar.notifications',
    category: 'Sidebar',
    en: 'Notifications',
  },
  {
    key: 'sidebar.reports',
    category: 'Sidebar',
    en: 'Reports',
  },
  {
    key: 'sidebar.attendanceReport',
    category: 'Sidebar',
    en: 'Attendance Report',
  },
  {
    key: 'sidebar.gradeReport',
    category: 'Sidebar',
    en: 'Grade Report',
  },
  {
    key: 'sidebar.studentReport',
    category: 'Sidebar',
    en: 'Student Report',
  },
  {
    key: 'sidebar.teacherReport',
    category: 'Sidebar',
    en: 'Teacher Report',
  },

  // --------------------------------------------------------------------------
  // Common
  // --------------------------------------------------------------------------

  {
    key: 'common.save',
    category: 'Common',
    en: 'Save',
  },
  {
    key: 'common.cancel',
    category: 'Common',
    en: 'Cancel',
  },
  {
    key: 'common.delete',
    category: 'Common',
    en: 'Delete',
  },
  {
    key: 'common.edit',
    category: 'Common',
    en: 'Edit',
  },
  {
    key: 'common.discard',
    category: 'Common',
    en: 'Discard',
  },
  {
    key: 'common.saving',
    category: 'Common',
    en: 'Saving...',
  },
  {
    key: 'common.loading',
    category: 'Common',
    en: 'Loading...',
  },
  {
    key: 'common.yes',
    category: 'Common',
    en: 'Yes',
  },
  {
    key: 'common.no',
    category: 'Common',
    en: 'No',
  },
  {
    key: 'common.close',
    category: 'Common',
    en: 'Close',
  },
  {
    key: 'common.confirm',
    category: 'Common',
    en: 'Confirm',
  },

  // --------------------------------------------------------------------------
  // Footer
  // --------------------------------------------------------------------------

  {
    key: 'footer.rights',
    category: 'Footer',
    en: 'All rights reserved.',
  },
  {
    key: 'footer.systemName',
    category: 'Footer',
    en: 'School Management System',
  },
]

// ============================================================================
// CATEGORIES
// ============================================================================

const CATEGORIES = Array.from(
  new Set(
    STRINGS.map(
      (item) => item.category,
    ),
  ),
)

// ============================================================================
// AUTOMATIC FLAG DETECTION
// ============================================================================

function getFlagFromLanguageCode(
  code: string,
): string {
  const flags: Record<string, string> = {
    // Europe
    en: '🇬🇧',
    fr: '🇫🇷',
    de: '🇩🇪',
    es: '🇪🇸',
    it: '🇮🇹',
    pt: '🇵🇹',
    nl: '🇳🇱',
    ru: '🇷🇺',
    uk: '🇺🇦',
    pl: '🇵🇱',
    ro: '🇷🇴',
    hu: '🇭🇺',
    cs: '🇨🇿',
    sk: '🇸🇰',
    bg: '🇧🇬',
    el: '🇬🇷',
    sv: '🇸🇪',
    no: '🇳🇴',
    da: '🇩🇰',
    fi: '🇫🇮',
    is: '🇮🇸',
    ga: '🇮🇪',

    // Asia
    km: '🇰🇭',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    th: '🇹🇭',
    vi: '🇻🇳',
    my: '🇲🇲',
    id: '🇮🇩',
    ms: '🇲🇾',
    tl: '🇵🇭',
    ph: '🇵🇭',
    hi: '🇮🇳',
    bn: '🇧🇩',
    ur: '🇵🇰',
    ne: '🇳🇵',
    si: '🇱🇰',
    lo: '🇱🇦',
    mn: '🇲🇳',

    // Middle East
    ar: '🇸🇦',
    he: '🇮🇱',
    fa: '🇮🇷',
    tr: '🇹🇷',

    // Americas
    ca: '🇨🇦',
    mx: '🇲🇽',
    br: '🇧🇷',

    // Oceania
    mi: '🇳🇿',
  }

  return (
    flags[code.toLowerCase()] ??
    '🌐'
  )
}

// ============================================================================
// LANGUAGE CODE GENERATOR
// ============================================================================

function slugifyCode(
  input: string,
): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .slice(0, 5) || 'xx'
  )
}

// ============================================================================
// LANGUAGE CODE VALIDATION
// ============================================================================

function isValidLanguageCode(
  code: string,
): boolean {
  return /^[a-z]{2,5}$/i.test(code)
}

// ============================================================================
// LOAD LANGUAGES
// ============================================================================

function loadLanguages(): LanguageDef[] {
  if (
    typeof window ===
    'undefined'
  ) {
    return []
  }

  try {
    const raw =
      window.localStorage.getItem(
        LANGUAGES_STORAGE_KEY,
      )

    if (!raw) {
      return []
    }

    const parsed =
      JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (
          language,
        ): language is LanguageDef =>
          language &&
          typeof language.code ===
            'string' &&
          typeof language.name ===
            'string',
      )
      .map((language) => ({
        code:
          language.code
            .toLowerCase(),
        name: language.name,

        // Always calculate flag again.
        // This fixes old languages that
        // were saved without a flag.
        flag:
          getFlagFromLanguageCode(
            language.code,
          ),
      }))
  } catch {
    return []
  }
}

// ============================================================================
// LOAD TRANSLATIONS
// ============================================================================

function loadData(): TranslationMap {
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
// COMPONENT
// ============================================================================

export default function TranslationManager() {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  const [languages, setLanguages] =
    useState<LanguageDef[]>(() =>
      loadLanguages(),
    )

  const [data, setData] =
    useState<TranslationMap>(() =>
      loadData(),
    )

  const [activeCode, setActiveCode] =
    useState('en')

  const [search, setSearch] =
    useState('')

  const [
    openCategories,
    setOpenCategories,
  ] = useState<Set<string>>(
    new Set(CATEGORIES),
  )

  const [
    showAddForm,
    setShowAddForm,
  ] = useState(false)

  const [newName, setNewName] =
    useState('')

  const [newCode, setNewCode] =
    useState('')

  const [formError, setFormError] =
    useState<string | null>(null)

  const [
    savedPulse,
    setSavedPulse,
  ] = useState(false)

  const saveTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null)

  const isFirstDataEffect =
    useRef(true)

  // --------------------------------------------------------------------------
  // All languages
  // --------------------------------------------------------------------------

  const allLanguages = useMemo(
    () => [
      DEFAULT_LANG,
      ...languages.filter(
        (language) =>
          language.code !== 'en',
      ),
    ],
    [languages],
  )

  // --------------------------------------------------------------------------
  // Save languages
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    window.localStorage.setItem(
      LANGUAGES_STORAGE_KEY,
      JSON.stringify(languages),
    )

    // IMPORTANT:
    // Header listens for this event.
    window.dispatchEvent(
      new Event(
        'translations-updated',
      ),
    )
  }, [languages])

  // --------------------------------------------------------------------------
  // Save translations
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    window.localStorage.setItem(
      DATA_STORAGE_KEY,
      JSON.stringify(data),
    )

    // IMPORTANT:
    // Header listens for this event.
    window.dispatchEvent(
      new Event(
        'translations-updated',
      ),
    )

    if (isFirstDataEffect.current) {
      isFirstDataEffect.current =
        false
      return
    }

    setSavedPulse(true)

    if (saveTimer.current) {
      clearTimeout(
        saveTimer.current,
      )
    }

    saveTimer.current =
      setTimeout(() => {
        setSavedPulse(false)
      }, 1200)

    return () => {
      if (saveTimer.current) {
        clearTimeout(
          saveTimer.current,
        )
      }
    }
  }, [data])

  // --------------------------------------------------------------------------
  // Keep active language valid
  // --------------------------------------------------------------------------

  useEffect(() => {
    const exists =
      allLanguages.some(
        (language) =>
          language.code ===
          activeCode,
      )

    if (!exists) {
      setActiveCode('en')
    }
  }, [
    allLanguages,
    activeCode,
  ])

  // --------------------------------------------------------------------------
  // Listen for external changes
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (
      typeof window ===
      'undefined'
    ) {
      return
    }

    const sync = () => {
      const nextLanguages = loadLanguages()
      const nextData = loadData()

      // Only update state when content actually changed.
      // Prevents the infinite loop caused by new object references
      // from JSON.parse on every 'translations-updated' event.
      setLanguages((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(nextLanguages)) {
          return prev
        }
        return nextLanguages
      })

      setData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(nextData)) {
          return prev
        }
        return nextData
      })
    }

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
          LANGUAGES_STORAGE_KEY ||
        event.key ===
          DATA_STORAGE_KEY
      ) {
        sync()
      }
    }

    const handleCustomUpdate =
      () => {
        sync()
      }

    window.addEventListener(
      'storage',
      handleStorage,
    )

    window.addEventListener(
      'translations-updated',
      handleCustomUpdate,
    )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage,
      )

      window.removeEventListener(
        'translations-updated',
        handleCustomUpdate,
      )
    }
  }, [])

  // --------------------------------------------------------------------------
  // Active language
  // --------------------------------------------------------------------------

  const activeLanguage =
    allLanguages.find(
      (language) =>
        language.code ===
        activeCode,
    ) ?? DEFAULT_LANG

  const isDefaultActive =
    activeCode === 'en'

  // --------------------------------------------------------------------------
  // Filter strings
  // --------------------------------------------------------------------------

  const filteredStrings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return STRINGS
      }

      return STRINGS.filter(
        (item) =>
          item.key
            .toLowerCase()
            .includes(query) ||
          item.en
            .toLowerCase()
            .includes(query),
      )
    }, [search])

  // --------------------------------------------------------------------------
  // Group strings
  // --------------------------------------------------------------------------

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      StringEntry[]
    >()

    filteredStrings.forEach(
      (entry) => {
        if (
          !map.has(
            entry.category,
          )
        ) {
          map.set(
            entry.category,
            [],
          )
        }

        map
          .get(entry.category)!
          .push(entry)
      },
    )

    return map
  }, [filteredStrings])

  // --------------------------------------------------------------------------
  // Translation progress
  // --------------------------------------------------------------------------

  const translatedCount =
    useMemo(() => {
      if (isDefaultActive) {
        return STRINGS.length
      }

      const langData =
        data[activeCode] ?? {}

      return STRINGS.filter(
        (entry) =>
          Boolean(
            langData[
              entry.key
            ]?.trim(),
          ),
      ).length
    }, [
      data,
      activeCode,
      isDefaultActive,
    ])

  const progress =
    STRINGS.length > 0
      ? Math.round(
          (translatedCount /
            STRINGS.length) *
            100,
        )
      : 0

  // --------------------------------------------------------------------------
  // Toggle category
  // --------------------------------------------------------------------------

  const toggleCategory = (
    category: string,
  ) => {
    setOpenCategories(
      (previous) => {
        const next =
          new Set(previous)

        if (
          next.has(category)
        ) {
          next.delete(category)
        } else {
          next.add(category)
        }

        return next
      },
    )
  }

  // --------------------------------------------------------------------------
  // Expand all
  // --------------------------------------------------------------------------

  const openAllCategories =
    () => {
      setOpenCategories(
        new Set(CATEGORIES),
      )
    }

  // --------------------------------------------------------------------------
  // Collapse all
  // --------------------------------------------------------------------------

  const closeAllCategories =
    () => {
      setOpenCategories(
        new Set(),
      )
    }

  // --------------------------------------------------------------------------
  // Update translation
  // --------------------------------------------------------------------------

  const updateTranslation = (
    key: string,
    value: string,
  ) => {
    if (isDefaultActive) {
      return
    }

    setData((previous) => ({
      ...previous,

      [activeCode]: {
        ...(previous[
          activeCode
        ] ?? {}),
        [key]: value,
      },
    }))
  }

  // --------------------------------------------------------------------------
  // Add language
  // --------------------------------------------------------------------------

  const handleAddLanguage =
    () => {
      const name =
        newName.trim()

      if (!name) {
        setFormError(
          'Enter a language name.',
        )
        return
      }

      const code =
        slugifyCode(
          newCode || name,
        ).toLowerCase()

      if (
        !isValidLanguageCode(
          code,
        )
      ) {
        setFormError(
          'Language code must contain 2–5 letters.',
        )
        return
      }

      if (code === 'en') {
        setFormError(
          'English is already the default language.',
        )
        return
      }

      if (
        allLanguages.some(
          (language) =>
            language.code ===
            code,
        )
      ) {
        setFormError(
          'That language code is already in use.',
        )
        return
      }

      if (
        allLanguages.some(
          (language) =>
            language.name
              .toLowerCase() ===
            name.toLowerCase(),
        )
      ) {
        setFormError(
          'That language already exists.',
        )
        return
      }

      // ----------------------------------------------------------------------
      // AUTOMATIC FLAG
      // ----------------------------------------------------------------------

      const flag =
        getFlagFromLanguageCode(
          code,
        )

      const language: LanguageDef =
        {
          code,
          name,
          flag,
        }

      // ----------------------------------------------------------------------
      // ADD LANGUAGE
      // ----------------------------------------------------------------------

      setLanguages(
        (previous) => [
          ...previous,
          language,
        ],
      )

      // ----------------------------------------------------------------------
      // CREATE EMPTY TRANSLATION DATA
      // ----------------------------------------------------------------------

      setData((previous) => ({
        ...previous,

        [code]:
          previous[code] ??
          {},
      }))

      // ----------------------------------------------------------------------
      // SELECT NEW LANGUAGE
      // ----------------------------------------------------------------------

      setActiveCode(code)

      // ----------------------------------------------------------------------
      // SAVE SELECTED LANGUAGE
      // ----------------------------------------------------------------------

      if (
        typeof window !==
        'undefined'
      ) {
        window.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          code,
        )

        window.dispatchEvent(
          new Event(
            'language-changed',
          ),
        )
      }

      // ----------------------------------------------------------------------
      // CLEAR FORM
      // ----------------------------------------------------------------------

      setNewName('')
      setNewCode('')
      setFormError(null)
      setShowAddForm(false)

      // ----------------------------------------------------------------------
      // IMMEDIATELY UPDATE HEADER
      // ----------------------------------------------------------------------

      if (
        typeof window !==
        'undefined'
      ) {
        window.dispatchEvent(
          new Event(
            'translations-updated',
          ),
        )
      }
    }

  // --------------------------------------------------------------------------
  // Remove language
  // --------------------------------------------------------------------------

  const handleRemoveLanguage = (
    code: string,
  ) => {
    if (code === 'en') {
      return
    }

    const language =
      allLanguages.find(
        (item) =>
          item.code === code,
      )

    if (!language) {
      return
    }

    const confirmed =
      window.confirm(
        `Remove ${language.name}? All translations for this language will be deleted.`,
      )

    if (!confirmed) {
      return
    }

    // ------------------------------------------------------------------------
    // Remove language
    // ------------------------------------------------------------------------

    setLanguages(
      (previous) =>
        previous.filter(
          (item) =>
            item.code !== code,
        ),
    )

    // ------------------------------------------------------------------------
    // Remove translations
    // ------------------------------------------------------------------------

    setData((previous) => {
      const next = {
        ...previous,
      }

      delete next[code]

      return next
    })

    // ------------------------------------------------------------------------
    // Return to English
    // ------------------------------------------------------------------------

    if (activeCode === code) {
      setActiveCode('en')
    }

    // ------------------------------------------------------------------------
    // Reset Header language if needed
    // ------------------------------------------------------------------------

    if (
      typeof window !==
      'undefined'
    ) {
      const currentLanguage =
        window.localStorage.getItem(
          LANGUAGE_STORAGE_KEY,
        )

      if (
        currentLanguage ===
        code
      ) {
        window.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          'en',
        )

        window.dispatchEvent(
          new Event(
            'language-changed',
          ),
        )
      }

      // ----------------------------------------------------------------------
      // IMMEDIATELY UPDATE HEADER
      // ----------------------------------------------------------------------

      window.dispatchEvent(
        new Event(
          'translations-updated',
        ),
      )
    }
  }

  // --------------------------------------------------------------------------
  // Cancel add
  // --------------------------------------------------------------------------

  const cancelAddLanguage =
    () => {
      setShowAddForm(false)
      setNewName('')
      setNewCode('')
      setFormError(null)
    }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">

      {/* ======================================================================
          PAGE HEADING
          ====================================================================== */}

      <PageHeading
        title="Translations"
        subtitle="Manage the default English text and add other languages for the system."
      />

      {/* ======================================================================
          LANGUAGE BAR
          ====================================================================== */}

      <div className="rounded-[28px] glass-sm p-6">

        <div className="flex flex-wrap items-center gap-2">

          {allLanguages.map(
            (language) => {
              const isActive =
                language.code ===
                activeCode

              return (
                <div
                  key={
                    language.code
                  }
                  className="relative"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setActiveCode(
                        language.code,
                      )
                    }
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'glass text-brand-700 dark:text-brand-300'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                    }`}
                  >

                    <span className="text-base leading-none">
                      {
                        language.flag
                      }
                    </span>

                    <span>
                      {
                        language.name
                      }
                    </span>

                    {language.code ===
                      'en' && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                        Default
                      </span>
                    )}

                  </button>

                  {/* Remove language */}

                  {language.code !==
                    'en' && (
                    <button
                      type="button"
                      aria-label={`Remove ${language.name}`}
                      onClick={() =>
                        handleRemoveLanguage(
                          language.code,
                        )
                      }
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-stone-600 transition hover:bg-rose-100 hover:text-rose-600 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                    >
                      <X
                        size={11}
                      />
                    </button>
                  )}

                </div>
              )
            },
          )}

          {/* Add language */}

          {!showAddForm && (
            <Button
              variant="glass"
              onClick={() =>
                setShowAddForm(
                  true,
                )
              }
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm"
            >
              <Plus size={15} />
              Add Language
            </Button>
          )}

        </div>

        {/* ====================================================================
            ADD LANGUAGE FORM
            ==================================================================== */}

        {showAddForm && (
          <div className="mt-5 rounded-3xl border border-dashed border-stone-200 p-5 dark:border-stone-700">

            <div className="mb-4">

              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Add new language
              </div>

              <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                The flag will be detected automatically from the language code.
              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">

              {/* Language name */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  Language name
                </label>

                <input
                  type="text"
                  value={newName}
                  onChange={(
                    event,
                  ) =>
                    setNewName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="e.g. Khmer"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />

              </div>

              {/* Language code */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  Language code
                </label>

                <input
                  type="text"
                  value={newCode}
                  onChange={(
                    event,
                  ) =>
                    setNewCode(
                      event.target
                        .value
                        .toLowerCase()
                        .replace(
                          /[^a-z]/g,
                          '',
                        )
                        .slice(
                          0,
                          5,
                        ),
                    )
                  }
                  placeholder="km"
                  maxLength={5}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />

              </div>

              {/* Buttons */}

              <div className="flex items-end gap-2">

                <Button
                  variant="solid"
                  onClick={
                    handleAddLanguage
                  }
                >
                  Add
                </Button>

                <Button
                  variant="glass"
                  onClick={
                    cancelAddLanguage
                  }
                >
                  Cancel
                </Button>

              </div>

            </div>

            {/* Automatic flag preview */}

            {newCode.trim() && (
              <div className="mt-4 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">

                <span>
                  Flag:
                </span>

                <span className="text-xl">
                  {getFlagFromLanguageCode(
                    newCode,
                  )}
                </span>

                <span className="text-xs">
                  Automatically detected
                </span>

              </div>
            )}

            {/* Error */}

            {formError && (
              <div className="mt-3 text-sm text-rose-600 dark:text-rose-400">
                {formError}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================================
          PROGRESS + SEARCH
          ====================================================================== */}

      <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-6 sm:flex-row sm:items-center sm:justify-between">

        {/* Progress */}

        <div className="flex-1">

          <div className="flex items-center justify-between text-sm font-medium text-stone-700 dark:text-stone-300">

            <span className="flex items-center gap-2">

              <Languages
                size={16}
                className="text-brand-600 dark:text-brand-400"
              />

              {isDefaultActive
                ? `${STRINGS.length} default strings`
                : `${activeLanguage.name} — ${translatedCount}/${STRINGS.length} translated`}

            </span>

            {/* Saved */}

            <span
              className={`flex items-center gap-1 transition-opacity ${
                savedPulse
                  ? 'opacity-100 text-emerald-600 dark:text-emerald-400'
                  : 'opacity-0'
              }`}
            >
              <Check size={14} />
              Saved
            </span>

          </div>

          {!isDefaultActive && (
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">

              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>
          )}

        </div>

        {/* Search */}

        <div className="flex items-center gap-2 rounded-2xl glass-sm px-4 py-2.5 sm:w-72">

          <Search
            size={16}
            className="shrink-0 text-stone-500 dark:text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Filter strings..."
            className="w-full border-0 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500 dark:text-stone-100 dark:placeholder:text-stone-400"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch('')
              }
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X size={14} />
            </button>
          )}

        </div>

      </div>

      {/* ======================================================================
          CATEGORY CONTROLS
          ====================================================================== */}

      <div className="flex items-center justify-end gap-2">

        <button
          type="button"
          onClick={
            openAllCategories
          }
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        >
          Expand all
        </button>

        <button
          type="button"
          onClick={
            closeAllCategories
          }
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        >
          Collapse all
        </button>

      </div>

      {/* ======================================================================
          TRANSLATION LIST
          ====================================================================== */}

      <div className="space-y-4">

        {CATEGORIES.filter(
          (category) =>
            grouped.has(category),
        ).map((category) => {

          const entries =
            grouped.get(
              category,
            ) ?? []

          const isOpen =
            openCategories.has(
              category,
            )

          return (
            <div
              key={category}
              className="overflow-hidden rounded-[28px] glass-sm"
            >

              {/* Category header */}

              <button
                type="button"
                onClick={() =>
                  toggleCategory(
                    category,
                  )
                }
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >

                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">

                  {category}

                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    {
                      entries.length
                    }
                  </span>

                </span>

                {isOpen ? (
                  <ChevronDown
                    size={16}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                  />
                )}

              </button>

              {/* Category content */}

              {isOpen && (
                <div className="divide-y divide-stone-200/60 border-t border-stone-200/60 dark:divide-stone-700/60 dark:border-stone-700/60">

                  {entries.map(
                    (entry) => {

                      const value =
                        isDefaultActive
                          ? entry.en
                          : data[
                              activeCode
                            ]?.[
                              entry.key
                            ] ?? ''

                      return (
                        <div
                          key={
                            entry.key
                          }
                          className="grid gap-3 px-6 py-4 sm:grid-cols-2 sm:items-center"
                        >

                          {/* Source */}

                          <div className="min-w-0">

                            <div className="truncate font-mono text-xs text-stone-400 dark:text-stone-500">
                              {
                                entry.key
                              }
                            </div>

                            <div className="mt-0.5 truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                              {
                                entry.en
                              }
                            </div>

                          </div>

                          {/* Translation */}

                          <div className="flex items-center gap-2">

                            <Globe
                              size={14}
                              className="shrink-0 text-stone-400 dark:text-stone-500"
                            />

                            <input
                              type="text"
                              value={
                                value
                              }
                              disabled={
                                isDefaultActive
                              }
                              onChange={(
                                event,
                              ) =>
                                updateTranslation(
                                  entry.key,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder={
                                isDefaultActive
                                  ? undefined
                                  : `Translate to ${activeLanguage.name}...`
                              }
                              className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition ${
                                isDefaultActive
                                  ? 'cursor-not-allowed border-stone-100 bg-stone-50 text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-500'
                                  : 'border-stone-200 bg-white text-stone-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100'
                              }`}
                            />

                          </div>

                        </div>
                      )
                    },
                  )}

                </div>
              )}

            </div>
          )
        })}

        {/* No results */}

        {filteredStrings.length ===
          0 && (
          <div className="rounded-[28px] glass-sm p-10 text-center text-sm text-stone-500 dark:text-stone-400">
            No strings match "
            {search}".
          </div>
        )}

      </div>

    </div>
  )
}