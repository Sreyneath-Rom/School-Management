// src/features/setup/translations/TranslationStats.tsx
import React from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import type { LanguageRecord } from '@/services/languagesService'

interface TranslationStatsProps {
  languages: LanguageRecord[]
  activeLangCode: string
  totalKeys: number
  translatedKeysCount: number
}

export const TranslationStats: React.FC<TranslationStatsProps> = ({
  languages, activeLangCode, totalKeys, translatedKeysCount,
}) => {
  const missingCount = Math.max(0, totalKeys - translatedKeysCount)
  const completionPct = totalKeys > 0 ? Math.round((translatedKeysCount / totalKeys) * 100) : 100

  const cards: StatCard[] = [
    { id: 'installed-languages', label: 'Installed Languages', value: languages.length.toString(),     delta: '-',          deltaDirection: 'neutral', deltaLabel: 'locales',                     icon: 'Languages',    tint: 'blue' },
    { id: 'string-keys',         label: 'Total String Keys',   value: totalKeys.toString(),             delta: '-',          deltaDirection: 'neutral', deltaLabel: 'catalog',                     icon: 'Globe',        tint: 'violet' },
    { id: 'translated-keys',     label: `Translated (${activeLangCode.toUpperCase()})`, value: translatedKeysCount.toString(), delta: `${completionPct}%`, deltaDirection: 'neutral', deltaLabel: 'complete',            icon: 'CheckCircle2', tint: 'green' },
    { id: 'missing-strings',     label: 'Missing Strings',     value: missingCount.toString(),          delta: '-',          deltaDirection: 'neutral', deltaLabel: missingCount === 0 ? 'all set' : 'needs review', icon: 'AlertCircle',  tint: 'amber' },
  ]

  return <StatsGrid cards={cards} columns={4} />
}