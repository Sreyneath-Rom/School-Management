import React, { useState, useEffect, useCallback } from 'react'
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
import { useToast } from '@/components/common/ToastProvider'

export default function Attendance() {
  const { addToast } = useToast()

  // Selected date state (defaults to today)
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

  // Modals state
  const [activeNoteRecord, setActiveNoteRecord] = useState<AttendanceRecord | null>(null)
  const [activeHistoryRecord, setActiveHistoryRecord] = useState<AttendanceRecord | null>(null)
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false)

  // Fetch records and stats for selected date
  const fetchData = useCallback(async (dateStr: string) => {
    setLoading(true)
    try {
      const [recList, statsData] = await Promise.all([
        attendanceService.list({ date: dateStr }),
        attendanceService.getStats(dateStr),
      ])

      // If records have nested student info, normalize fields
      const normalizedRecords: AttendanceRecord[] = (recList || []).map((r: any) => {
        const studentObj = r.student || {}
        const userObj = studentObj.user || {}
        const classObj = studentObj.class || {}

        const firstName = studentObj.firstName || userObj.firstName || ''
        const lastName = studentObj.lastName || userObj.lastName || ''
        const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (r.studentName || 'Student')
        const studentCode = studentObj.studentId || r.studentCode || r.studentId
        const className = classObj.name || r.class || 'Grade 10 - A'
        const avatar = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

        return {
          id: r.id || `att-${r.studentId}-${dateStr}`,
          studentId: r.studentId,
          studentName: fullName,
          studentCode,
          studentAvatar: r.studentAvatar || avatar,
          grade: r.grade || (classObj.gradeLevel ? `Grade ${classObj.gradeLevel}` : 'Grade 10'),
          class: className,
          date: r.date || dateStr,
          status: (r.status as AttendanceStatus) || 'PRESENT',
          checkIn: r.checkIn ?? null,
          checkOut: r.checkOut ?? null,
          note: r.note ?? null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }
      })

      setRecords(normalizedRecords)
      setStats(statsData)
      setHasUnsavedChanges(false)
    } catch (err: any) {
      console.error('Failed to load attendance records:', err)
      addToast('error', err?.message || 'Could not fetch records for the selected date.')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchData(selectedDate)
  }, [selectedDate, fetchData])

  // Handlers for record updates
  const handleUpdateStatus = (recordId: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId || r.studentId === recordId) {
          return {
            ...r,
            status: newStatus,
            checkIn: newStatus === 'ABSENT' ? null : (r.checkIn || '08:00 AM'),
          }
        }
        return r
      })
    )
    setHasUnsavedChanges(true)
  }

  const handleUpdateCheckIn = (recordId: string, timeStr: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId || r.studentId === recordId) {
          return { ...r, checkIn: timeStr }
        }
        return r
      })
    )
    setHasUnsavedChanges(true)
  }

  const handleUpdateCheckOut = (recordId: string, timeStr: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId || r.studentId === recordId) {
          return { ...r, checkOut: timeStr }
        }
        return r
      })
    )
    setHasUnsavedChanges(true)
  }

  const handleSaveNote = (recordId: string, noteText: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId || r.studentId === recordId) {
          return { ...r, note: noteText }
        }
        return r
      })
    )
    setHasUnsavedChanges(true)
    addToast('info', 'Excuse remark updated. Remember to Save & Sync.')
  }

  const handleBulkMarkAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (selectedClass !== 'All Classes' && r.class?.toLowerCase() !== selectedClass.toLowerCase()) {
          return r
        }
        return {
          ...r,
          status,
          checkIn: status === 'ABSENT' ? null : (r.checkIn || '08:00 AM'),
        }
      })
    )
    setHasUnsavedChanges(true)
    addToast('info', `Updated all students in ${selectedClass} to ${status}.`)
  }

  const handleSaveSync = async () => {
    setSaving(true)
    try {
      const payload = {
        date: selectedDate,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          note: r.note,
        })),
      }

      await attendanceService.bulkMark(payload)

      // Refresh stats
      const updatedStats = await attendanceService.getStats(selectedDate)
      setStats(updatedStats)
      setHasUnsavedChanges(false)

      addToast('success', `Successfully synchronized ${records.length} attendance records for ${selectedDate}.`)
    } catch (err: any) {
      console.error('Failed to sync attendance:', err)
      addToast('error', err?.message || 'Could not save attendance to the server.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header with Day Navigator, Week Bar, and View Selector */}
      <AttendanceCalendarHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        attendanceRate={stats?.attendanceRate ?? 0}
        totalStudents={stats?.total ?? records.length}
        presentCount={stats?.present ?? stats?.presentToday ?? 0}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Daily Metrics Summary KPI Cards */}
      <AttendanceStatsSummary
        stats={stats}
        loading={loading}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={setSelectedStatusFilter}
      />

      {/* Main View Mode Rendering */}
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

      {/* Modals & Drawers */}
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
