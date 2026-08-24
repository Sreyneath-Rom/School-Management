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
import {
  STRINGS,
  CATEGORIES,
  getFlagFromLanguageCode,
  slugifyCode,
  isValidLanguageCode,
  loadLanguages,
  loadTranslationData as loadData,
  saveLanguages,
  saveTranslationData,
  saveActiveLanguageCode,
  subscribeToTranslationChanges,
  DEFAULT_LANGUAGE as DEFAULT_LANG,
  LANGUAGE_STORAGE_KEY,
  BUILT_IN_LANGUAGES,
  type LanguageDef,
  type TranslationMap,
  type StringEntry,
} from '@/i18n'
import { languagesService } from '@/services/languagesService'
import { translationsService, type AutoTranslateEntry } from '@/services/translationsService'
import { ApiError } from '@/lib/apiClient'

// How long to wait after the last keystroke in a translation field before
// sending the change to the server. Keeps typing snappy (state updates are
// local/instant) while avoiding a network request per character.
const TRANSLATION_SYNC_DEBOUNCE_MS = 600

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
  // Server sync status
  // --------------------------------------------------------------------------

  // Tracks whether the *current* in-memory state (languages + data) reflects
  // what's on the server, so add/remove/edit only fire once we know we're
  // not about to stomp on data we haven't loaded yet.
  const [isLoaded, setIsLoaded] =
    useState(false)

  const [loadError, setLoadError] =
    useState<string | null>(null)

  const [translationSyncError, setTranslationSyncError] =
    useState<string | null>(null)

  const pendingEditsRef = useRef<{
    code: string
    changes: Record<string, string>
  } | null>(null)

  const syncTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)

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
    // saveLanguages() persists to localStorage and dispatches
    // TRANSLATIONS_UPDATED_EVENT, which Header listens for.
    saveLanguages(languages)
  }, [languages])

  // --------------------------------------------------------------------------
  // Save translations
  // --------------------------------------------------------------------------

  useEffect(() => {
    // saveTranslationData() persists to localStorage and dispatches
    // TRANSLATIONS_UPDATED_EVENT, which Header listens for.
    saveTranslationData(data)

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
  // Load languages + translations from the server on mount.
  //
  // The initial state above (loadLanguages()/loadData()) comes from the
  // localStorage cache so the page isn't blank while this request is in
  // flight. Once it resolves, server data replaces it as the source of
  // truth. add/remove/edit handlers below refuse to fire until this
  // completes, so a slow first load can't be raced by an edit that then
  // gets silently overwritten when the fetch finally lands.
  // --------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false

    async function loadFromServer() {
      try {
        const records = await languagesService.list()
        const nextLanguages: LanguageDef[] = records.map((record) => ({
          code: record.code.toLowerCase(),
          name: record.name,
          flag: getFlagFromLanguageCode(record.code),
        }))

        const entries = await Promise.all(
          nextLanguages.map(async (lang) => {
            try {
              return [lang.code, await translationsService.get(lang.code)] as const
            } catch {
              return [lang.code, {}] as const
            }
          }),
        )

        if (cancelled) return

        const nextData: TranslationMap = Object.fromEntries(entries)

        setLanguages(nextLanguages)
        setData(nextData)
        setLoadError(null)
      } catch (error) {
        if (cancelled) return
        setLoadError(
          error instanceof ApiError
            ? `Couldn't load translations from the server (${error.status}). Showing your locally cached copy — changes won't be saved until this is resolved.`
            : "Couldn't reach the server. Showing your locally cached copy — changes won't be saved until you're back online.",
        )
      } finally {
        if (!cancelled) setIsLoaded(true)
      }
    }

    loadFromServer()

    return () => {
      cancelled = true
    }
  }, [])

  // --------------------------------------------------------------------------
  // Listen for external changes
  // --------------------------------------------------------------------------

  useEffect(() => {
    const sync = () => {
      const nextLanguages = loadLanguages()
      const nextData = loadData()

      // Only update state when content actually changed.
      // Prevents the infinite loop caused by new object references
      // from JSON.parse on every TRANSLATIONS_UPDATED_EVENT.
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

    return subscribeToTranslationChanges(sync)
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
  // Missing-only filter — lets an admin find exactly what's left to reach
  // 100% by hand without scrolling every category. Disabled/meaningless
  // while English (the source language, always "complete") is active.
  // --------------------------------------------------------------------------

  const [showMissingOnly, setShowMissingOnly] =
    useState(false)

  const missingKeys =
    useMemo(() => {
      if (isDefaultActive) return new Set<string>()
      const langData = data[activeCode] ?? {}
      return new Set(
        STRINGS.filter((entry) => !langData[entry.key]?.trim()).map(
          (entry) => entry.key,
        ),
      )
    }, [data, activeCode, isDefaultActive])

  // --------------------------------------------------------------------------
  // Filter strings
  // --------------------------------------------------------------------------

  const filteredStrings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      // STRINGS is defined with `as const`, so TS infers it as an exact
      // 94-element readonly tuple rather than a general array. Spreading
      // into a plainly-typed StringEntry[] here (instead of `let result =
      // STRINGS`) avoids TS trying to force the filtered result back into
      // that exact-length tuple type, which it can't do once .filter()
      // produces a shorter array.
      let result: StringEntry[] = [...STRINGS]

      if (query) {
        result = result.filter(
          (item) =>
            item.key
              .toLowerCase()
              .includes(query) ||
            item.en
              .toLowerCase()
              .includes(query),
        )
      }

      if (showMissingOnly && !isDefaultActive) {
        result = result.filter((item) =>
          missingKeys.has(item.key),
        )
      }

      return result
    }, [search, showMissingOnly, missingKeys, isDefaultActive])

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

  const flushPendingEdits = () => {
    const pending = pendingEditsRef.current
    pendingEditsRef.current = null
    if (!pending || Object.keys(pending.changes).length === 0) {
      return
    }

    translationsService
      .upsert(pending.code, pending.changes)
      .then(() => setTranslationSyncError(null))
      .catch(() => {
        setTranslationSyncError(
          `Couldn't save your changes to ${pending.code}. Check your connection — your edits are still visible here but haven't been saved.`,
        )
      })
  }

  // Flush any debounced edit still pending when the component unmounts,
  // so navigating away right after typing doesn't drop the last change.
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
      flushPendingEdits()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    // --------------------------------------------------------------------
    // Debounce the server write. Editing a different language than the one
    // currently pending flushes the old batch immediately first, so a fast
    // language switch doesn't lose in-flight edits to the previous one.
    // --------------------------------------------------------------------

    if (
      pendingEditsRef.current &&
      pendingEditsRef.current.code !== activeCode
    ) {
      flushPendingEdits()
    }

    pendingEditsRef.current = {
      code: activeCode,
      changes: {
        ...(pendingEditsRef.current?.code === activeCode
          ? pendingEditsRef.current.changes
          : {}),
        [key]: value,
      },
    }

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
    }

    syncTimerRef.current = setTimeout(
      flushPendingEdits,
      TRANSLATION_SYNC_DEBOUNCE_MS,
    )
  }

  // --------------------------------------------------------------------------
  // Auto-translate missing keys
  //
  // Sends every currently-untranslated STRINGS entry for the active
  // language to the backend, which machine-translates them and persists
  // the results. This bypasses the per-keystroke debounce entirely since
  // it's one deliberate bulk action, not typing.
  // --------------------------------------------------------------------------

  const [isAutoTranslating, setIsAutoTranslating] =
    useState(false)

  const [autoTranslateNotice, setAutoTranslateNotice] =
    useState<string | null>(null)

  const handleAutoTranslate =
    async () => {
      if (isDefaultActive || isAutoTranslating) {
        return
      }

      // Flush any pending manual edits first so a race between the two
      // doesn't let auto-translate overwrite something just typed.
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
      flushPendingEdits()

      const entries: AutoTranslateEntry[] =
        STRINGS.filter((entry) =>
          missingKeys.has(entry.key),
        ).map((entry) => ({
          key: entry.key,
          text: entry.en,
        }))

      if (entries.length === 0) {
        setAutoTranslateNotice(
          'Nothing to translate — every string already has a value.',
        )
        return
      }

      setIsAutoTranslating(true)
      setAutoTranslateNotice(null)
      setTranslationSyncError(null)

      // MyMemory's free tier is best done in modest batches — translating
      // hundreds of strings in one request is slow and more likely to hit
      // a rate limit partway through. 40 per request keeps each call quick
      // while still being far fewer round trips than one-per-key.
      const BATCH_SIZE = 40
      const allFailedKeys: string[] = []
      let translatedCountThisRun = 0

      try {
        for (let i = 0; i < entries.length; i += BATCH_SIZE) {
          const batch = entries.slice(i, i + BATCH_SIZE)
          const result = await translationsService.autoTranslate(
            activeCode,
            batch,
          )

          setData((previous) => ({
            ...previous,
            [activeCode]: {
              ...(previous[activeCode] ?? {}),
              ...result.translations,
            },
          }))

          allFailedKeys.push(...result.failedKeys)
          translatedCountThisRun += batch.length - result.failedKeys.length
        }

        if (allFailedKeys.length === 0) {
          setAutoTranslateNotice(
            `Auto-translated ${translatedCountThisRun} string${translatedCountThisRun === 1 ? '' : 's'}. Please review — machine translation is a starting draft, not a final one.`,
          )
        } else {
          setAutoTranslateNotice(
            `Auto-translated ${translatedCountThisRun} string${translatedCountThisRun === 1 ? '' : 's'}; ${allFailedKeys.length} couldn't be translated automatically (rate limit or provider error) and still need manual entry. Please review the rest — machine translation is a starting draft, not a final one.`,
          )
        }
      } catch (error) {
        setAutoTranslateNotice(
          error instanceof ApiError
            ? `Auto-translate failed: ${error.status === 403 ? 'you don\u2019t have permission to edit translations.' : 'the server rejected the request.'}`
            : "Auto-translate failed — couldn't reach the server.",
        )
      } finally {
        setIsAutoTranslating(false)
      }
    }

  // --------------------------------------------------------------------------
  // Add language
  // --------------------------------------------------------------------------

  const [isAddingLanguage, setIsAddingLanguage] =
    useState(false)

  const handleAddLanguage =
    async () => {
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
      // CREATE ON THE SERVER FIRST
      //
      // Language codes are unique on the backend too, so this is also the
      // real conflict check — the client-side ones above just give a fast
      // local error before making a round trip for the common case.
      // ----------------------------------------------------------------------

      setIsAddingLanguage(true)
      setFormError(null)

      try {
        await languagesService.create({ code, name })
      } catch (error) {
        setFormError(
          error instanceof ApiError && typeof error.body === 'object' && error.body && 'message' in error.body
            ? String((error.body as { message?: unknown }).message ?? 'Could not add that language.')
            : 'Could not add that language. Check your connection and try again.',
        )
        setIsAddingLanguage(false)
        return
      }

      setIsAddingLanguage(false)

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
      // ADD LANGUAGE (now that the server has confirmed it)
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
      //
      // The setLanguages() call above already triggers the "save languages"
      // effect, which persists to localStorage and dispatches
      // TRANSLATIONS_UPDATED_EVENT for Header to pick up — no need to
      // duplicate that here.
      // ----------------------------------------------------------------------

      saveActiveLanguageCode(code)

      // ----------------------------------------------------------------------
      // CLEAR FORM
      // ----------------------------------------------------------------------

      setNewName('')
      setNewCode('')
      setFormError(null)
      setShowAddForm(false)
    }

  // --------------------------------------------------------------------------
  // Remove language
  // --------------------------------------------------------------------------

  const handleRemoveLanguage = async (
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
    // Remove on the server first. Translation rows cascade-delete with the
    // language on the backend, so a single call handles both.
    // ------------------------------------------------------------------------

    try {
      await languagesService.remove(code)
    } catch {
      window.alert(
        `Couldn't remove ${language.name}. Check your connection and try again.`,
      )
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
    // Reset Header's active language if it was the one being removed.
    // setLanguages() above already dispatches TRANSLATIONS_UPDATED_EVENT,
    // so Header picks up the removal without any extra event here.
    // ------------------------------------------------------------------------

    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === code
    ) {
      saveActiveLanguageCode('en')
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
          LOAD / SYNC ERROR BANNERS
          ====================================================================== */}

      {loadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          {loadError}
        </div>
      )}

      {translationSyncError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {translationSyncError}
        </div>
      )}

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
              disabled={!isLoaded}
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
                  disabled={
                    isAddingLanguage
                  }
                  onClick={
                    handleAddLanguage
                  }
                >
                  {isAddingLanguage
                    ? 'Adding…'
                    : 'Add'}
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

            {/* Pre-filled translations hint for built-in codes */}

            {newCode.trim() &&
              BUILT_IN_LANGUAGES.some(
                (language) =>
                  language.code ===
                  slugifyCode(newCode),
              ) && (
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  "{slugifyCode(newCode)}" has built-in translations — they'll be pre-filled once added.
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
          MISSING-ONLY TOGGLE + AUTO-TRANSLATE
          ====================================================================== */}

      {!isDefaultActive && (
        <div className="flex flex-col gap-3 rounded-[28px] glass-sm p-4 sm:flex-row sm:items-center sm:justify-between">

          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={showMissingOnly}
              onChange={(event) =>
                setShowMissingOnly(event.target.checked)
              }
              className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500 dark:border-stone-600"
            />
            Show untranslated only
            {missingKeys.size > 0 && (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                {missingKeys.size}
              </span>
            )}
          </label>

          <Button
            variant="glass"
            disabled={isAutoTranslating || !isLoaded || missingKeys.size === 0}
            onClick={handleAutoTranslate}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          >
            <Globe size={14} />
            {isAutoTranslating
              ? 'Translating…'
              : missingKeys.size === 0
                ? 'All strings translated'
                : `Auto-translate ${missingKeys.size} missing`}
          </Button>

        </div>
      )}

      {autoTranslateNotice && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300">
          {autoTranslateNotice}
        </div>
      )}

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
                                isDefaultActive ||
                                !isLoaded
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