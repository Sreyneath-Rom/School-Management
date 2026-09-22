// src/components/cards/StatsGrid.tsx
import { useState } from 'react'
import {
  GraduationCap, Users, BookOpen, FileText, Star, FileCheck2,
  Trophy, CalendarClock, Award, CheckCircle2, Clock, HelpCircle,
  AlertCircle, UserRound, UserCheck, ClipboardList,
  School, DoorOpen, TrendingUp, Layers, BarChart3, Sparkles, Calendar,
  ArrowUp, ArrowDown, ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StatCard } from '@/types'
import type { DashboardStats } from '@/services/dashboardService'
import { StatCardSkeleton } from '@/components/common/Skeleton'

/**
 * Icon name → component lookup. A page passes `icon: 'TrendingUp'` as a
 * string; this map resolves it. New icons must be added here or the card
 * renders a fallback.
 */
const iconMap: Record<string, LucideIcon> = {
  GraduationCap, Users, BookOpen, FileText, Star, FileCheck2,
  Trophy, CalendarClock, Award, CheckCircle2, Clock, HelpCircle,
  AlertCircle, UserRound, UserCheck, ClipboardList,
  School, DoorOpen, TrendingUp, Layers, BarChart3, Sparkles, Calendar,
}

function resolveIcon(name: string): LucideIcon {
  const found = iconMap[name]
  if (!found && import.meta.env.DEV) {
    console.warn(
      `StatsGrid: unknown icon "${name}" — falling back to GraduationCap`
    )
  }
  return found ?? GraduationCap
}

function isDashboardStats(value: unknown): value is DashboardStats {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.studentCount === 'number' &&
    typeof s.teacherCount === 'number' &&
    typeof s.classCount === 'number'
  )
}

interface StatsGridProps<T = DashboardStats> {
  stats?: T | null
  loading?: boolean
  /** Cards to render. Required — the caller owns the definition. */
  cards: StatCard[]
  columns?: 3 | 4 | 6 | 8
  resolveValue?: (card: StatCard, stats: T | null | undefined) => string
  showHeader?: boolean

  /**
   * When provided, each card becomes a click target. The id of the
   * clicked card is passed back so callers can wire it to a filter,
   * a selection, or a navigation. Cards that set `noClick: true` are
   * exempt.
   */
  onCardClick?: (cardId: string) => void
  /**
   * Highlights the matching card with the app-wide "selected" treatment
   * (pressed-in sunken well + brand ring). Pass `null` for no selection.
   */
  activeCardId?: string | null
}

/* Neumorphic hairline seams. Under this theme a 1px border in --glass-bg
   is invisible; a 1px hard-edged box-shadow using --neu-shadow-dark reads
   as a proper seam. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

/**
 * Maps a semantic tone name to the fill color for a card's progress bar.
 * Uses the theme's status tokens so the bar renders correctly in both
 * light and dark mode without a `dark:` variant.
 */
function progressToneClass(tone?: string): string {
  switch (tone) {
    case 'success': return 'bg-success'
    case 'info':    return 'bg-info'
    case 'warning': return 'bg-warning'
    case 'error':   return 'bg-error'
    case 'brand':
    default:        return 'bg-brand-500'
  }
}

// ---------------------------------------------------------------------------
// Mini graphics
//
// These are colored accent marks (sparklines, bar charts, progress rings)
// layered on top of the neumorphic surface. They intentionally keep their
// saturated status/brand colors — the surface itself is monochrome, but
// the DATA on top of it is where color carries meaning.
// ---------------------------------------------------------------------------

function MiniSparklineBlue() {
  return (
    <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 44" fill="none">
      <path
        d="M2 32 C 16 34, 24 18, 38 22 C 52 26, 60 12, 74 16 C 84 19, 90 8, 96 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-info"
      />
      <circle cx="96" cy="6" r="4.5" fill="currentColor" className="text-info" />
    </svg>
  )
}

