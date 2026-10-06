// src/components/cards/StatsGrid.tsx

import { useState, type ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  DoorOpen,
  FileCheck2,
  FileClock,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  Key,
  Languages,
  Layers,
  Mail,
  MapPin,
  Megaphone,
  Pin,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  UserCheck,
  UserRound,
  UserX,
  Users,
  XCircle,
} from 'lucide-react'

import { StatCardSkeleton } from '@/components/common/Skeleton'
import { AccentWave } from './StatMiniGraphics'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type StatAccent =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'brand'

export interface StatCard {
  id: string

  label: string

  subtitle?: string

  value: string

  icon: LucideIcon | string

  accent?: StatAccent

  /** @deprecated Use accent */
  tint?: string

  delta?: string

  deltaDirection?: 'up' | 'down' | 'flat' | 'neutral'

  deltaLabel?: string

  footerLabel?: string

  progress?: {
    value: number
    tone?: StatAccent
  }

  wave?: ReactNode

  /** @deprecated Use wave */
  trailing?: ReactNode

  noClick?: boolean
}

export interface StatsGridProps<T = unknown> {
  cards: StatCard[]

  stats?: T | null

  loading?: boolean

  /**
   * 3 gives the reference design:
   * 3 cards per row × 2 rows for 6 KPI cards.
   */
  columns?: 3 | 4 | 6 | 8

  resolveValue?: (
    card: StatCard,
    stats: T | null | undefined
  ) => string

  showHeader?: boolean

  title?: string

  subtitle?: string

  headerIcon?: LucideIcon

  showYearSelector?: boolean

  year?: string

  years?: string[]

  onYearChange?: (year: string) => void

  onCardClick?: (cardId: string) => void

  activeCardId?: string | null
}

/* ------------------------------------------------------------------ */
/* Icon Registry                                                      */
/* ------------------------------------------------------------------ */

const ICON_REGISTRY: Record<string, LucideIcon> = {
  AlertCircle,
  AlertTriangle: XCircle,
  Award,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  DoorOpen,
  FileCheck2,
  FileClock,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  Key,
  Languages,
  Layers,
  Mail,
  MapPin,
  Megaphone,
  Pin,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  UserCheck,
  UserRound,
  UserX,
  Users,
  XCircle,
}

function resolveIcon(input: LucideIcon | string): LucideIcon {
  if (typeof input === 'function') {
    return input
  }

  const found = ICON_REGISTRY[input]

  if (!found && import.meta.env.DEV) {
    console.warn(
      `StatsGrid: unknown icon "${input}". ` +
        `Pass the icon component directly or add it to ICON_REGISTRY.`
    )
  }

  return found ?? GraduationCap
}

/* ------------------------------------------------------------------ */
/* Accent                                                             */
/* ------------------------------------------------------------------ */

const TINT_TO_ACCENT: Record<string, StatAccent> = {
  blue: 'info',
  sky: 'info',
  cyan: 'info',
  teal: 'info',

  green: 'success',
  emerald: 'success',
  mint: 'success',

  amber: 'warning',
  yellow: 'warning',
  orange: 'warning',

  red: 'error',
  rose: 'error',
  pink: 'error',

  violet: 'brand',
  purple: 'brand',
  indigo: 'brand',
  brand: 'brand',

  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
}

function resolveAccent(card: StatCard): StatAccent {
  if (card.accent) {
    return card.accent
  }

  if (card.tint) {
    return (
      TINT_TO_ACCENT[card.tint.toLowerCase()] ?? 'brand'
    )
  }

  return 'brand'
}

/* ------------------------------------------------------------------ */
/* Visual styles                                                      */
/* ------------------------------------------------------------------ */

interface AccentStyle {
  iconBg: string
  blob: string
  glow: string
  deltaUp: string
}

const ACCENTS: Record<StatAccent, AccentStyle> = {
  info: {
    iconBg:
      'bg-gradient-to-br from-sky-300 via-blue-500 to-indigo-600',
    blob: 'bg-blue-400/30',
    glow: 'shadow-blue-500/30',
    deltaUp: 'text-emerald-600 dark:text-emerald-400',
  },

  success: {
    iconBg:
      'bg-gradient-to-br from-emerald-300 via-teal-500 to-cyan-600',
    blob: 'bg-emerald-400/30',
    glow: 'shadow-emerald-500/30',
    deltaUp: 'text-emerald-600 dark:text-emerald-400',
  },

  warning: {
    iconBg:
      'bg-gradient-to-br from-amber-300 via-orange-500 to-rose-500',
    blob: 'bg-orange-400/30',
    glow: 'shadow-orange-500/30',
    deltaUp: 'text-emerald-600 dark:text-emerald-400',
  },

  error: {
    iconBg:
      'bg-gradient-to-br from-pink-300 via-pink-500 to-fuchsia-600',
    blob: 'bg-pink-400/30',
    glow: 'shadow-pink-500/30',
    deltaUp: 'text-rose-600 dark:text-rose-400',
  },

  brand: {
    iconBg:
      'bg-gradient-to-br from-violet-300 via-purple-500 to-indigo-600',
    blob: 'bg-violet-400/30',
    glow: 'shadow-violet-500/30',
    deltaUp: 'text-emerald-600 dark:text-emerald-400',
  },
}

