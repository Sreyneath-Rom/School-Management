// src/features/setup/translations/index.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { TranslationStats } from './TranslationStats'
import { TranslationKeyTable } from './TranslationKeyTable'
import { AddLanguageModal } from './AddLanguageModal'
import { languagesService, type LanguageRecord } from '@/services/languagesService'
import { translationsService } from '@/services/translationsService'
import { STRINGS } from '@/i18n/strings'
import { saveLanguages } from '@/i18n/storage'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

const normalizeLanguageCode = (code?: string) => (code || '').trim().toLowerCase()

export default function TranslationsFeature() {
  const [languages, setLanguages] = useState<LanguageRecord[]>([])
  const [activeLangCode, setActiveLangCode] = useState('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoTranslating, setIsAutoTranslating] = useState(false)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddingLanguage, setIsAddingLanguage] = useState(false)

  const { success, error: notifyError } = useNotification()

  const loadTranslationsForLang = useCallback(
    async (langCode: string) => {
      try {
        const trans = await translationsService.get(langCode)
        setTranslations(trans && typeof trans === 'object' ? trans : {})
      } catch {
        notifyError('Failed to fetch translations for ' + langCode)
      }
    },
    [notifyError],
  )

  const loadLanguages = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const langs = await languagesService.list()
      const safeLangs = Array.isArray(langs) ? langs : []
      setLanguages(safeLangs)

      const selectedCode = normalizeLanguageCode(activeLangCode)
      const current = safeLangs.some((language) => normalizeLanguageCode(language.code) === selectedCode)
        ? selectedCode
        : safeLangs[0]?.code || 'en'

      setActiveLangCode(current)
      await loadTranslationsForLang(current)
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load languages')
    } finally {
      setIsLoading(false)
    }
  }, [activeLangCode, loadTranslationsForLang])

  useEffect(() => {
    void loadLanguages()
  }, [loadLanguages])

  const handleSelectLanguage = async (code: string) => {
    setActiveLangCode(code)
    await loadTranslationsForLang(code)
  }

  const activeLang = useMemo(() => {
    const safeLangs = Array.isArray(languages) ? languages : []
    return safeLangs.find((l) => l && l.code === activeLangCode) || { code: activeLangCode, name: activeLangCode }
  }, [languages, activeLangCode])

  const handleUpdateTranslation = (key: string, value: string) => {
    setTranslations((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveTranslations = async () => {
    setIsSaving(true)
    try {
      await translationsService.upsert(activeLangCode, translations)
      success(`Saved translations for ${activeLang.name}`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to save translations')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAutoTranslateMissing = async () => {
    setIsAutoTranslating(true)
    try {
      const missingEntries = STRINGS.filter(
        (s) => !translations[s.key] || translations[s.key].trim() === ''
      ).map((s) => ({ key: s.key, text: s.en }))

      if (missingEntries.length === 0) {
        success('All strings are already translated')
        return
      }

      const res = await translationsService.autoTranslate(activeLangCode, missingEntries)
      setTranslations((prev) => ({ ...prev, ...res.translations }))
      success(`Auto-translated ${Object.keys(res.translations).length} strings`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Auto-translation failed')
    } finally {
      setIsAutoTranslating(false)
    }
  }

  const handleAutoTranslateSingleKey = async (key: string, englishText: string) => {
    try {
      const res = await translationsService.autoTranslate(activeLangCode, [{ key, text: englishText }])
      if (res.translations[key]) {
        handleUpdateTranslation(key, res.translations[key])
        success(`Translated "${key}"`)
      }
    } catch {
      notifyError('Failed to translate string')
    }
  }

  const handleAddLanguage = async (data: { code: string; name: string }) => {
    const safeCode = normalizeLanguageCode(data.code)
    const safeName = data.name.trim()

    if (!safeCode || !safeName) {
      notifyError('Language code and name are required.')
      return
    }

    if (languages.some((language) => normalizeLanguageCode(language.code) === safeCode)) {
      notifyError(`The language "${safeCode}" is already installed.`)
      return
    }

    setIsAddingLanguage(true)
    try {
      const created = await languagesService.create({ code: safeCode, name: safeName })
      const nextLanguages = [...languages, created].map((language) => ({
        code: normalizeLanguageCode(language.code),
        name: language.name,
        flag: language.code === 'en' ? '🇬🇧' : '🌐',
      }))

      setLanguages((prev) => [...prev, created])
      saveLanguages(nextLanguages)
      setActiveLangCode(created.code)
      await loadTranslationsForLang(created.code)
      setIsAddModalOpen(false)
      success(`Added language ${created.name}`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to add language')
    } finally {
      setIsAddingLanguage(false)
    }
  }

  const handleDeleteLanguage = async (code: string) => {
    if (code === 'en') {
      notifyError('English (en) is the base system language and cannot be removed.')
      return
    }
    if (!confirm(`Are you sure you want to remove ${code.toUpperCase()}?`)) return

    try {
      await languagesService.remove(code)
      const nextLanguages = languages
        .filter((language) => normalizeLanguageCode(language.code) !== normalizeLanguageCode(code))
        .map((language) => ({
          code: normalizeLanguageCode(language.code),
          name: language.name,
          flag: language.code === 'en' ? '🇬🇧' : '🌐',
        }))

      setLanguages((prev) => prev.filter((l) => normalizeLanguageCode(l.code) !== normalizeLanguageCode(code)))
      saveLanguages(nextLanguages)
      setActiveLangCode('en')
      await loadTranslationsForLang('en')
      success(`Removed language ${code}`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to delete language')
    }
  }

  const translatedCount = useMemo(() => {
    return Object.values(translations).filter((v) => v && v.trim() !== '').length
  }, [translations])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Translations & Multilingual Localization"
          subtitle="Manage installed languages, internationalized string dictionaries, and automated AI translation."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="solid"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus size={16} /> Add Language
          </Button>
        </div>
      </div>

      <TranslationStats
        languages={languages}
        activeLangCode={activeLangCode}
        totalKeys={STRINGS.length}
        translatedKeysCount={translatedCount}
      />

      {/* Language selector tabs — control bar was `glass-sm border
          border-text-main/10`. Border was invisible; keep `.glass-sm`. */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl glass-sm p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-fg-muted mr-1">Installed Locales:</span>
          {languages.map((lang) => {
            const isSelected = activeLangCode === lang.code
            return (
              <div
                key={lang.code}
                // Chip: raised by default (unselected), brand-filled for
                // the active locale. Hover on unselected presses in.
                className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-fg-muted hover:text-fg shadow-emboss hover:shadow-sunken'
                }`}
                onClick={() => handleSelectLanguage(lang.code)}
              >
                <span className="uppercase font-mono text-[10px] opacity-80">{lang.code}</span>
                <span>{lang.name}</span>
                {lang.code !== 'en' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteLanguage(lang.code)
                    }}
                    className={`rounded p-0.5 opacity-0 group-hover:opacity-100 hover:text-error transition ${
                      isSelected ? 'text-white/70 hover:text-white' : 'text-fg-muted'
                    }`}
                    title="Remove language"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={loadLanguages}
          className="rounded-xl p-2 text-fg-muted hover:text-fg hover:shadow-sunken transition"
          title="Refresh languages"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          {/* `border-3` isn't a valid Tailwind width — border-2 */}
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-fg-muted">Loading translation dictionary...</p>
        </div>
      ) : loadError ? (
        // Semantic error — tinted bg + border carries the signal
        <div className="rounded-3xl bg-error/10 border border-error/25 p-6 text-center text-error">
          <p className="font-bold mb-1">Failed to load translation keys</p>
          <p className="text-xs">{loadError}</p>
        </div>
      ) : (
        <TranslationKeyTable
          activeLangCode={activeLangCode}
          activeLangName={activeLang.name}
          translations={translations}
          isSaving={isSaving}
          isAutoTranslating={isAutoTranslating}
          onUpdateTranslation={handleUpdateTranslation}
          onSave={handleSaveTranslations}
          onAutoTranslateMissing={handleAutoTranslateMissing}
          onAutoTranslateSingleKey={handleAutoTranslateSingleKey}
        />
      )}

      <AddLanguageModal
        isOpen={isAddModalOpen}
        isSubmitting={isAddingLanguage}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLanguage}
      />
    </div>
  )
}