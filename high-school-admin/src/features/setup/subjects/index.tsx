// src/features/setup/subjects/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, LayoutGrid, List, RefreshCw, Download } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { SubjectStats } from './SubjectStats'
import { SubjectCardGrid } from './SubjectCardGrid'
import { SubjectTable } from './SubjectTable'
import { SubjectModal } from './SubjectModal'
import { SubjectDetailDrawer } from './SubjectDetailDrawer'
import {
  subjectService,
  type SubjectItem,
  type CreateSubjectPayload,
  type UpdateSubjectPayload,
} from '@/services/subjectService'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

const DEPARTMENTS = [
  'All Departments',
  'Mathematics',
  'Science',
  'Languages',
  'Social Studies',
  'Arts',
  'Technology',
]

export default function SubjectsFeature() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectItem | null>(null)

  const [drawerSubject, setDrawerSubject] = useState<SubjectItem | null>(null)

  const { success, error: notifyError } = useNotification()

  const loadSubjects = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await subjectService.list()
      setSubjects(Array.isArray(data) ? data : [])
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to fetch subjects list')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const filteredSubjects = useMemo(() => {
    const safeSubjects = Array.isArray(subjects) ? subjects : []
    return safeSubjects.filter((s) => {
      if (!s) return false
      const matchesSearch =
        (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
        (s.code && s.code.toLowerCase().includes(search.toLowerCase())) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
      const matchesDept =
        selectedDept === 'All Departments' || s.department === selectedDept
      return matchesSearch && matchesDept
    })
  }, [subjects, search, selectedDept])

  const handleCreateOrUpdate = async (data: CreateSubjectPayload | UpdateSubjectPayload) => {
    setIsSubmitting(true)
    try {
      if (subjectToEdit) {
        const updated = await subjectService.update(subjectToEdit.id, data)
        setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        if (drawerSubject?.id === updated.id) {
          setDrawerSubject(updated)
        }
        success(`Subject "${updated.name}" updated`)
      } else {
        const created = await subjectService.create(data as CreateSubjectPayload)
        setSubjects((prev) => [...prev, created])
        success(`Subject "${created.name}" created`)
      }
      setIsModalOpen(false)
      setSubjectToEdit(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to save subject')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await subjectService.delete(id)
      setSubjects((prev) => prev.filter((s) => s.id !== id))
      if (drawerSubject?.id === id) {
        setDrawerSubject(null)
      }
      success('Subject removed from catalog')
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to delete subject')
    }
  }

  const handleExport = () => {
    const headers = ['Code', 'Name', 'Department', 'Category', 'Credits', 'WeeklyHours', 'Teachers']
    const rows = filteredSubjects.map((s) => [
      s.code,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.category}"`,
      s.credits || 1,
      s.weeklyHours || 3,
      `"${s.teachers?.map((t) => t.name).join('; ') || ''}"`,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `subject_catalog_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('Exported subjects catalog to CSV')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Subjects & Academic Courses"
          subtitle="Configure high school academic curriculum, subject codes, faculty assignments, and credit structures."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Download size={14} /> Export
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={() => {
              setSubjectToEdit(null)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus size={16} /> Add Subject
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SubjectStats subjects={subjects} />

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl glass-sm p-4 border border-text-main/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 sm:min-w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-main/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title or code..."
              className="w-full rounded-full border border-text-main/15 bg-text-main/5 py-2 pl-9 pr-3 text-xs sm:text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-main/50">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-full border border-text-main/15 bg-text-main/5 px-3 py-1.5 text-xs text-text-main outline-none transition focus:border-brand-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} className="bg-slate-800 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={loadSubjects}
            className="rounded-xl p-2 text-text-main/60 hover:bg-text-main/10 hover:text-text-main transition"
            title="Refresh subjects"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center rounded-2xl bg-text-main/10 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-xl p-1.5 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-text-main/50 hover:text-text-main'
              }`}
              title="Table View"
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
          <p className="text-sm font-medium text-text-main/60">Loading academic subjects...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-3xl bg-error/10 border border-error/20 p-6 text-center text-error">
          <p className="font-bold mb-1">Failed to load subjects</p>
          <p className="text-xs">{loadError}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <SubjectCardGrid
          subjects={filteredSubjects}
          onSelect={(s) => setDrawerSubject(s)}
          onEdit={(s) => {
            setSubjectToEdit(s)
            setIsModalOpen(true)
          }}
          onDelete={handleDelete}
        />
      ) : (
        <SubjectTable
          subjects={filteredSubjects}
          onViewDetails={(s) => setDrawerSubject(s)}
          onEdit={(s) => {
            setSubjectToEdit(s)
            setIsModalOpen(true)
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        subjectToEdit={subjectToEdit}
        onClose={() => {
          setIsModalOpen(false)
          setSubjectToEdit(null)
        }}
        onSubmit={handleCreateOrUpdate}
      />

      {/* Detail Drawer */}
      <SubjectDetailDrawer
        subject={drawerSubject}
        isOpen={!!drawerSubject}
        onClose={() => setDrawerSubject(null)}
        onEdit={(s) => {
          setSubjectToEdit(s)
          setIsModalOpen(true)
        }}
        onDelete={handleDelete}
      />
    </div>
  )
}
