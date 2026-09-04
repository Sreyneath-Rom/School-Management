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
  slots,
  onEditSlot,
  onDeleteSlot,
}) => {
  if (slots.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-text-main/50 border border-text-main/10">
        <Calendar size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-text-main">No Timetable Periods Found</p>
        <p className="text-xs">Adjust your class or teacher filter or click "Add Period" above.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[26px] glass-sm border border-text-main/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-text-main/5 border-b border-text-main/10 text-xs font-bold uppercase tracking-wider text-text-main/60">
            <tr>
              <th className="px-6 py-4">Day & Time</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-main/5">
            {slots.map((s) => (
              <tr key={s.id} className="hover:bg-text-main/5 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-text-main/10 px-2 py-0.5 font-bold text-xs text-text-main">
                      {DAYS[s.dayOfWeek] || 'Day'}
                    </span>
                    <span className="font-mono text-xs text-text-main/70">
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-text-main">{s.className || 'Grade 10-A'}</td>
                <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                  {s.subjectName}
                </td>
                <td className="px-6 py-4 text-text-main/80 flex items-center gap-1.5 mt-3">
                  <User size={13} className="text-text-main/40" />
                  <span>{s.teacherName}</span>
                </td>
                <td className="px-6 py-4 text-text-main/70">
                  <span className="rounded-md bg-text-main/10 px-2 py-0.5 text-xs">{s.room}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditSlot(s)}
                      className="rounded-lg p-1.5 text-text-main/50 hover:bg-brand-500/10 hover:text-brand-600 transition"
                      title="Edit slot"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove period for ${s.subjectName}?`)) onDeleteSlot(s.id)
                      }}
                      className="rounded-lg p-1.5 text-text-main/50 hover:bg-error/10 hover:text-error transition"
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
