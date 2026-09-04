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

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  sky: {
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/30 hover:border-sky-500/60',
    text: 'text-sky-400',
    badge: 'bg-sky-500/20 text-sky-300',
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  amber: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  violet: {
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30 hover:border-violet-500/60',
    text: 'text-violet-400',
    badge: 'bg-violet-500/20 text-violet-300',
  },
  rose: {
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30 hover:border-rose-500/60',
    text: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
  },
  indigo: {
    bg: 'bg-indigo-500/15',
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    text: 'text-indigo-400',
    badge: 'bg-indigo-500/20 text-indigo-300',
  },
}

export const ScheduleTimetableGrid: React.FC<ScheduleTimetableGridProps> = ({
  slots = [],
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) => {
  const safeSlots = Array.isArray(slots) ? slots : []
  return (
    <div className="overflow-hidden rounded-[28px] glass-sm border border-text-main/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-text-main/5 border-b border-text-main/10">
              <th className="w-32 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-main/50">
                Period / Time
              </th>
              {DAYS.map((day, idx) => (
                <th
                  key={day}
                  className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-text-main/80"
                >
                  <span className="block font-bold">{day}</span>
                  <span className="text-[10px] text-text-main/40 font-normal">Day {idx + 1}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-text-main/5">
            {PERIODS.map((period) => (
              <tr key={period.start} className="hover:bg-text-main/[0.02] transition">
                <td className="px-4 py-4 align-top border-r border-text-main/5">
                  <span className="block font-bold text-xs text-text-main">{period.label}</span>
                  <span className="block text-[11px] font-mono text-text-main/50 mt-0.5">
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
                      className="px-2.5 py-2.5 align-top min-w-[150px] border-r border-text-main/5 last:border-r-0"
                    >
                      {matchingSlots.length > 0 ? (
                        <div className="space-y-2">
                          {matchingSlots.map((slot) => {
                            const colors =
                              COLOR_MAP[slot.colorTheme || 'sky'] || COLOR_MAP.sky

                            return (
                              <div
                                key={slot.id}
                                onClick={() => onEditSlot(slot)}
                                className={`group relative rounded-2xl p-3 border transition-all cursor-pointer shadow-sm hover:scale-[1.02] ${colors.bg} ${colors.border}`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span
                                    className={`rounded-lg px-2 py-0.5 font-bold text-[11px] ${colors.badge}`}
                                  >
                                    {slot.className || '10-A'}
                                  </span>

                                  <div
                                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => onEditSlot(slot)}
                                      className="rounded p-1 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition"
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
                                      className="rounded p-1 text-text-main/50 hover:bg-error/10 hover:text-error transition"
                                      title="Delete slot"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                <p className="mt-1.5 font-bold text-xs text-text-main line-clamp-1">
                                  {slot.subjectName}
                                </p>

                                <div className="mt-2 flex flex-col gap-1 text-[11px] text-text-main/65">
                                  <div className="flex items-center gap-1 truncate">
                                    <User size={11} className="shrink-0 text-text-main/40" />
                                    <span className="truncate">{slot.teacherName}</span>
                                  </div>
                                  <div className="flex items-center gap-1 truncate">
                                    <MapPin size={11} className="shrink-0 text-text-main/40" />
                                    <span className="truncate">{slot.room || 'Room 101'}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddSlot(dayIdx, period.start)}
                          className="flex h-24 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-text-main/10 bg-text-main/[0.02] text-text-main/30 hover:border-brand-500/40 hover:bg-brand-500/5 hover:text-brand-500 transition-all cursor-pointer group"
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