function MiniBarsTeal() {
  return (
    <div className="flex items-end gap-1.5 h-10">
      <span className="w-2 rounded-t-full bg-success/60 h-3" />
      <span className="w-2 rounded-t-full bg-success/75 h-5" />
      <span className="w-2 rounded-t-full bg-success/90 h-7" />
      <span className="w-2 rounded-t-full bg-brand-500 h-9" />
    </div>
  )
}

function MiniSparklinePurple() {
  return (
    <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 44" fill="none">
      <path
        d="M2 30 C 18 32, 28 14, 44 24 C 60 34, 72 10, 96 14"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-500"
      />
    </svg>
  )
}

function MiniRingOrange({ percentage = 96.5 }: { percentage?: number }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * percentage) / 100

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r={radius}
          stroke="currentColor" strokeWidth="6" fill="none"
          className="text-warning/30"
        />
        <circle
          cx="28" cy="28" r={radius}
          stroke="currentColor" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" fill="none" className="text-warning"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-fg">
        {percentage}%
      </span>
    </div>
  )
}

function MiniBarsPink() {
  return (
    <div className="flex items-end gap-1.5 h-10">
      <span className="w-2 rounded-t-full bg-brand-400/60 h-2.5" />
      <span className="w-2 rounded-t-full bg-brand-400/75 h-4" />
      <span className="w-2 rounded-t-full bg-brand-500/85 h-6" />
      <span className="w-2 rounded-t-full bg-brand-500 h-8" />
      <span className="w-2 rounded-t-full bg-brand-600 h-10" />
    </div>
  )
}

function MiniRingBlue({ percentage = 98 }: { percentage?: number }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * percentage) / 100

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r={radius}
          stroke="currentColor" strokeWidth="6" fill="none"
          className="text-info/30"
        />
        <circle
          cx="28" cy="28" r={radius}
          stroke="currentColor" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" fill="none" className="text-info"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-fg">
        {percentage}%
      </span>
    </div>
  )
}

function MiniUsersPurple() {
  return (
    <div className="flex items-center -space-x-1.5">
      {/* ring color = --glass-bg = the card's own background, so the
          ring reads as a 2px matte gap between overlapping avatars. */}
      <span className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white ring-2 ring-surface">
        <Users size={14} />
      </span>
      <span className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white ring-2 ring-surface z-10">
        <Users size={16} />
      </span>
      <span className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white ring-2 ring-surface">
        <Users size={14} />
      </span>
    </div>
  )
}

function MiniCalendarMint() {
  return (
    // Semantic tinted badge — the tinted background + soft ring is the
    // signal, not a neumorphic surface.
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/15 text-success ring-1 ring-success/25">
      <CalendarClock size={24} strokeWidth={2} />
    </div>
  )
}

function renderMiniGraphic(type?: string) {
  switch (type) {
    case 'wave-blue':      return <MiniSparklineBlue />
    case 'bars-teal':      return <MiniBarsTeal />
    case 'wave-purple':    return <MiniSparklinePurple />
    case 'ring-orange':    return <MiniRingOrange percentage={96.5} />
    case 'bars-pink':      return <MiniBarsPink />
    case 'ring-blue':      return <MiniRingBlue percentage={98} />
    case 'users-purple':   return <MiniUsersPurple />
    case 'calendar-mint':  return <MiniCalendarMint />
    default:               return null
  }
}

// ---------------------------------------------------------------------------
// Card visuals
//
// Only the faint ambient blob is supplied from this map now. The icon
// badge is a gradient accent that sits ON the neumorphic surface (like a
// sticker on a wall) — it's allowed to keep its saturated gradient.
// Blob opacities dropped from /25 → /15 because the underlying surface is
// flat and colored blooms read as damage rather than decoration.
// ---------------------------------------------------------------------------

interface CardVisualConfig {
  blob: string
  iconBg: string
  iconShadow: string
}

