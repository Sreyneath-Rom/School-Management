// src/features/setup/schedules/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { Plus, LayoutGrid, List, RefreshCw } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { ScheduleStats } from './ScheduleStats'
import { ScheduleTimetableGrid } from './ScheduleTimetableGrid'
import { ScheduleListView } from './ScheduleListView'
import { ScheduleSlotModal } from './ScheduleSlotModal'
import {
  scheduleService,
  type ScheduleSlot,
  type CreateSchedulePayload,
} from '@/services/scheduleService'
import { subjectService, type SubjectItem } from '@/services/subjectService'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

const CLASSES = [
  { id: 'all', name: 'All Cohorts' },
  { id: 'cls-10a', name: 'Grade 10-A' },
  { id: 'cls-10b', name: 'Grade 10-B' },
  { id: 'cls-11a', name: 'Grade 11-A' },
  { id: 'cls-11b', name: 'Grade 11-B' },
  { id: 'cls-12a', name: 'Grade 12-A' },
]

export default function SchedulesFeature() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [selectedClassId, setSelectedClassId] = useState('cls-10a')
  const [viewMode, setViewMode] = useState<'timetable' | 'list'>('timetable')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slotToEdit, setSlotToEdit] = useState<ScheduleSlot | null>(null)
  const [modalDefaultDay, setModalDefaultDay] = useState(0)
  const [modalDefaultTime, setModalDefaultTime] = useState('08:00')

  const { success, error: notifyError } = useNotification()

  const loadData = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [fetchedSlots, fetchedSubjects] = await Promise.all([
        scheduleService.list(),
        subjectService.list(),
      ])
      setSlots(Array.isArray(fetchedSlots) ? fetchedSlots : [])
      setSubjects(Array.isArray(fetchedSubjects) ? fetchedSubjects : [])
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to fetch timetable schedules')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredSlots = useMemo(() => {
    const safeSlots = Array.isArray(slots) ? slots : []
    if (selectedClassId === 'all') return safeSlots
    return safeSlots.filter((s) => s && s.classId === selectedClassId)
  }, [slots, selectedClassId])

  const handleCreateOrUpdate = async (payload: CreateSchedulePayload) => {
    setIsSubmitting(true)
    try {
      if (slotToEdit) {
        const updated = await scheduleService.update(slotToEdit.id, payload)
        setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        success(`Updated period for ${updated.subjectName}`)
      } else {
        const created = await scheduleService.create(payload)
        setSlots((prev) => [...prev, created])
        success(`Added period for ${created.subjectName}`)
      }
      setIsModalOpen(false)
      setSlotToEdit(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await scheduleService.delete(id)
      setSlots((prev) => prev.filter((s) => s.id !== id))
      success('Period removed from schedule')
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to delete period')
    }
  }

  const handleAddSlotForTime = (dayOfWeek: number, startTime: string) => {
    setSlotToEdit(null)
    setModalDefaultDay(dayOfWeek)
    setModalDefaultTime(startTime)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Master Timetable & Schedules"
          subtitle="Manage class schedules, weekly period allocations, room assignments, and conflict resolution."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="solid"
            size="sm"
            onClick={() => {
              setSlotToEdit(null)
              setModalDefaultDay(0)
              setModalDefaultTime('08:00')
              setIsModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus size={16} /> Add Period
          </Button>
        </div>
      </div>

      <ScheduleStats slots={slots} />

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[24px] glass-sm p-4 border border-text-main/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-text-main/50">Viewing Class:</span>
          <div className="flex flex-wrap gap-1.5">
            {CLASSES.map((c) => {
              const isSelected = selectedClassId === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClassId(c.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-text-main/5 text-text-main/60 hover:bg-text-main/10'
                  }`}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={loadData}
            className="rounded-xl p-2 text-text-main/60 hover:bg-text-main/10 hover:text-text-main transition"
            title="Refresh schedules"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center rounded-2xl bg-text-main/10 p-1">
            <button
              type="button"
              onClick={() => setViewMode('timetable')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'timetable'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Weekly Timetable Grid"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Period List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-text-main/60">Loading timetable matrix...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-[24px] bg-error/10 border border-error/20 p-6 text-center text-error">
          <p className="font-bold mb-1">Failed to load schedule</p>
          <p className="text-xs">{loadError}</p>
        </div>
      ) : viewMode === 'timetable' ? (
        <ScheduleTimetableGrid
          slots={filteredSlots}
          onAddSlot={handleAddSlotForTime}
          onEditSlot={(slot) => {
            setSlotToEdit(slot)
            setIsModalOpen(true)
          }}
          onDeleteSlot={handleDelete}
        />
      ) : (
        <ScheduleListView
          slots={filteredSlots}
          onEditSlot={(slot) => {
            setSlotToEdit(slot)
            setIsModalOpen(true)
          }}
          onDeleteSlot={handleDelete}
        />
      )}

      {/* Modal */}
      <ScheduleSlotModal
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        slotToEdit={slotToEdit}
        defaultDayOfWeek={modalDefaultDay}
        defaultStartTime={modalDefaultTime}
        subjects={subjects}
        onClose={() => {
          setIsModalOpen(false)
          setSlotToEdit(null)
        }}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  )
}