function progressTone(tone?: StatAccent): string {
  switch (tone) {
    case 'success':
      return 'bg-emerald-500'

    case 'info':
      return 'bg-blue-500'

    case 'warning':
      return 'bg-orange-500'

    case 'error':
      return 'bg-pink-500'

    default:
      return 'bg-violet-500'
  }
}

/* ------------------------------------------------------------------ */
/* KPI Card                                                           */
/* ------------------------------------------------------------------ */

function KPICard({
  card,
  onClick,
  isActive,
}: {
  card: StatCard
  onClick?: () => void
  isActive: boolean
}) {
  const Icon = resolveIcon(card.icon)

  const accentKey = resolveAccent(card)

  const style = ACCENTS[accentKey]

  const up = card.deltaDirection === 'up'

  const down = card.deltaDirection === 'down'

  const interactive = Boolean(onClick)

  const wave =
    card.wave ??
    card.trailing ??
    <AccentWave accent={accentKey} />

  const surface = isActive
    ? [
        'bg-white/55',
        'dark:bg-white/[0.08]',
        'shadow-[inset_6px_6px_14px_rgba(148,163,184,0.18),inset_-6px_-6px_14px_rgba(255,255,255,0.85)]',
        'ring-2 ring-violet-500/30',
      ].join(' ')
    : [
        'bg-white/45',
        'dark:bg-slate-900/35',
        'backdrop-blur-2xl',
        'border border-white/65',
        'dark:border-white/10',
        'shadow-[0_18px_45px_rgba(71,85,105,0.12),inset_1px_1px_0_rgba(255,255,255,0.85),inset_-1px_-1px_0_rgba(148,163,184,0.10)]',
        'hover:-translate-y-1',
        'hover:shadow-[0_25px_55px_rgba(71,85,105,0.18),inset_1px_1px_0_rgba(255,255,255,0.9)]',
      ].join(' ')

  const inner = (
    <>
      {/* Liquid glass glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full blur-3xl opacity-70 ${style.blob}`}
      />

      {/* Secondary glass glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 h-40 w-40 rounded-full bg-white/30 blur-3xl"
      />

      {/* Top glass reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/80"
      />

      <div className="relative flex h-full flex-col">
        {/* ---------------------------------------------------------- */}
        {/* Header                                                     */}
        {/* ---------------------------------------------------------- */}

        <div className="flex items-start gap-4">
          {/* Neumorphic icon */}
          <div
            className={[
              'relative flex h-16 w-16 shrink-0 items-center justify-center',
              'rounded-full text-white',
              'shadow-[7px_7px_16px_rgba(71,85,105,0.20),-5px_-5px_14px_rgba(255,255,255,0.90)]',
              'transition-all duration-300',
              'group-hover:scale-105',
              style.iconBg,
              style.glow,
            ].join(' ')}
          >
            {/* glossy layer */}
            <div
              aria-hidden
              className="absolute inset-0.5 rounded-full bg-linear-to-b from-white/45 via-white/10 to-transparent"
            />

            {/* inner neumorphic ring */}
            <div
              aria-hidden
              className="absolute inset-1 rounded-full ring-1 ring-white/30"
            />

            <Icon
              size={27}
              strokeWidth={2.1}
              className="relative z-10 drop-shadow-sm"
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="truncate text-[16px] font-bold tracking-tight text-slate-900 dark:text-white">
              {card.label}
            </h3>

            {(card.subtitle || card.footerLabel) && (
              <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-slate-500 dark:text-slate-400">
                {card.subtitle ?? card.footerLabel}
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* KPI Value                                                   */}
        {/* ---------------------------------------------------------- */}

        <div className="mt-7">
          <p className="text-[52px] font-black leading-none tracking-[-0.045em] text-slate-900 dark:text-white">
            {card.value}
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Delta                                                       */}
        {/* ---------------------------------------------------------- */}

        {(card.delta || card.progress) && (
          <div className="mt-5 flex items-center gap-3">
            {card.delta && (
              <div className="flex items-center gap-1.5">
                <span
                  className={[
                    'flex items-center gap-1 text-sm font-bold',
                    up
                      ? style.deltaUp
                      : down
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500',
                  ].join(' ')}
                >
                  {up && (
                    <ArrowUp
                      size={14}
                      strokeWidth={3}
                    />
                  )}

                  {down && (
                    <ArrowDown
                      size={14}
                      strokeWidth={3}
                    />
                  )}

                  {card.delta}
                </span>

                {card.deltaLabel && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {card.deltaLabel}
                  </span>
                )}
              </div>
            )}

            {card.progress && (
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-900/5 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${progressTone(
                    card.progress.tone ?? accentKey
                  )}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, card.progress.value)
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/* Wave                                                        */}
        {/* ---------------------------------------------------------- */}

        <div className="mt-auto -mb-1 pt-4">
          <div className="h-10 w-full opacity-95">
            {wave}
          </div>
        </div>
      </div>
    </>
  )

  const base = [
    'group relative isolate flex min-h-[250px] flex-col',
    'overflow-hidden rounded-[28px] p-6 text-left',
    'transition-all duration-300 ease-out',
    surface,
  ].join(' ')

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={[
          'w-full cursor-pointer',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-violet-500',
          'focus-visible:ring-offset-2',
          'rounded-[28px]',
          base,
        ].join(' ')}
      >
        {inner}
      </button>
    )
  }

  return <div className={base}>{inner}</div>
}

