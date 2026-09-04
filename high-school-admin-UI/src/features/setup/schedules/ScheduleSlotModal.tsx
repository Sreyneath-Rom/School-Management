// src/features/setup/schedules/ScheduleSlotModal.tsx
import React, { useEffect, useState } from 'react'
import { X, Calendar } from 'lucide-react'
import Button from '@/components/common/Button'
import type { ScheduleSlot, CreateSchedulePayload } from '@/services/scheduleService'
import type { SubjectItem } from '@/services/subjectService'

interface ScheduleSlotModalProps {
  isOpen: boolean
  isSubmitting: boolean
  slotToEdit: ScheduleSlot | null
  defaultDayOfWeek?: number
  defaultStartTime?: string
  subjects: SubjectItem[]
  onClose: () => void
  onSubmit: (data: CreateSchedulePayload) => void
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const CLASSES = [
  { id: 'cls-10a', name: 'Grade 10-A' },
  { id: 'cls-10b', name: 'Grade 10-B' },
  { id: 'cls-11a', name: 'Grade 11-A' },
  { id: 'cls-11b', name: 'Grade 11-B' },
  { id: 'cls-12a', name: 'Grade 12-A' },
]

const TIME_PRESETS = [
  { start: '08:00', end: '09:30', label: 'Period 1 (08:00 - 09:30)' },
  { start: '10:00', end: '11:30', label: 'Period 2 (10:00 - 11:30)' },
  { start: '13:00', end: '14:30', label: 'Period 3 (13:00 - 14:30)' },
  { start: '15:00', end: '16:30', label: 'Period 4 (15:00 - 16:30)' },
]

const COLOR_THEMES: ('sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo')[] = [
  'sky',
  'emerald',
  'amber',
  'violet',
  'rose',
  'indigo',
]

export const ScheduleSlotModal: React.FC<ScheduleSlotModalProps> = ({
  isOpen,
  isSubmitting,
  slotToEdit,
  defaultDayOfWeek = 0,
  defaultStartTime = '08:00',
  subjects,
  onClose,
  onSubmit,
}) => {
  const [classId, setClassId] = useState(CLASSES[0].id)
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [teacherName, setTeacherName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState(defaultDayOfWeek)
  const [startTime, setStartTime] = useState(defaultStartTime)
  const [endTime, setEndTime] = useState('09:30')
  const [room, setRoom] = useState('Room 101')
  const [colorTheme, setColorTheme] = useState<'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo'>('sky')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slotToEdit) {
      setClassId(slotToEdit.classId)
      setSubjectId(slotToEdit.subjectId)
      setTeacherName(slotToEdit.teacherName)
      setDayOfWeek(slotToEdit.dayOfWeek)
      setStartTime(slotToEdit.startTime)
      setEndTime(slotToEdit.endTime)
      setRoom(slotToEdit.room)
      setColorTheme(slotToEdit.colorTheme || 'sky')
    } else {
      setClassId(CLASSES[0].id)
      setSubjectId(subjects[0]?.id || '')
      setDayOfWeek(defaultDayOfWeek)
      setStartTime(defaultStartTime)
      setEndTime(defaultStartTime === '08:00' ? '09:30' : defaultStartTime === '10:00' ? '11:30' : '14:30')
      setRoom('Room 101')
      setColorTheme('sky')

      const sub = subjects[0]
      if (sub && sub.teachers && sub.teachers.length > 0) {
        setTeacherName(sub.teachers[0].name)
      } else {
        setTeacherName('Faculty Staff')
      }
    }
    setError(null)
  }, [slotToEdit, isOpen, subjects, defaultDayOfWeek, defaultStartTime])

  const handleSubjectChange = (subId: string) => {
    setSubjectId(subId)
    const selected = subjects.find((s) => s.id === subId)
    if (selected?.teachers && selected.teachers.length > 0) {
      setTeacherName(selected.teachers[0].name)
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedClass = CLASSES.find((c) => c.id === classId)
    const selectedSubject = subjects.find((s) => s.id === subjectId)

    if (!subjectId) {
      setError('Please select a subject')
      return
    }

    onSubmit({
      classId,
      className: selectedClass?.name || 'Class',
      subjectId,
      subjectName: selectedSubject?.name || 'Subject',
      teacherId: `t-${Date.now()}`,
      teacherName: teacherName.trim() || 'Instructor',
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      room: room.trim() || 'Room 101',
      colorTheme,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">
                {slotToEdit ? 'Edit Timetable Period' : 'Add Timetable Period'}
              </h2>
              <p className="text-xs text-text-main/55">Assign subject, room, teacher and time slot</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-3 text-xs text-error">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Target Class Cohort
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                {CLASSES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-800 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Day of Week
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                {DAYS.map((d, idx) => (
                  <option key={d} value={idx} className="bg-slate-800 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-800 text-white">
                  {s.code} — {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Instructor Name
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Dr. John Whitfield"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Classroom / Laboratory
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Lab 302 or Room 101"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
              Time Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_PRESETS.map((tp) => {
                const isSelected = startTime === tp.start && endTime === tp.end
                return (
                  <button
                    key={tp.start}
                    type="button"
                    onClick={() => {
                      setStartTime(tp.start)
                      setEndTime(tp.end)
                    }}
                    className={`rounded-xl p-2 text-xs font-medium transition cursor-pointer border ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500 text-brand-400 font-bold'
                        : 'bg-text-main/5 border-text-main/10 hover:border-text-main/20 text-text-main/80'
                    }`}
                  >
                    {tp.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = colorTheme === theme
                const bgMap: Record<string, string> = {
                  sky: 'bg-sky-500',
                  emerald: 'bg-emerald-500',
                  amber: 'bg-amber-500',
                  violet: 'bg-violet-500',
                  rose: 'bg-rose-500',
                  indigo: 'bg-indigo-500',
                }
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setColorTheme(theme)}
                    className={`h-7 w-7 rounded-full ${bgMap[theme]} transition-all cursor-pointer ${
                      isSelected ? 'ring-3 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={theme}
                  />
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="solid" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : slotToEdit ? 'Update Period' : 'Add Period'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