const CARD_STYLES: Record<string, CardVisualConfig> = {
  students:         { blob: 'bg-info/15',      iconBg: 'bg-linear-to-br from-info to-brand-500',      iconShadow: 'shadow-md shadow-info/25' },
  teachers:         { blob: 'bg-success/15',   iconBg: 'bg-linear-to-br from-success to-brand-500',   iconShadow: 'shadow-md shadow-success/25' },
  classes:          { blob: 'bg-brand-500/15', iconBg: 'bg-linear-to-br from-brand-500 to-info',     iconShadow: 'shadow-md shadow-brand-500/25' },
  attendance:       { blob: 'bg-warning/15',   iconBg: 'bg-linear-to-br from-warning to-error',       iconShadow: 'shadow-md shadow-warning/25' },
  'pending-leaves': { blob: 'bg-brand-500/15', iconBg: 'bg-linear-to-br from-brand-500 to-brand-700', iconShadow: 'shadow-md shadow-brand-500/25' },
  gpa:              { blob: 'bg-brand-400/15', iconBg: 'bg-linear-to-br from-brand-400 to-brand-600', iconShadow: 'shadow-md shadow-brand-400/25' },
  assignments:      { blob: 'bg-info/15',      iconBg: 'bg-linear-to-br from-info to-brand-600',      iconShadow: 'shadow-md shadow-info/25' },
  'top-students':   { blob: 'bg-brand-500/15', iconBg: 'bg-linear-to-br from-brand-500 to-brand-700', iconShadow: 'shadow-md shadow-brand-500/25' },
  events:           { blob: 'bg-success/15',   iconBg: 'bg-linear-to-br from-success to-brand-600',   iconShadow: 'shadow-md shadow-success/25' },
}

const FALLBACK_STYLE = CARD_STYLES.students

// ---------------------------------------------------------------------------
// Single card
// ---------------------------------------------------------------------------

function KPICardView({
  card,
  onClick,
  isActive,
}: {
  card: StatCard
  onClick?: () => void
  isActive?: boolean
}) {
  const Icon = resolveIcon(card.icon)
  const style = CARD_STYLES[card.id] ?? FALLBACK_STYLE

  const isPositive = card.deltaDirection === 'up'
  const isNegative = card.deltaDirection === 'down'
  const interactive = Boolean(onClick)

  // Active state = pressed-in sunken well + brand ring, matching the
  // selected treatment used on student cards and table rows. Otherwise
  // the card is a raised surface that floats higher on hover.
  //
  // `.glass` supplies the neumorphic raised surface (flush background +
  // dual-shadow elevation). Glassmorphism artifacts
  // (`border border-surface`, `bg-surface-strong`, `backdrop-blur-xl`,
  // `shadow-xs`) are all gone — none of them had a visible effect under
  // this theme.
  const surfaceClass = isActive
    ? 'shadow-sunken ring-1 ring-brand-500/30'
    : 'glass hover:shadow-(--glass-strong-shadow)'

  const inner = (
    <>
      {/* A single faint ambient blob replaces the two glassmorphism-era
          blooms. Under neumorphism the surface is a flat plane and depth
          comes from the dual shadow — heavy color bleed fights that. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full blur-2xl opacity-30 transition-transform duration-500 group-hover:scale-110 ${style.blob}`}
      />

      <div className="relative flex flex-col justify-between h-full min-h-44.5">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${style.iconBg} ${style.iconShadow} transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs sm:text-[13px] font-bold text-fg tracking-tight">
            {card.label}
          </p>
          <p className="mt-1 text-3xl sm:text-[34px] font-black tracking-tight text-fg leading-none">
            {card.value}
          </p>
        </div>

        {/* Optional progress bar. Only rendered when the caller sets
            `card.progress`. Track is a sunken well; fill uses a semantic
            tone (defaults to brand). Values outside 0–100 are clamped. */}
        {card.progress && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full shadow-sunken">
              <div
                className={`h-full rounded-full transition-all ${progressToneClass(card.progress.tone)}`}
                style={{
                  width: `${Math.min(100, Math.max(0, card.progress.value))}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {card.delta && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex items-center text-xs font-black ${
                    isPositive
                      ? 'text-success'
                      : isNegative
                        ? 'text-error'
                        : 'text-fg-muted'
                  }`}
                >
                  {isPositive && <ArrowUp size={13} strokeWidth={3} className="mr-0.5" />}
                  {isNegative && <ArrowDown size={13} strokeWidth={3} className="mr-0.5" />}
                  {card.delta}
                </span>
                <span className="text-[11px] font-medium text-fg-muted">
                  {card.deltaLabel}
                </span>
              </div>
            )}

            {card.footerLabel && (
              <p className="mt-1 text-[11px] font-normal text-fg-muted">
                {card.footerLabel}
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center justify-end">
            {renderMiniGraphic(card.miniGraphicType)}
          </div>
        </div>
      </div>
    </>
  )

  const baseClass = `group relative isolate overflow-hidden rounded-[26px] p-5 text-left transition-shadow duration-300 ${surfaceClass}`

  // Interactive cards render as a <button>. Non-interactive ones stay a
  // <div> — this avoids attaching focus/cursor affordances that would
  // suggest a click target when there isn't one.
  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={`w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${baseClass}`}
      >
        {inner}
      </button>
    )
  }

  return <div className={baseClass}>{inner}</div>
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

const COLUMNS_CLASS: Record<NonNullable<StatsGridProps['columns']>, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
  8: 'lg:grid-cols-8',
}

