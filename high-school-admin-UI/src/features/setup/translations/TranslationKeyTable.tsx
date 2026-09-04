// src/features/setup/translations/TranslationKeyTable.tsx
import React, { useState, useMemo } from 'react'
import { Search, Save, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'
import { STRINGS } from '@/i18n/strings'

interface TranslationKeyTableProps {
  activeLangCode: string
  activeLangName: string
  translations: Record<string, string>
  isSaving: boolean
  isAutoTranslating: boolean
  onUpdateTranslation: (key: string, value: string) => void
  onSave: () => void
  onAutoTranslateMissing: () => void
  onAutoTranslateSingleKey: (key: string, englishText: string) => void
}

export const TranslationKeyTable: React.FC<TranslationKeyTableProps> = ({
  activeLangCode,
  activeLangName,
  translations = {},
  isSaving,
  isAutoTranslating,
  onUpdateTranslation,
  onSave,
  onAutoTranslateMissing,
  onAutoTranslateSingleKey,
}) => {
  const safeTrans = translations || {}
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [missingOnly, setMissingOnly] = useState(false)

  // Categorize strings based on key prefix
  const categories = useMemo(() => {
    const prefixes = new Set<string>()
    STRINGS.forEach((s) => {
      const parts = s.key.split('.')
      if (parts.length > 1) {
        prefixes.add(parts[0])
      }
    })
    return ['all', ...Array.from(prefixes)]
  }, [])

  const filteredStrings = useMemo(() => {
    return STRINGS.filter((item) => {
      const q = search.toLowerCase()
      const currentVal = safeTrans[item.key]
      const matchesSearch =
        !search.trim() ||
        item.key.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        (currentVal && currentVal.toLowerCase().includes(q))

      const matchesCat =
        categoryFilter === 'all' || item.key.startsWith(`${categoryFilter}.`)

      const isMissing = !currentVal || currentVal.trim() === ''
      const matchesMissing = !missingOnly || isMissing

      return matchesSearch && matchesCat && matchesMissing
    })
  }, [search, categoryFilter, missingOnly, safeTrans])

  const totalMissingCount = useMemo(() => {
    return STRINGS.filter((s) => !safeTrans[s.key] || safeTrans[s.key].trim() === '').length
  }, [safeTrans])

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-[24px] glass-sm p-4 border border-text-main/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 sm:min-w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-main/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search translation key or text..."
              className="w-full rounded-full border border-text-main/15 bg-text-main/5 py-2 pl-9 pr-3 text-xs sm:text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-main/50">Module:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-text-main/15 bg-text-main/5 px-3 py-1.5 text-xs text-text-main capitalize outline-none transition focus:border-brand-500"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-800 text-white capitalize">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setMissingOnly(!missingOnly)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
              missingOnly
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-text-main/5 border-text-main/10 text-text-main/60 hover:bg-text-main/10'
            }`}
          >
            Missing Only ({totalMissingCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {totalMissingCount > 0 && activeLangCode !== 'en' && (
            <button
              type="button"
              onClick={onAutoTranslateMissing}
              disabled={isAutoTranslating}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-violet-500 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} className={isAutoTranslating ? 'animate-spin' : ''} />
              {isAutoTranslating ? 'Translating...' : 'Auto-Translate Missing'}
            </button>
          )}

          <Button
            variant="solid"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save Translations'}
          </Button>
        </div>
      </div>

      {/* Translations Table */}
      <div className="overflow-hidden rounded-[26px] glass-sm border border-text-main/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-text-main/5 border-b border-text-main/10 text-xs font-bold uppercase tracking-wider text-text-main/60">
              <tr>
                <th className="w-1/4 px-6 py-4">String Key</th>
                <th className="w-1/3 px-6 py-4">Default English (en)</th>
                <th className="px-6 py-4">
                  Localized Text ({activeLangCode.toUpperCase()} - {activeLangName})
                </th>
                <th className="w-20 px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-main/5">
              {filteredStrings.map((entry) => {
                const currentVal = translations[entry.key] || ''
                const isMissing = !currentVal.trim()

                return (
                  <tr key={entry.key} className="hover:bg-text-main/5 transition">
                    <td className="px-6 py-4 font-mono text-xs text-brand-600 dark:text-brand-400 align-top pt-5">
                      {entry.key}
                    </td>

                    <td className="px-6 py-4 text-xs text-text-main/80 leading-relaxed align-top pt-5">
                      {entry.en}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="relative">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onUpdateTranslation(entry.key, e.target.value)}
                          placeholder={`Enter translation in ${activeLangName}...`}
                          className={`w-full rounded-xl border px-3.5 py-2 text-xs text-text-main outline-none transition ${
                            isMissing
                              ? 'border-amber-500/50 bg-amber-500/5 focus:border-amber-500'
                              : 'border-text-main/15 bg-text-main/5 focus:border-brand-500'
                          }`}
                        />
                        {isMissing && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-500">
                            Missing
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right align-top pt-4">
                      {activeLangCode !== 'en' && (
                        <button
                          type="button"
                          onClick={() => onAutoTranslateSingleKey(entry.key, entry.en)}
                          className="rounded-lg p-1.5 text-text-main/40 hover:bg-violet-500/15 hover:text-violet-400 transition"
                          title="Translate this string with AI"
                        >
                          <Sparkles size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredStrings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-main/40 text-xs">
                    No translation strings matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
