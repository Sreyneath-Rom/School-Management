import { getFlagFromLanguageCode } from './languageMeta'

// ============================================================================
// TYPES
// ============================================================================

export interface LanguageDef {
  code: string
  name: string
  flag: string
}

export type TranslationMap = Record<string, Record<string, string>>

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const LANGUAGE_STORAGE_KEY = 'app.language'
export const LANGUAGES_STORAGE_KEY = 'translations.languages'
export const DATA_STORAGE_KEY = 'translations.data'

// Fired whenever languages or translation data change, in addition to the
// native 'storage' event (which only fires in *other* tabs). Anything that
// needs to react in the same tab listens for this.
export const TRANSLATIONS_UPDATED_EVENT = 'translations-updated'
// Fired when the active language changes.
export const LANGUAGE_CHANGED_EVENT = 'language-changed'

export const DEFAULT_LANGUAGE: LanguageDef = {
  code: 'en',
  name: 'English',
  flag: '🇬🇧',
}

// ============================================================================
// LOAD
// ============================================================================

export function loadLanguages(): LanguageDef[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(LANGUAGES_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (language): language is { code: string; name: string; flag?: string } =>
          Boolean(language) &&
          typeof language.code === 'string' &&
          typeof language.name === 'string',
      )
      .map((language) => ({
        code: language.code.toLowerCase(),
        name: language.name,
        // Always recompute the flag rather than trusting whatever was
        // stored — keeps old saved languages correct if the flag map
        // is ever extended, and guarantees consistency across the app.
        flag: getFlagFromLanguageCode(language.code),
      }))
  } catch {
    return []
  }
}

export function loadTranslationData(): TranslationMap {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(DATA_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    return parsed as TranslationMap
  } catch {
    return {}
  }
}

export function loadActiveLanguageCode(): string {
  if (typeof window === 'undefined') {
    return 'en'
  }

  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? 'en'
}

// ============================================================================
// SAVE
// ============================================================================

export function saveLanguages(languages: LanguageDef[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LANGUAGES_STORAGE_KEY, JSON.stringify(languages))
  window.dispatchEvent(new Event(TRANSLATIONS_UPDATED_EVENT))
}

export function saveTranslationData(data: TranslationMap): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event(TRANSLATIONS_UPDATED_EVENT))
}

export function saveActiveLanguageCode(code: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
  window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT))
}

// ============================================================================
// SYNC
//
// Subscribes to both the cross-tab 'storage' event and the same-tab
// 'translations-updated' event, calling `onChange` with fresh data whenever
// either fires. Centralizes the "storage doesn't fire in the same tab"
// workaround so it only has to be understood and tested in one place.
// ============================================================================

export function subscribeToTranslationChanges(onChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleCustomEvent = () => onChange()

  const handleStorageEvent = (event: StorageEvent) => {
    if (
      event.key === LANGUAGES_STORAGE_KEY ||
      event.key === DATA_STORAGE_KEY ||
      event.key === LANGUAGE_STORAGE_KEY
    ) {
      onChange()
    }
  }

  window.addEventListener(TRANSLATIONS_UPDATED_EVENT, handleCustomEvent)
  window.addEventListener('storage', handleStorageEvent)

  return () => {
    window.removeEventListener(TRANSLATIONS_UPDATED_EVENT, handleCustomEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
}