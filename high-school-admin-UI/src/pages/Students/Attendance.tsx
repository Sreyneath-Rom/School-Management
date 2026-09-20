// src/pages/Students/Attendance.tsx
import { useState, useEffect, useCallback } from 'react'
import {
  attendanceService,
  type AttendanceRecord,
  type AttendanceStats,
  type AttendanceStatus,
} from '@/services/attendanceService'
import AttendanceCalendarHeader from '@/features/attendance/AttendanceCalendarHeader'
import AttendanceStatsSummary from '@/features/attendance/AttendanceStatsSummary'
import DailyAttendanceRoster from '@/features/attendance/DailyAttendanceRoster'
import DailyCalendarScheduleView from '@/features/attendance/DailyCalendarScheduleView'
import AttendanceExcuseNoteModal from '@/features/attendance/AttendanceExcuseNoteModal'
import StudentAttendanceHistoryDrawer from '@/features/attendance/StudentAttendanceHistoryDrawer'
import AttendanceExportModal from '@/features/attendance/AttendanceExportModal'
import StudentPersonalAttendanceView from '@/features/attendance/StudentPersonalAttendanceView'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/hooks/useAuth'

// STRIPPED: `class` on records is nested at `student.class.name`. BulkMark
// payload expects `string | undefined` for optional fields.

export default function Attendance() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })

  const [viewMode, setViewMode] = useState<'roster' | 'schedule'>('roster')
  const [selectedClass, setSelectedClass] = useState<string>('All Classes')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all')

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)

  const [activeNoteRecord, setActiveNoteRecord] = useState<AttendanceRecord | null>(null)
  const [activeHistoryRecord, setActiveHistoryRecord] = useState<AttendanceRecord | null>(null)
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false)

  const fetchData = useCallback(
    async (dateStr: string) => {
      setLoading(true)
      try {
        const [recList, statsData] = await Promise.all([
          attendanceService.list({ date: dateStr }),
          attendanceService.getStats(dateStr),
        ])

        const normalizedRecords: AttendanceRecord[] = (recList || []).map(
          (r: AttendanceRecord & { student?: Record<string, unknown> }) => {
            const student = (r.student ?? {}) as {
              id?: string
              studentCode?: string
              user?: { firstName?: string; lastName?: string }
              class?: { name?: string; gradeLevel?: number }
            }
            const u = student.user ?? {}
            const firstName = u.firstName ?? ''
            const lastName = u.lastName ?? ''
            const fullName = `${firstName} ${lastName}`.trim() || '—'
            const className = student.class?.name ?? '—'
            const grade = student.class?.gradeLevel
              ? `Grade ${student.class.gradeLevel}`
              : ''
            const avatar = fullName
              .split(' ')
              .map((n: string) => n[0])
              .filter(Boolean)
              .join('')
              .substring(0, 2)
              .toUpperCase()

            return {
              ...r,
              // Page-level augmentation for the roster component
              studentName: fullName,
              studentCode: student.studentCode ?? '',
              studentAvatar: avatar,
              grade,
              class: className,
            } as unknown as AttendanceRecord
          }
        )

        setRecords(normalizedRecords)
        setStats(statsData)
        setHasUnsavedChanges(false)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not fetch records.'
        showToast(msg, 'error')
      } finally {
        setLoading(false)
      }
    },
    [showToast]
  )

  useEffect(() => {
    fetchData(selectedDate)
  }, [selectedDate, fetchData])

  const handleUpdateStatus = (recordId: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId || r.studentId === recordId
          ? {
              ...r,
              status: newStatus,
              checkIn: newStatus === 'ABSENT' ? null : r.checkIn,
            }
          : r
      )
    )
    setHasUnsavedChanges(true)
  }

  const handleUpdateCheckIn = (recordId: string, timeStr: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId || r.studentId === recordId
          ? { ...r, checkIn: timeStr }
          : r
      )
    )
    setHasUnsavedChanges(true)
  }

  const handleUpdateCheckOut = (recordId: string, timeStr: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId || r.studentId === recordId
          ? { ...r, checkOut: timeStr }
          : r
      )
    )
    setHasUnsavedChanges(true)
  }

  const handleSaveNote = (recordId: string, noteText: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId || r.studentId === recordId
          ? { ...r, note: noteText }
          : r
      )
    )
    setHasUnsavedChanges(true)
    showToast('Excuse remark updated. Remember to Save & Sync.', 'info')
  }

  const handleBulkMarkAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        const recordClass = (r as AttendanceRecord & { class?: string }).class
        if (
          selectedClass !== 'All Classes' &&
          (recordClass ?? '').toLowerCase() !== selectedClass.toLowerCase()
        ) {
          return r
        }
        return {
          ...r,
          status,
          checkIn: status === 'ABSENT' ? null : r.checkIn,
        }
      })
    )
    setHasUnsavedChanges(true)
    showToast(`Updated all students in ${selectedClass} to ${status}.`, 'info')
  }

  const handleSaveSync = async () => {
    setSaving(true)
    try {
      const payload = {
        date: selectedDate,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          checkIn: r.checkIn ?? undefined,
          checkOut: r.checkOut ?? undefined,
          note: r.note ?? undefined,
        })),
      }

      await attendanceService.bulkMark(payload)

      const updatedStats = await attendanceService.getStats(selectedDate)
      setStats(updatedStats)
      setHasUnsavedChanges(false)

      showToast(
        `Successfully synchronized ${records.length} records for ${selectedDate}.`,
        'success'
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not save.'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role === 'student') {
    return <StudentPersonalAttendanceView />
  }

  return (
    <div className="space-y-6 pb-12">
      <AttendanceCalendarHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        attendanceRate={stats?.attendanceRate ?? 0}
        totalStudents={stats?.total ?? records.length}
        presentCount={stats?.present ?? 0}
        onExportClick={() => setIsExportOpen(true)}
      />

      <AttendanceStatsSummary
        stats={stats}
        loading={loading}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={setSelectedStatusFilter}
      />

      {viewMode === 'roster' ? (
        <DailyAttendanceRoster
          records={records}
          loading={loading}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          onUpdateStatus={handleUpdateStatus}
          onUpdateCheckIn={handleUpdateCheckIn}
          onUpdateCheckOut={handleUpdateCheckOut}
          onOpenNoteModal={setActiveNoteRecord}
          onOpenHistoryDrawer={setActiveHistoryRecord}
          onBulkMarkAll={handleBulkMarkAll}
          onSaveSync={handleSaveSync}
          hasUnsavedChanges={hasUnsavedChanges}
          saving={saving}
        />
      ) : (
        <DailyCalendarScheduleView
          selectedDate={selectedDate}
          records={records}
          onSelectClassForRoster={(className) => {
            setSelectedClass(className)
            setViewMode('roster')
          }}
          onOpenNoteModal={setActiveNoteRecord}
          onOpenHistoryDrawer={setActiveHistoryRecord}
        />
      )}

      <AttendanceExcuseNoteModal
        isOpen={!!activeNoteRecord}
        onClose={() => setActiveNoteRecord(null)}
        record={activeNoteRecord}
        onSaveNote={handleSaveNote}
      />

      <StudentAttendanceHistoryDrawer
        isOpen={!!activeHistoryRecord}
        onClose={() => setActiveHistoryRecord(null)}
        record={activeHistoryRecord}
        allRecordsForStudent={
          activeHistoryRecord
            ? records.filter((r) => r.studentId === activeHistoryRecord.studentId)
            : []
        }
      />

      <AttendanceExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        records={records}
        selectedDate={selectedDate}
        selectedClass={selectedClass}
      />
    </div>
  )
}