export default function StatsGrid<T = DashboardStats>({
  stats,
  loading,
  cards,
  columns = 4,
  resolveValue,
  showHeader = true,
  onCardClick,
  activeCardId = null,
}: StatsGridProps<T>) {
  const [selectedYear, setSelectedYear] = useState('2025 – 2026')
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 ${COLUMNS_CLASS[columns]}`}>
        {cards.map((card) => (
          <StatCardSkeleton key={`skeleton-${card.id}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <div className="flex items-center gap-3">
            {/* Brand-tinted badge. Uses a sunken well so it reads as
                "carved into" the header row rather than sitting on top
                with a hairline border. The tinted background carries
                the brand identity; the shadow carries the depth. */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
              <BarChart3 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-fg">
                Key Performance Indicators
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted">
                Overall school performance at a glance
              </p>
            </div>
          </div>

          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowYearDropdown((v) => !v)}
              // glass-interactive gives the neumorphic hover-lift and
              // press-in gesture, which is appropriate here because the
              // button IS interactive.
              className="glass-sm glass-interactive flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-fg"
            >
              <Calendar size={14} className="text-fg-muted" />
              <span>{selectedYear}</span>
              <ChevronDown size={14} className="text-fg-muted" />
            </button>

            {showYearDropdown && (
              // dropdown-surface already carries the wide elevated shadow
              // and the flush background. The old `shadow-lg` was
              // overriding it, so it's removed.
              <div className="dropdown-surface right-0 top-full mt-1.5 z-30 w-36 rounded-2xl p-1">
                {['2025 – 2026', '2024 – 2025', '2023 – 2024'].map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearDropdown(false)
                    }}
                    className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      selectedYear === year
                        ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold'
                        : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 ${COLUMNS_CLASS[columns]}`}>
        {cards.map((card) => {
          const value = resolveValue
            ? resolveValue(card, stats)
            : isDashboardStats(stats)
              ? card.value
              : card.value

          // Clickable only when the caller supplied a handler AND the
          // card hasn't opted out. This lets the same grid mix
          // interactive filter tiles with informational ones.
          const clickable = onCardClick && !card.noClick

          return (
            <KPICardView
              key={card.id}
              card={{ ...card, value }}
              onClick={clickable ? () => onCardClick(card.id) : undefined}
              isActive={activeCardId === card.id}
            />
          )
        })}
      </div>

      {showHeader && (
        <div className="flex items-center gap-2 pt-1 px-1 text-xs font-medium text-fg-muted">
          <Sparkles size={13} className="text-brand-500" />
          <span>Better Learning</span>
          <span>•</span>
          <span>Brighter Future</span>
        </div>
      )}
    </div>
  )
}