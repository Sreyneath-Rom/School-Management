// src/features/students/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { StudentStats } from './StudentStats'
import { StudentFilters } from './StudentFilters'
import { StudentTable } from './StudentTable'
import { StudentCardGrid } from './StudentCardGrid'
import { StudentModal } from './StudentModal'
import { StudentDetailDrawer } from './StudentDetailDrawer'
import { studentService, type CreateStudentPayload } from '@/services/studentService'
import type { StudentUser } from '@/types/user'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

const DEFAULT_GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
const DEFAULT_CLASSES = [
  'Grade 9 - A', 'Grade 9 - B', 'Grade 10 - A', 'Grade 10 - B',
  'Grade 11 - A', 'Grade 11 - B', 'Grade 12 - A', 'Grade 12 - B',
]

export default function StudentsFeature() {
  const [students, setStudents] = useState<StudentUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState<StudentUser | null>(null)

  const [detailStudent, setDetailStudent] = useState<StudentUser | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [studentToDelete, setStudentToDelete] = useState<StudentUser | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { success, error: notifyError } = useNotification()

  const loadStudents = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await studentService.list()
      setStudents(Array.isArray(data) ? (data as any) : [])
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load students data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const availableGrades = useMemo(() => {
    const set = new Set<string>(DEFAULT_GRADES)
    students.forEach((s) => { if (s.grade) set.add(s.grade) })
    return Array.from(set).sort()
  }, [students])

  const availableClasses = useMemo(() => {
    const set = new Set<string>(DEFAULT_CLASSES)
    students.forEach((s) => { if (s.class) set.add(s.class) })
    return Array.from(set).sort()
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (!s) return false
      const q = search.toLowerCase().trim()
      const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase()
      const studentId = (s.studentId || s.id || '').toLowerCase()
      const email = (s.email || '').toLowerCase()
      const parentName = `${s.fatherName || ''} ${s.motherName || ''} ${s.guardianName || ''}`.toLowerCase()

      const matchesSearch =
        !q || fullName.includes(q) || studentId.includes(q) ||
        email.includes(q) || parentName.includes(q)

      const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade
      const matchesClass = selectedClass === 'all' || s.class === selectedClass
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus
      const matchesGender = selectedGender === 'all' || s.gender === selectedGender

      return matchesSearch && matchesGrade && matchesClass && matchesStatus && matchesGender
    })
  }, [students, search, selectedGrade, selectedClass, selectedStatus, selectedGender])

  const hasActiveFilters =
    Boolean(search.trim()) ||
    selectedGrade !== 'all' ||
    selectedClass !== 'all' ||
    selectedStatus !== 'all' ||
    selectedGender !== 'all'

  const handleClearFilters = () => {
    setSearch('')
    setSelectedGrade('all')
    setSelectedClass('all')
    setSelectedStatus('all')
    setSelectedGender('all')
  }

  const handleToggleSelect = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (filteredStudents.every((s) => selectedStudentIds.includes(s.id))) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id))
    }
  }

  const handleClearSelection = () => setSelectedStudentIds([])

  const handleOpenCreateModal = () => {
    setStudentToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (student: StudentUser) => {
    setStudentToEdit(student)
    setIsModalOpen(true)
  }

  const handleViewDetails = (student: StudentUser) => {
    setDetailStudent(student)
    setIsDrawerOpen(true)
  }

  const handleCreateOrUpdateStudent = async (data: CreateStudentPayload) => {
    setIsSubmitting(true)
    try {
      if (studentToEdit) {
        const updated = (await studentService.update(studentToEdit.id, data as any)) as any
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        if (detailStudent && detailStudent.id === updated.id) setDetailStudent(updated)
        success(`Successfully updated student record for ${updated.firstName} ${updated.lastName}`)
      } else {
        const created = (await studentService.create(data)) as any
        setStudents((prev) => [created, ...prev])
        success(`Successfully enrolled student ${created.firstName} ${created.lastName}`)
      }
      setIsModalOpen(false)
      setStudentToEdit(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to save student record')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (student: StudentUser) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active'
    try {
      await studentService.update(student.id, { status: newStatus })
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s)))
      if (detailStudent && detailStudent.id === student.id) {
        setDetailStudent({ ...detailStudent, status: newStatus })
      }
      success(`Updated status of ${student.firstName} to ${newStatus}`)
    } catch {
      notifyError('Failed to update student status')
    }
  }

  const handleBulkStatus = async (status: 'active' | 'inactive') => {
    if (selectedStudentIds.length === 0) return
    try {
      await studentService.bulkStatus(selectedStudentIds, status)
      setStudents((prev) =>
        prev.map((s) => (selectedStudentIds.includes(s.id) ? { ...s, status } : s))
      )
      success(`Updated status for ${selectedStudentIds.length} students to ${status}`)
      setSelectedStudentIds([])
    } catch {
      notifyError('Failed to apply bulk status changes')
    }
  }

  const handleDeletePrompt = (student: StudentUser) => setStudentToDelete(student)

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return
    setIsDeleting(true)
    try {
      await studentService.delete(studentToDelete.id)
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id))
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentToDelete.id))
      if (detailStudent && detailStudent.id === studentToDelete.id) {
        setIsDrawerOpen(false)
        setDetailStudent(null)
      }
      success(`Removed ${studentToDelete.firstName} ${studentToDelete.lastName} from roster`)
      setStudentToDelete(null)
    } catch {
      notifyError('Failed to delete student')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCSV = () => {
    const headers = [
      'Student ID', 'First Name', 'Last Name', 'Email', 'Phone',
      'Grade', 'Class', 'Gender', 'Date of Birth', 'Status',
      'Parent Name', 'Parent Phone',
    ]
    const rows = filteredStudents.map((s) => [
      `"${s.studentId || s.id}"`, `"${s.firstName || ''}"`, `"${s.lastName || ''}"`,
      `"${s.email || ''}"`, `"${s.phone || ''}"`, `"${s.grade || ''}"`,
      `"${s.class || ''}"`, `"${s.gender || ''}"`, `"${s.dateOfBirth || ''}"`,
      `"${s.status || 'active'}"`,
      `"${s.fatherName || s.motherName || s.guardianName || ''}"`,
      `"${s.parentPhone || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('Student roster exported to CSV')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Students Directory"
          subtitle="View, search, filter and manage high school student enrollments and academic profiles."
        />
        <div className="flex items-center gap-2">
          {/* Was `border border-border-card bg-surface-card hover:bg-surface-base`
              — none of those classes exist in this codebase, so the button
              was rendering with no visual treatment. `.glass-sm
              .glass-interactive` gives it the correct raised surface + the
              neumorphic hover-lift / press-in gesture. */}
          <button
            id="refresh-students-btn"
            onClick={loadStudents}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl glass-sm glass-interactive px-3 py-2 text-xs font-medium text-fg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Button
            id="register-new-student-btn"
            variant="solid"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <StudentStats students={students} isLoading={isLoading} />

      {/* Error banner — semantic error signal, tinted border/bg kept */}
      {loadError && (
        <div className="flex items-center justify-between rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={loadStudents}
            className="rounded-lg bg-error/20 px-3 py-1 text-xs font-semibold hover:bg-error/30 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <StudentFilters
        search={search}
        onSearchChange={setSearch}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExportCSV}
        selectedCount={selectedStudentIds.length}
        onBulkStatus={handleBulkStatus}
        onClearSelection={handleClearSelection}
        grades={availableGrades}
        classes={availableClasses}
      />

      {viewMode === 'table' ? (
        <StudentTable
          students={filteredStudents}
          isLoading={isLoading}
          selectedIds={selectedStudentIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditModal}
          onDelete={handleDeletePrompt}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        <StudentCardGrid
          students={filteredStudents}
          selectedIds={selectedStudentIds}
          onToggleSelect={handleToggleSelect}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditModal}
          onDelete={handleDeletePrompt}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <StudentModal
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        studentToEdit={studentToEdit}
        onClose={() => { setIsModalOpen(false); setStudentToEdit(null) }}
        onSubmit={handleCreateOrUpdateStudent}
        grades={availableGrades}
        classes={availableClasses}
      />

      <StudentDetailDrawer
        student={detailStudent}
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setDetailStudent(null) }}
        onEdit={(student) => { setIsDrawerOpen(false); handleOpenEditModal(student) }}
        onToggleStatus={handleToggleStatus}
      />

      <ConfirmDialog
        open={Boolean(studentToDelete)}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${studentToDelete?.firstName} ${studentToDelete?.lastName} (${studentToDelete?.studentId || studentToDelete?.id})? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}