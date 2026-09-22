// src/features/setup/schedules/ScheduleTimetableGrid.tsx
import React from 'react'
import { Plus, Edit2, Trash2, MapPin, User } from 'lucide-react'
import type { ScheduleSlot } from '@/services/scheduleService'

interface ScheduleTimetableGridProps {
  slots?: ScheduleSlot[]
  onAddSlot: (dayOfWeek: number, startTime: string) => void
  onEditSlot: (slot: ScheduleSlot) => void
  onDeleteSlot: (slotId: string) => void
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const PERIODS = [
  { start: '08:00', end: '09:30', label: 'Period 1', time: '08:00 - 09:30' },
  { start: '10:00', end: '11:30', label: 'Period 2', time: '10:00 - 11:30' },
  { start: '13:00', end: '14:30', label: 'Period 3', time: '13:00 - 14:30' },
  { start: '15:00', end: '16:30', label: 'Period 4', time: '15:00 - 16:30' },
]

/* Per-slot accent color, user-chosen. These are data, not surface — they
   intentionally stay saturated. The border-tinted variants are dropped
   in favor of a subtle raised shadow, which reads correctly on the flat
   neumorphic surface. */
const COLOR_MAP: Record<string, { bg: string; text: string; badge: string }> = {
  sky:     { bg: 'bg-sky-500/15',     text: 'text-sky-700 dark:text-sky-300',         badge: 'bg-sky-500/25 text-sky-800 dark:text-sky-200' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-500/25 text-emerald-800 dark:text-emerald-200' },
  amber:   { bg: 'bg-amber-500/15',   text: 'text-amber-700 dark:text-amber-300',     badge: 'bg-amber-500/25 text-amber-800 dark:text-amber-200' },
  violet:  { bg: 'bg-violet-500/15',  text: 'text-violet-700 dark:text-violet-300',   badge: 'bg-violet-500/25 text-violet-800 dark:text-violet-200' },
  rose:    { bg: 'bg-rose-500/15',    text: 'text-rose-700 dark:text-rose-300',       badge: 'bg-rose-500/25 text-rose-800 dark:text-rose-200' },
  indigo:  { bg: 'bg-indigo-500/15',  text: 'text-indigo-700 dark:text-indigo-300',   badge: 'bg-indigo-500/25 text-indigo-800 dark:text-indigo-200' },
}

export const ScheduleTimetableGrid: React.FC<ScheduleTimetableGridProps> = ({
  slots = [], onAddSlot, onEditSlot, onDeleteSlot,
}) => {
  const safeSlots = Array.isArray(slots) ? slots : []
  return (
    <div className="overflow-hidden rounded-[28px] glass-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead>
            <tr className="shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <th className="w-32 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-fg-muted">
                Period / Time
              </th>
              {DAYS.map((day, idx) => (
                <th
                  key={day}
                  className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-fg"
                >
                  <span className="block font-bold">{day}</span>
                  <span className="text-[10px] text-fg-muted font-normal">Day {idx + 1}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {PERIODS.map((period) => (
              <tr key={period.start}>
                <td className="px-4 py-4 align-top shadow-[inset_-1px_0_0_var(--neu-shadow-dark)]">
                  <span className="block font-bold text-xs text-fg">{period.label}</span>
                  <span className="block text-[11px] font-mono text-fg-muted mt-0.5">
                    {period.time}
                  </span>
                </td>

                {DAYS.map((_, dayIdx) => {
                  const matchingSlots = safeSlots.filter(
                    (s) => s && s.dayOfWeek === dayIdx && s.startTime === period.start
                  )

                  return (
                    <td
                      key={dayIdx}
                      className="px-2.5 py-2.5 align-top min-w-37.5 shadow-[inset_-1px_0_0_var(--neu-shadow-dark)] last:shadow-none"
                    >
                      {matchingSlots.length > 0 ? (
                        <div className="space-y-2">
                          {matchingSlots.map((slot) => {
                            const colors = COLOR_MAP[slot.colorTheme || 'sky'] || COLOR_MAP.sky

                            return (
                              <div
                                key={slot.id}
                                onClick={() => onEditSlot(slot)}
                                // Slot card: tinted bg is per-slot data
                                // (colorTheme), so it stays. The border
                                // gives way to a raised shadow — cleaner
                                // under neumorphism and hover still lifts.
                                className={`group relative rounded-2xl p-3 transition-all cursor-pointer shadow-sm hover:shadow-md ${colors.bg}`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className={`rounded-lg px-2 py-0.5 font-bold text-[11px] ${colors.badge}`}>
                                    {slot.className || '10-A'}
                                  </span>

                                  <div
                                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => onEditSlot(slot)}
                                      className="rounded p-1 text-fg-muted hover:text-fg hover:shadow-sunken transition"
                                      title="Edit slot"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Remove period for ${slot.subjectName}?`)) {
                                          onDeleteSlot(slot.id)
                                        }
                                      }}
                                      className="rounded p-1 text-fg-muted hover:text-error hover:shadow-sunken transition"
                                      title="Delete slot"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                <p className="mt-1.5 font-bold text-xs text-fg line-clamp-1">
                                  {slot.subjectName}
                                </p>

                                <div className="mt-2 flex flex-col gap-1 text-[11px] text-fg-muted">
                                  <div className="flex items-center gap-1 truncate">
                                    <User size={11} className="shrink-0 text-fg-muted/70" />
                                    <span className="truncate">{slot.teacherName}</span>
                                  </div>
                                  <div className="flex items-center gap-1 truncate">
                                    <MapPin size={11} className="shrink-0 text-fg-muted/70" />
                                    <span className="truncate">{slot.room || 'Room 101'}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        // Empty cell: dashed border remains (it's an
                        // affordance, not decoration) but tinted against
                        // --neu-shadow-dark so it's visible. Fills in with
                        // a sunken well on hover.
                        <button
                          type="button"
                          onClick={() => onAddSlot(dayIdx, period.start)}
                          className="flex h-24 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-(--neu-shadow-dark) text-fg-muted/60 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken hover:border-brand-500/50 transition-all cursor-pointer group"
                        >
                          <Plus size={16} className="group-hover:scale-110 transition" />
                          <span className="mt-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                            Assign
                          </span>
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}