/* ------------------------------------------------------------------ */
/* Grid                                                               */
/* ------------------------------------------------------------------ */

const COLUMNS: Record<
  NonNullable<StatsGridProps['columns']>,
  string
> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
  8: 'lg:grid-cols-8',
}

/* ------------------------------------------------------------------ */
/* Stats Grid                                                         */
/* ------------------------------------------------------------------ */

export default function StatsGrid<T = unknown>({
  cards,
  stats,
  loading = false,
  columns = 3,
  resolveValue,
  showHeader = true,
  title = 'Key Performance Indicators',
  subtitle = 'Overall performance at a glance',
  headerIcon: HeaderIcon = BarChart3,
  showYearSelector = false,
  year,
  years = [],
  onYearChange,
  onCardClick,
  activeCardId = null,
}: StatsGridProps<T>) {
  const [open, setOpen] = useState(false)

  if (loading) {
    return (
      <div
        className={[
          'grid grid-cols-1 gap-5',
          'sm:grid-cols-2',
          COLUMNS[columns],
        ].join(' ')}
      >
        {cards.map((card) => (
          <StatCardSkeleton key={card.id} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------ */}
      {/* Header                                                       */}
      {/* ------------------------------------------------------------ */}

      {showHeader && (
        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={[
                'flex h-11 w-11 items-center justify-center',
                'rounded-2xl',
                'bg-white/50 dark:bg-white/10',
                'text-violet-600 dark:text-violet-400',
                'border border-white/60 dark:border-white/10',
                'shadow-[5px_5px_12px_rgba(71,85,105,0.12),-4px_-4px_10px_rgba(255,255,255,0.75)]',
              ].join(' ')}
            >
              <HeaderIcon
                size={21}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Year selector */}
          {showYearSelector && (
            <div className="relative self-start sm:self-auto">
              <button
                type="button"
                onClick={() =>
                  setOpen((value) => !value)
                }
                className={[
                  'flex items-center gap-2',
                  'rounded-2xl px-3.5 py-2',
                  'border border-white/60 dark:border-white/10',
                  'bg-white/45 dark:bg-white/8',
                  'backdrop-blur-xl',
                  'shadow-[4px_4px_12px_rgba(71,85,105,0.10)]',
                  'text-xs font-bold text-slate-700 dark:text-slate-200',
                ].join(' ')}
              >
                <Calendar
                  size={14}
                  className="text-slate-500"
                />

                <span>
                  {year ?? years[0] ?? ''}
                </span>

                <ChevronDown
                  size={14}
                  className="text-slate-500"
                />
              </button>

              {open && (
                <div className="absolute right-0 top-full z-30 mt-2 w-36 rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/90">
                  {years.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onYearChange?.(item)
                        setOpen(false)
                      }}
                      className={[
                        'w-full rounded-xl px-3 py-2',
                        'text-left text-xs font-semibold',
                        'transition-colors',
                        item === year
                          ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                          : 'text-slate-500 hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-white',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Cards                                                         */}
      {/* ------------------------------------------------------------ */}

      <div
        className={[
          'grid grid-cols-1 gap-5',
          'sm:grid-cols-2',
          COLUMNS[columns],
        ].join(' ')}
      >
        {cards.map((card) => {
          const value = resolveValue
            ? resolveValue(card, stats)
            : card.value

          const clickable =
            Boolean(onCardClick) && !card.noClick

          return (
            <KPICard
              key={card.id}
              card={{
                ...card,
                value,
              }}
              onClick={
                clickable
                  ? () => onCardClick?.(card.id)
                  : undefined
              }
              isActive={activeCardId === card.id}
            />
          )
        })}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Footer                                                        */}
      {/* ------------------------------------------------------------ */}

      {showHeader && (
        <div className="flex items-center gap-2 px-1 pt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
          <Sparkles
            size={13}
            className="text-violet-500"
          />

          <span>Better Learning</span>

          <span>•</span>

          <span>Brighter Future</span>
        </div>
      )}
    </div>
  )
}