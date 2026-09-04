import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getFlagFromLanguageCode, getLocaleFromCode } from './languageMeta'
import { EN_TRANSLATIONS, STRINGS, type TranslationKey } from './strings'
import {
  DEFAULT_LANGUAGE,
  type LanguageDef,
  type TranslationMap,
  loadActiveLanguageCode,
  loadLanguages,
  loadTranslationData,
  saveActiveLanguageCode,
  saveLanguages,
  saveTranslationData,
  subscribeToTranslationChanges,
} from './storage'
import { languagesService } from '@/services/languagesService'
import { translationsService } from '@/services/translationsService'

// Built-in supported languages. Exported so TranslationManager can treat
// these codes as reserved — without this, an admin adding a custom
// language with e.g. code "es" would collide with the built-in Spanish
// entry with no warning (see mergeTranslations below for what that
// collision does on the read side).
export const BUILT_IN_LANGUAGES: LanguageDef[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
]

// Build translation map from STRINGS array
function buildBuiltInTranslations(): TranslationMap {
  const map: TranslationMap = {}

  BUILT_IN_LANGUAGES.forEach((lang) => {
    map[lang.code] = {}
  })

  STRINGS.forEach((entry) => {
    BUILT_IN_LANGUAGES.forEach((lang) => {
      const translation = entry[lang.code as keyof typeof entry]
      if (translation && typeof translation === 'string') {
        map[lang.code][entry.key] = translation
      } else if (lang.code !== 'en') {
        // Fallback to English if translation not available
        map[lang.code][entry.key] = entry.en
      }
    })
  })

  return map
}

const BUILT_IN_TRANSLATIONS = buildBuiltInTranslations()

// `{ ...builtIn, ...stored }` looks like a merge but isn't one at the level
// that matters: for any language present in `stored`, it replaces that
// language's ENTIRE translation object rather than merging key-by-key. In
// practice that means saving even a single edited string for a built-in
// language (e.g. French) via TranslationManager silently discards every
// other built-in French string that wasn't also re-saved — they'd fall
// back to raw translation keys instead of their shipped translations.
// Merging per-key, per-language keeps built-ins as the base and lets
// `stored` override only the specific keys someone actually edited.
function mergeTranslations(builtIn: TranslationMap, stored: TranslationMap): TranslationMap {
  const result: TranslationMap = {}
  const codes = new Set([...Object.keys(builtIn), ...Object.keys(stored)])

  codes.forEach((code) => {
    result[code] = { ...(builtIn[code] ?? {}), ...(stored[code] ?? {}) }
  })

  return result
}

// The Header's switcher should only ever show English plus whatever
// languages have actually been added via TranslationManager — not every
// built-in language automatically. BUILT_IN_LANGUAGES/BUILT_IN_TRANSLATIONS
// still exist so that adding e.g. "es" comes with pre-filled Spanish
// translations rather than starting from scratch, but the language itself
// only appears in the switcher once someone has explicitly added it.
function withDefaultLanguage(languages: LanguageDef[]): LanguageDef[] {
  if (!Array.isArray(languages)) return [DEFAULT_LANGUAGE]
  const additional = languages.filter((language) => language && language.code !== 'en')
  return [DEFAULT_LANGUAGE, ...additional]
}

function sameLanguages(a: LanguageDef[], b: LanguageDef[]): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  return a.length === b.length && a.every((lang, i) => lang && b[i] && lang.code === b[i].code && lang.name === b[i].name)
}

export interface UseTranslationsResult {
  language: string
  setLanguage: (code: string) => void
  languages: LanguageDef[]
  activeLanguage: LanguageDef & { locale: string }
  t: (key: TranslationKey, fallback?: string) => string
}

/**
 * Reads the language list and translation data that TranslationManager
 * writes to localStorage, keeps them in sync (same-tab custom event +
 * cross-tab storage event), and exposes a `t()` lookup function.
 */
