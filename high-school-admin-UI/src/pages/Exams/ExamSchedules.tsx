// src/pages/Exams/ExamSchedules.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Calendar,
  Search,
  Clock,
  DoorOpen,
  User,
  RefreshCw,
  Info,
} from 'lucide-react'
import { examService, type ExamScheduleRecord } from '@/services/examService'

export default function ExamSchedules() {
  const [schedules, setSchedules] = useState<ExamScheduleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await examService.schedules()
      setSchedules(Array.isArray(data) ? data : [])
    } catch {
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = schedules.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.subject.toLowerCase().includes(q) ||
      s.supervisor.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Exam Timetables"
          subtitle="Paper schedule, rooms, and invigilator assignments."
        />
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-strong text-color text-xs font-semibold transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          The exam schedules endpoint is part of the same stub module. Once
          the ExamSchedule model lands, this table will populate automatically.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-surface">
        <div className="p-4 border-b border-surface flex items-center gap-3">
          <Search size={16} className="text-secondary" />
          <input
            type="text"
            placeholder="Search subject, invigilator, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent text-color placeholder:text-secondary focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading schedules...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-secondary" />
            <p className="text-sm font-semibold text-color">
              {schedules.length === 0 ? 'No schedules yet' : 'No matches'}
            </p>
            <p className="text-xs text-secondary mt-1">
              {schedules.length === 0
                ? 'Schedules will appear here once the backend module is implemented.'
                : 'Try a different search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong text-secondary font-semibold border-b border-surface">
                <tr>
                  <th className="p-3.5">Date & time</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Room</th>
                  <th className="p-3.5">Invigilator</th>
                  <th className="p-3.5 text-right">Max / Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((slot) => (
                  <tr key={slot.id} className="hover:bg-surface/40 transition">
                    <td className="p-3.5">
                      <div className="font-semibold text-color flex items-center gap-1.5">
                        <Calendar size={13} className="text-brand-500" />
                        {slot.date}
                      </div>
                      <div className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {slot.timeSlot}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-color">
                      {slot.subject}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-surface-strong text-secondary inline-flex items-center gap-1">
                        <DoorOpen size={12} /> {slot.room}
                      </span>
                    </td>
                    <td className="p-3.5 text-secondary">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-secondary" />
                        {slot.supervisor}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-color">
                      {slot.maxMarks} / {slot.passingMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}