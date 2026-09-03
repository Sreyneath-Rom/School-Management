import { useState } from 'react'
import type { ReactNode } from 'react'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'

export interface ResponsiveTableContainerProps {
  /** The standard desktop table element */
  tableContent: ReactNode
  /** Optional mobile-optimized card list view */
  cardContent?: ReactNode
  /** Allow user to toggle between table and card view manually on mobile/tablet */
  allowViewToggle?: boolean
  /** Default view mode on mobile when both exist */
  defaultMobileView?: 'cards' | 'table'
  className?: string
}

export function ResponsiveTableContainer({
  tableContent,
  cardContent,
  allowViewToggle = true,
  defaultMobileView = 'cards',
  className = '',
}: ResponsiveTableContainerProps) {
  const [activeView, setActiveView] = useState<'cards' | 'table'>(defaultMobileView)

  const hasCards = Boolean(cardContent)

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-stone-200/70 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-xs ${className}`}>
      {/* Mobile / Tablet View Switcher toolbar if cards exist and view toggle is allowed */}
      {hasCards && allowViewToggle && (
        <div className="md:hidden flex items-center justify-between p-2.5 bg-stone-50/80 dark:bg-stone-800/40 border-b border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-stone-400">
            Display Mode
          </span>
          <div className="inline-flex rounded-xl bg-stone-200/70 dark:bg-stone-800 p-0.5">
            <button
              type="button"
              onClick={() => setActiveView('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                activeView === 'cards'
                  ? 'bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                activeView === 'table'
                  ? 'bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <TableIcon size={13} />
              <span>Table</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop always renders Table */}
      <div className={`${hasCards && activeView === 'cards' ? 'hidden md:block' : 'block'} overflow-x-auto no-scrollbar`}>
        {tableContent}
      </div>

      {/* Mobile Card list view */}
      {hasCards && (
        <div className={`${activeView === 'cards' ? 'block md:hidden' : 'hidden'}`}>
          {cardContent}
        </div>
      )}
    </div>
  )
}