export function useTranslations(): UseTranslationsResult {
  const [languages, setLanguages] = useState<LanguageDef[]>(() =>
    withDefaultLanguage(loadLanguages()),
  )

  const [translationData, setTranslationData] = useState<TranslationMap>(() => {
    const stored = loadTranslationData()
    return mergeTranslations(BUILT_IN_TRANSLATIONS, stored)
  })

  const [language, setLanguageState] = useState<string>(() => {
    const stored = loadActiveLanguageCode()
    const available = withDefaultLanguage(loadLanguages())
    return available.some((lang) => lang.code === stored) ? stored : 'en'
  })

  // --------------------------------------------------------------------------
  // Stay in sync with TranslationManager, in this tab and others.
  // --------------------------------------------------------------------------

  useEffect(() => {
    const sync = () => {
      const nextLanguages = withDefaultLanguage(loadLanguages())
      const stored = loadTranslationData()
      const nextData = mergeTranslations(BUILT_IN_TRANSLATIONS, stored)

      setLanguages((prev) => (sameLanguages(prev, nextLanguages) ? prev : nextLanguages))
      setTranslationData((prev) =>
        JSON.stringify(prev) === JSON.stringify(nextData) ? prev : nextData,
      )

      setLanguageState((current) => {
        if (nextLanguages.some((lang) => lang.code === current)) {
          return current
        }
        saveActiveLanguageCode('en')
        return 'en'
      })
    }

    sync()

    return subscribeToTranslationChanges(sync)
  }, [])

  // --------------------------------------------------------------------------
  // Load from the backend on mount.
  //
  // localStorage (via the state initializers above and the `sync` effect)
  // gives an instant, offline-safe first paint using whatever was cached
  // from the last successful fetch. This effect then tries the real API
  // and, if it succeeds, overwrites both React state and the localStorage
  // cache with the authoritative server data.
  //
  // Any failure here — logged out, no `translations.view` permission,
  // offline, backend down — is swallowed on purpose: this hook is used
  // app-wide (e.g. from Header), including on pages rendered before login,
  // so it must never throw or block rendering. Worst case, the UI just
  // falls back to the built-in translations plus whatever was last cached.
  // --------------------------------------------------------------------------

  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    let cancelled = false

    async function loadFromApi() {
      try {
        const records = await languagesService.list()
        const safeRecords = Array.isArray(records) ? records : []
        const fetchedLanguages = withDefaultLanguage(
          safeRecords.map((record) => ({
            code: (record.code || '').toLowerCase(),
            name: record.name || '',
            flag: getFlagFromLanguageCode(record.code || ''),
          })),
        )

        const additionalCodes = fetchedLanguages
          .map((lang) => lang.code)
          .filter((code) => code !== 'en')

        const fetchedEntries = await Promise.all(
          additionalCodes.map(async (code) => {
            try {
              return [code, await translationsService.get(code)] as const
            } catch {
              // One language's translations failing to load shouldn't take
              // down the rest — just fall back to built-ins for that code.
              return [code, {}] as const
            }
          }),
        )

        if (cancelled) return

        const storedFromApi: TranslationMap = Object.fromEntries(fetchedEntries)
        const nextData = mergeTranslations(BUILT_IN_TRANSLATIONS, storedFromApi)

        setLanguages((prev) => (sameLanguages(prev, fetchedLanguages) ? prev : fetchedLanguages))
        setTranslationData((prev) =>
          JSON.stringify(prev) === JSON.stringify(nextData) ? prev : nextData,
        )

        // Refresh the offline cache so the next page load (or a failed
        // fetch) has up-to-date data to fall back to.
        saveLanguages(fetchedLanguages.filter((lang) => lang.code !== 'en'))
        saveTranslationData(storedFromApi)
      } catch {
        // No network / not authenticated / no permission yet — keep
        // whatever localStorage already gave us.
      }
    }

    loadFromApi()

    return () => {
      cancelled = true
    }
  }, [])

  // --------------------------------------------------------------------------
  // Persist + broadcast whenever the user picks a different language.
  // --------------------------------------------------------------------------

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code)
    saveActiveLanguageCode(code)
  }, [])

  // --------------------------------------------------------------------------
  // Derived values
  // --------------------------------------------------------------------------

  const activeLanguage = useMemo(() => {
    const match = languages.find((lang) => lang.code === language) ?? DEFAULT_LANGUAGE
    return { ...match, locale: getLocaleFromCode(match.code) }
  }, [languages, language])

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const translated = translationData[language]?.[key]?.trim()
      return translated || fallback || EN_TRANSLATIONS[key] || key
    },
    [language, translationData],
  )

  return { language, setLanguage, languages, activeLanguage, t }
}