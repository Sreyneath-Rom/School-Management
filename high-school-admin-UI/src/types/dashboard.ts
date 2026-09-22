// src/types/dashboard.ts (additions to the StatCard interface)

export interface StatCard {
  id: string
  label: string
  value: string
  delta: string
  deltaDirection: 'up' | 'down' | 'neutral'
  deltaLabel: string
  icon: string
  tint:
    | 'blue' | 'green' | 'amber' | 'violet' | 'sky'
    | 'red' | 'pink' | 'purple' | 'orange' | 'emerald'
  footerLabel?: string
  miniGraphicType?:
    | 'wave-blue' | 'bars-teal' | 'wave-purple' | 'ring-orange'
    | 'bars-pink' | 'ring-blue' | 'users-purple' | 'calendar-mint'

  /**
   * Optional progress bar rendered below the label. When present, the
   * card gets a sunken track + colored fill; when absent, the card
   * renders without one.
   */
  progress?: {
    /** 0–100. Values outside the range are clamped. */
    value: number
    tone?: 'brand' | 'success' | 'info' | 'warning' | 'error'
  }

  /**
   * Set when the parent passes `onCardClick` but this particular card
   * should NOT be clickable (e.g. a summary card that isn't a filter).
   * Defaults to clickable when `onCardClick` exists.
   */
  noClick?: boolean
}