// src/features/setup/translations/TranslationStats.tsx
import React from 'react'
import { Globe, Languages, CheckCircle2, AlertCircle } from 'lucide-react'
import type { LanguageRecord } from '@/services/languagesService'

interface TranslationStatsProps {
  languages: LanguageRecord[]
  activeLangCode: string
  totalKeys: number
  translatedKeysCount: number
}

export const TranslationStats: React.FC<TranslationStatsProps> = ({
  languages,
  activeLangCode,
  totalKeys,
  translatedKeysCount,
}) => {
  const missingCount = Math.max(0, totalKeys - translatedKeysCount)
  const completionPct = totalKeys > 0 ? Math.round((translatedKeysCount / totalKeys) * 100) : 100

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
            <Languages size={20} />
          </div>
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Locales
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Installed Languages</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{languages.length}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-300">
            <Globe size={20} />
          </div>
          <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
            Catalog
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Total String Keys</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{totalKeys}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 size={20} />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            {completionPct}% Complete
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">
          Translated ({activeLangCode.toUpperCase()})
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{translatedKeysCount}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <AlertCircle size={20} />
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
            {missingCount === 0 ? 'All Set' : 'Needs Review'}
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Missing Strings</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{missingCount}</p>
      </div>
    </div>
  )
}
