import { useState } from 'react'
import { Download, Plus, AlertTriangle, GripVertical } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'

const tabs = ['Class Schedules', 'Teacher Timetables', 'Exam Schedules']
const days = [
  { label: 'Mon', date: 'May 13' },
  { label: 'Tue', date: 'May 14' },
  { label: 'Wed', date: 'May 15' },
  { label: 'Thu', date: 'May 16' },
  { label: 'Fri', date: 'May 17' },
  { label: 'Sat', date: 'May 18' },
]
const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']

type Block = {
  id: string
  day: number
  row: number
  span?: number
  title: string
  meta: string
  color: string
  conflict?: boolean
}

const initialBlocks: Block[] = [
  { id: 'b1', day: 0, row: 0, title: 'Advanced Biology', meta: '10-A • Room 302', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'b2', day: 2, row: 0, title: 'Chemistry', meta: '10-A • Lab 04', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'b3', day: 5, row: 0, title: 'Advanced Biology', meta: '10-A • Room 302', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'b4', day: 1, row: 1, title: 'Calculus BC', meta: '10-A • Lab 12', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'b5', day: 2, row: 1, title: 'World History', meta: '10-A • Room 101', color: 'bg-sky-100 text-sky-800 border-sky-200', span: 2 },
  { id: 'b6', day: 1, row: 2, title: 'Literature II', meta: '10-A • Room 405', color: 'bg-violet-100 text-violet-800 border-violet-200', conflict: true },
  { id: 'b7', day: 0, row: 3, title: 'Physical Ed', meta: '10-A • Gym B', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'b8', day: 3, row: 3, title: 'Calculus BC', meta: '10-A • Lab 12', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'b9', day: 4, row: 3, title: 'Calculus BC', meta: '10-A • Lab 12', color: 'bg-amber-100 text-amber-800 border-amber-200' },
]

const isMaintenanceCell = (dayIndex: number, rowIndex: number) => rowIndex === 2 && dayIndex >= 3

const alerts = [
  {
    title: 'Room 302 Conflict',
    detail: 'Tuesday, 10:00 AM. Biology and Calculus both assigned to Room 302.',
  },
  {
    title: 'Faculty Overload',
    detail: 'Mr. Henderson is scheduled for 7 consecutive hours on Wednesday.',
  },
]

const pending = [
  { title: 'Art & Design Elective', detail: 'Grade 11 • Unassigned Room' },
  { title: 'French Language', detail: 'Grade 10 • Missing Substitute' },
]

