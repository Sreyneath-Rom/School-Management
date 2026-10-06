import { useId } from 'react'

import {
  CalendarClock,
  Users,
} from 'lucide-react'

import type { StatAccent } from './StatsGrid'

/* ------------------------------------------------------------------ */
/* Wave paths                                                         */
/* ------------------------------------------------------------------ */

const WAVE_PATHS: Record<StatAccent, string> = {
  info:
    'M0 30 C20 25, 32 18, 50 23 C68 28, 76 14, 96 18 C118 23, 130 11, 150 15 C170 19, 185 9, 205 13 C225 17, 242 4, 260 9 C275 13, 290 3, 300 6',

  success:
    'M0 31 C20 26, 34 17, 52 22 C70 27, 80 13, 98 17 C118 21, 132 9, 150 13 C170 17, 185 8, 205 11 C225 14, 242 4, 260 8 C278 11, 290 2, 300 5',

  warning:
    'M0 32 C20 30, 35 24, 52 26 C70 29, 82 16, 100 20 C120 24, 134 14, 152 17 C172 20, 188 11, 207 14 C225 17, 242 6, 260 11 C278 14, 290 7, 300 9',

  error:
    'M0 34 C18 32, 34 25, 52 29 C70 32, 82 18, 101 22 C120 26, 134 14, 153 18 C172 21, 188 12, 207 15 C227 18, 243 8, 260 12 C278 16, 290 5, 300 8',

  brand:
    'M0 31 C20 28, 35 21, 52 25 C70 29, 82 15, 100 20 C120 25, 134 12, 153 16 C172 20, 188 10, 207 14 C227 18, 243 7, 260 11 C278 15, 290 6, 300 9',
}

/* ------------------------------------------------------------------ */
/* Wave gradients                                                     */
/* ------------------------------------------------------------------ */

const WAVE_GRADIENTS: Record<
  StatAccent,
  [string, string]
> = {
  info: ['#38BDF8', '#6366F1'],
  success: ['#34D399', '#06B6D4'],
  warning: ['#FBBF24', '#F43F5E'],
  error: ['#FB7185', '#D946EF'],
  brand: ['#A78BFA', '#4F46E5'],
}

/* ------------------------------------------------------------------ */
/* Wave Line                                                          */
/* ------------------------------------------------------------------ */

function WaveLine({
  from,
  to,
  d,
}: {
  from: string
  to: string
  d: string
}) {
  const rawId = useId()
  const id = `wave-${rawId.replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 300 40"
      preserveAspectRatio="none"
      className="h-14 w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* Main gradient */}
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor={from}
          />

          <stop
            offset="100%"
            stopColor={to}
          />
        </linearGradient>
      </defs>

      {/* ---------------------------------------------------------- */}
      {/* Soft glow                                                   */}
      {/* ---------------------------------------------------------- */}

      <path
        d={d}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.10"
        style={{
          filter: 'blur(5px)',
        }}
      />

      {/* ---------------------------------------------------------- */}
      {/* Secondary glow                                              */}
      {/* ---------------------------------------------------------- */}

      <path
        d={d}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.16"
      />

      {/* ---------------------------------------------------------- */}
      {/* Main wave                                                    */}
      {/* ---------------------------------------------------------- */}

      <path
        d={d}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Main Accent Wave                                                   */
/* ------------------------------------------------------------------ */

export function AccentWave({
  accent,
}: {
  accent: StatAccent
}) {
  const [from, to] = WAVE_GRADIENTS[accent]

  return (
    <WaveLine
      from={from}
      to={to}
      d={WAVE_PATHS[accent]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Legacy Components                                                  */
/* ------------------------------------------------------------------ */

export function BarsSuccess() {
  return (
    <div className="flex h-10 items-end gap-1.5">
      <span className="h-3 w-2 rounded-t-full bg-success/60" />

      <span className="h-5 w-2 rounded-t-full bg-success/75" />

      <span className="h-7 w-2 rounded-t-full bg-success/90" />

      <span className="h-9 w-2 rounded-t-full bg-brand-500" />
    </div>
  )
}

export function BarsBrand() {
  return (
    <div className="flex h-10 items-end gap-1.5">
      <span className="h-2.5 w-2 rounded-t-full bg-brand-400/60" />

      <span className="h-4 w-2 rounded-t-full bg-brand-400/75" />

      <span className="h-6 w-2 rounded-t-full bg-brand-500/85" />

      <span className="h-8 w-2 rounded-t-full bg-brand-500" />

      <span className="h-10 w-2 rounded-t-full bg-brand-600" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Progress Rings                                                     */
/* ------------------------------------------------------------------ */

export function RingWarning({
  percentage = 96.5,
}: {
  percentage?: number
}) {
  return (
    <ProgressRing
      percentage={percentage}
      tone="warning"
    />
  )
}

export function RingInfo({
  percentage = 98,
}: {
  percentage?: number
}) {
  return (
    <ProgressRing
      percentage={percentage}
      tone="info"
    />
  )
}

function ProgressRing({
  percentage,
  tone,
}: {
  percentage: number
  tone: 'warning' | 'info'
}) {
  const radius = 24
  const circumference = 2 * Math.PI * radius

  const safePercentage = Math.min(
    100,
    Math.max(0, percentage),
  )

  const offset =
    circumference -
    (circumference * safePercentage) / 100

  const track =
    tone === 'warning'
      ? 'text-warning/30'
      : 'text-info/30'

  const fill =
    tone === 'warning'
      ? 'text-warning'
      : 'text-info'

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg
        className="h-14 w-14 -rotate-90"
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className={track}
        />

        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className={fill}
        />
      </svg>

      <span className="absolute text-[11px] font-black text-fg">
        {safePercentage}%
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Avatar                                                             */
/* ------------------------------------------------------------------ */

export function AvatarStack() {
  return (
    <div className="flex items-center -space-x-1.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-surface">
        <Users size={14} />
      </span>

      <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-surface">
        <Users size={16} />
      </span>

      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-surface">
        <Users size={14} />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Calendar Badge                                                     */
/* ------------------------------------------------------------------ */

export function CalendarBadge() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/15 text-success ring-1 ring-success/25">
      <CalendarClock
        size={24}
        strokeWidth={2}
      />
    </div>
  )
}