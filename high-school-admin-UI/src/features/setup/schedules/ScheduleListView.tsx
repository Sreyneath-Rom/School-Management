// src/features/setup/schedules/ScheduleListView.tsx
import React from 'react'
import { Edit2, Trash2, Calendar, User } from 'lucide-react'
import type { ScheduleSlot } from '@/services/scheduleService'

interface ScheduleListViewProps {
  slots: ScheduleSlot[]
  onEditSlot: (slot: ScheduleSlot) => void
  onDeleteSlot: (slotId: string) => void
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const ScheduleListView: React.FC<ScheduleListViewProps> = ({
  slots, onEditSlot, onDeleteSlot,
}) => {
  if (slots.length === 0) {
    return (
      // Empty state: `.glass-sm` alone, no border (it was invisible).
      <div className="rounded-[28px] glass-sm p-12 text-center text-fg-muted">
        <Calendar size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-fg">No Timetable Periods Found</p>
        <p className="text-xs">Adjust your class or teacher filter or click "Add Period" above.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[26px] glass-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-bold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <tr>
              <th className="px-6 py-4">Day & Time</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {slots.map((s) => (
              <tr key={s.id} className="hover:shadow-sunken transition-shadow">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Day chip: sunken well */}
                    <span className="rounded-lg px-2 py-0.5 font-bold text-xs text-fg shadow-sunken">
                      {DAYS[s.dayOfWeek] || 'Day'}
                    </span>
                    <span className="font-mono text-xs text-fg-muted">
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-fg">{s.className || 'Grade 10-A'}</td>
                <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                  {s.subjectName}
                </td>
                <td className="px-6 py-4 text-fg-muted flex items-center gap-1.5 mt-3">
                  <User size={13} className="text-fg-muted/60" />
                  <span>{s.teacherName}</span>
                </td>
                <td className="px-6 py-4 text-fg-muted">
                  <span className="rounded-md px-2 py-0.5 text-xs shadow-sunken">
                    {s.room}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditSlot(s)}
                      className="rounded-lg p-1.5 text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition"
                      title="Edit slot"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove period for ${s.subjectName}?`)) onDeleteSlot(s.id)
                      }}
                      className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition"
                      title="Delete slot"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}