export default function Schedules() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [view, setView] = useState<'D' | 'W' | 'M'>('W')
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ day: number; row: number } | null>(null)

  const findBlock = (dayIndex: number, rowIndex: number) =>
    blocks.find((b) => b.day === dayIndex && b.row === rowIndex)

  const isCovered = (dayIndex: number, rowIndex: number) =>
    blocks.some((b) => b.span && dayIndex > b.day && dayIndex <= b.day + b.span - 1 && b.row === rowIndex)

  // Checks whether `block` can legally occupy the cell(s) starting at (dayIndex, rowIndex),
  // accounting for its span width, other lessons already there, and the maintenance window.
  const canDropAt = (dayIndex: number, rowIndex: number, block: Block) => {
    const span = block.span ?? 1
    if (dayIndex + span - 1 >= days.length) return false
    for (let i = 0; i < span; i += 1) {
      const d = dayIndex + i
      if (isMaintenanceCell(d, rowIndex)) return false
      const occupant = blocks.find((b) => b.id !== block.id && b.day === d && b.row === rowIndex)
      if (occupant) return false
      const coveredByOther = blocks.some(
        (b) => b.id !== block.id && b.span && d > b.day && d <= b.day + b.span - 1 && b.row === rowIndex
      )
      if (coveredByOther) return false
    }
    return true
  }

  const draggedBlock = blocks.find((b) => b.id === draggedId) ?? null
  const dragOverValid =
    !!draggedBlock && !!dragOverCell && canDropAt(dragOverCell.day, dragOverCell.row, draggedBlock)

  const handleDragStart = (e: React.DragEvent, block: Block) => {
    setDraggedId(block.id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', block.id)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverCell(null)
  }

  const handleCellDragOver = (e: React.DragEvent, dayIndex: number, rowIndex: number) => {
    if (!draggedBlock) return
    e.preventDefault()
    e.dataTransfer.dropEffect = canDropAt(dayIndex, rowIndex, draggedBlock) ? 'move' : 'none'
    setDragOverCell({ day: dayIndex, row: rowIndex })
  }

  const handleCellDragLeave = () => {
    setDragOverCell(null)
  }

  const handleCellDrop = (e: React.DragEvent, dayIndex: number, rowIndex: number) => {
    e.preventDefault()
    setDragOverCell(null)
    if (!draggedBlock || !canDropAt(dayIndex, rowIndex, draggedBlock)) {
      setDraggedId(null)
      return
    }
    setBlocks((prev) =>
      prev.map((b) => (b.id === draggedBlock.id ? { ...b, day: dayIndex, row: rowIndex } : b))
    )
    setDraggedId(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading
          title="Schedule Management"
          subtitle="Organize class timetables, faculty assignments, and exam periods."
        />
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-sm font-semibold text-stone-700 dark:text-stone-300 transition hover:bg-stone-50 dark:hover:bg-stone-700">
            <Download size={16} />
            Export Schedule
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800">
            <Plus size={17} />
            Create New Schedule
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] glass-sm p-3">
        <div className="flex items-center gap-1 rounded-2xl bg-stone-50 dark:bg-stone-800 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 outline-none focus:border-brand-400">
            <option>Grade 10</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
          </select>
          <select className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 outline-none focus:border-brand-400">
            <option>Semester 1</option>
            <option>Semester 2</option>
          </select>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-700" />
          <div className="flex items-center gap-1 rounded-xl bg-stone-50 dark:bg-stone-800 p-1">
            {(['D', 'W', 'M'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                  view === v ? 'bg-brand-600 text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2.1fr_1fr]">
        <div className="overflow-x-auto rounded-[28px] glass-sm p-4">
          <table className="w-full min-w-180 table-fixed border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-20 text-left text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Time</th>
                {days.map((d, i) => (
                  <th
                    key={d.label}
                    className={`rounded-xl px-2 py-2 text-sm ${
                      i === 2 ? 'bg-brand-700 text-white' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="font-bold">{d.label}</div>
                    <div className={`text-xs ${i === 2 ? 'text-brand-100' : 'text-stone-400 dark:text-stone-500'}`}>{d.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, rowIndex) => (
                <tr key={time}>
                  <td className="align-top text-xs font-semibold text-stone-400 dark:text-stone-500">{time}</td>
                  {days.map((_, dayIndex) => {
                    if (isCovered(dayIndex, rowIndex)) return null
                    const block = findBlock(dayIndex, rowIndex)
                    const isMaintenance = isMaintenanceCell(dayIndex, rowIndex)
                    if (isMaintenance && dayIndex === 3) {
                      return (
                        <td key={dayIndex} colSpan={3} className="align-top">
                          <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-xs font-semibold uppercase tracking-widest text-rose-500 dark:text-rose-400">
                            Maintenance Window
                          </div>
                        </td>
                      )
                    }
                    if (isMaintenance) return null
                    if (block) {
                      const isDragging = draggedId === block.id
                      return (
                        <td key={dayIndex} colSpan={block.span ?? 1} className="align-top">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            onDragEnd={handleDragEnd}
                            className={`relative h-20 cursor-grab rounded-xl border p-2.5 text-xs transition active:cursor-grabbing ${block.color} ${
                              isDragging ? 'opacity-40' : ''
                            }`}
                          >
                            {block.conflict && (
                              <span className="absolute -top-2 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                                Conflict
                              </span>
                            )}
                            <div className="font-semibold">{block.title}</div>
                            <div className="mt-1 opacity-80">{block.meta}</div>
                          </div>
                        </td>
                      )
                    }
                    const isDragTarget = dragOverCell?.day === dayIndex && dragOverCell?.row === rowIndex
                    return (
                      <td key={dayIndex} className="align-top">
                        <button
                          onDragOver={(e) => handleCellDragOver(e, dayIndex, rowIndex)}
                          onDragLeave={handleCellDragLeave}
                          onDrop={(e) => handleCellDrop(e, dayIndex, rowIndex)}
                          className={`flex h-20 w-full items-center justify-center rounded-xl border border-dashed text-xs font-medium transition ${
                            isDragTarget
                              ? dragOverValid
                                ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-300'
                                : 'border-rose-400 bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                              : 'border-stone-200 dark:border-stone-700 text-stone-300 dark:text-stone-600 hover:border-brand-300 hover:text-brand-500 dark:hover:border-brand-600 dark:hover:text-brand-400'
                          }`}
                        >
                          {isDragTarget ? (dragOverValid ? 'Drop here' : 'Unavailable') : '+ Add Lesson'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-base font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle size={18} />
              Scheduling Alerts
            </div>
            <div className="mt-4 space-y-4">
              {alerts.map((alert) => (
                <div key={alert.title} className="border-l-2 border-rose-400 dark:border-rose-600 pl-3">
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{alert.title}</div>
                  <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{alert.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] glass-sm p-6">
            <div className="text-base font-bold text-stone-900 dark:text-stone-100">Pending Assignments</div>
            <div className="mt-4 space-y-3">
              {pending.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl bg-stone-50 dark:bg-stone-800 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.title}</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">{item.detail}</div>
                  </div>
                  <GripVertical size={16} className="text-stone-300 dark:text-stone-600" />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-stone-200 dark:border-stone-700 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-400 transition hover:bg-stone-50 dark:hover:bg-stone-800">
              View All (8)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}