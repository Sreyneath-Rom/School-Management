import { useCallback, useEffect, useMemo, useState } from 'react'

import { getLocaleFromCode } from './languageMeta'
import { EN_TRANSLATIONS, STRINGS, type TranslationKey } from './strings'
import {
  DEFAULT_LANGUAGE,
  type LanguageDef,
  type TranslationMap,
  loadActiveLanguageCode,
  loadLanguages,
  loadTranslationData,
  saveActiveLanguageCode,
  subscribeToTranslationChanges,
} from './storage'

// Built-in supported languages
const BUILT_IN_LANGUAGES: LanguageDef[] = [
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

function withDefaultLanguage(languages: LanguageDef[]): LanguageDef[] {
  const additional = languages.filter((language) => language.code !== 'en')
  // Merge built-in languages with stored languages, preferring built-in
  const builtInCodes = BUILT_IN_LANGUAGES.map((l) => l.code)
  const customLanguages = additional.filter((l) => !builtInCodes.includes(l.code))
  return [...BUILT_IN_LANGUAGES, ...customLanguages]
}

function sameLanguages(a: LanguageDef[], b: LanguageDef[]): boolean {
  return a.length === b.length && a.every((lang, i) => lang.code === b[i].code && lang.name === b[i].name)
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
    // Merge stored translations with built-in translations
    return { ...BUILT_IN_TRANSLATIONS, ...stored }
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
      const nextData = { ...BUILT_IN_TRANSLATIONS, ...stored }

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