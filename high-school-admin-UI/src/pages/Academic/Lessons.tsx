// src/pages/Academic/Lessons.tsx
import { useState, useEffect, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  NotebookText,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Download,
  Trash2,
  Edit3,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Lesson } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { classService, type ClassRecord } from '@/services/classService'
import { subjectService } from '@/services/subjectService'

interface LessonForm {
  title: string
  description: string
  classId: string
  subjectId: string
  scheduledAt: string  // ISO datetime string for the input
  fileUrl: string
  fileType: string
}

const DEFAULT_FORM: LessonForm = {
  title: '',
  description: '',
  classId: '',
  subjectId: '',
  scheduledAt: '',
  fileUrl: '',
  fileType: '',
}

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Lessons() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState<string>('all')

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<LessonForm>({ ...DEFAULT_FORM })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [lessonsData, classData, subjectData] = await Promise.all([
        academicService.getLessons(),
        classService.list().catch(() => []),
        subjectService.list().catch(() => []),
      ])
      setLessons(Array.isArray(lessonsData) ? lessonsData : [])
      setClasses(Array.isArray(classData) ? classData : [])
      setSubjects(
        Array.isArray(subjectData)
          ? subjectData.map((s) => ({ id: s.id, name: s.name }))
          : []
      )
    } catch {
      showToast('Failed to load lessons', 'error')
      setLessons([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  const filtered = lessons.filter((l) => {
    if (classFilter !== 'all' && l.classId !== classFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.subjectName.toLowerCase().includes(q)
      )
    }
    return true
  })

  const kpiCards: StatCard[] = [
    { id: 'total-lessons', label: 'Lessons', value: String(filtered.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'matching filters', icon: 'BookOpen', tint: 'blue' },
    { id: 'with-materials', label: 'With Materials', value: String(filtered.filter((l) => l.materials.length > 0).length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'attached resources', icon: 'FileText', tint: 'violet' },
    { id: 'subjects-covered', label: 'Subjects', value: String(new Set(filtered.map((l) => l.subjectId)).size), delta: '-', deltaDirection: 'neutral', deltaLabel: 'covered', icon: 'Layers', tint: 'green' },
    { id: 'classes-covered', label: 'Classes', value: String(new Set(filtered.map((l) => l.classId)).size), delta: '-', deltaDirection: 'neutral', deltaLabel: 'assigned', icon: 'Calendar', tint: 'amber' },
  ]

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({
      ...DEFAULT_FORM,
      classId: classes[0]?.id ?? '',
      subjectId: subjects[0]?.id ?? '',
      scheduledAt: toDateTimeLocal(new Date().toISOString()),
    })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (l: Lesson) => {
    setEditingId(l.id)
    setForm({
      title: l.title,
      description: l.description,
      classId: l.classId,
      subjectId: l.subjectId,
      scheduledAt: toDateTimeLocal(l.date),
      fileUrl: l.materials[0]?.url ?? '',
      fileType: l.materials[0]?.type ?? '',
    })
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      showToast('Title is required', 'error')
      return
    }
    if (!form.subjectId) {
      showToast('Subject is required', 'error')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      subjectId: form.subjectId,
      classId: form.classId || undefined,
      scheduledAt: form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : undefined,
      fileUrl: form.fileUrl.trim() || undefined,
      fileType: form.fileType.trim() || undefined,
    }

    try {
      if (editingId) {
        await academicService.updateLesson(editingId, payload)
        showToast('Lesson updated', 'success')
      } else {
        await academicService.createLesson(payload)
        showToast('Lesson created', 'success')
      }
      setIsFormOpen(false)
      await load()
    } catch {
      showToast('Error saving lesson', 'error')
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Delete this lesson?')) return
    try {
      await academicService.deleteLesson(id)
      showToast('Lesson deleted', 'info')
      if (activeLesson?.id === id) setActiveLesson(null)
      await load()
    } catch {
      showToast('Error deleting lesson', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Lessons"
          subtitle={
            isTeacherOrAdmin
              ? 'Publish and manage lesson plans and teaching materials.'
              : 'Class curriculum, lecture notes, and study materials.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Lesson
          </button>
        )}
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="glass-sm rounded-2xl p-4 border border-surface flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border border-surface bg-surface text-color"
        >
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-secondary">
          Loading lessons...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center border border-surface">
          <NotebookText className="w-12 h-12 text-secondary mx-auto mb-3" />
          <h3 className="text-base font-semibold text-color">No lessons</h3>
          <p className="text-sm text-secondary mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Create Lesson" to publish the first lesson plan.'
              : 'There are currently no published lessons matching your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className="glass-sm rounded-2xl p-5 border border-surface hover:border-brand-500/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <BookOpen className="w-3 h-3" />
                    {lesson.subjectName || '—'}
                  </span>
                </div>

                <h3 className="font-semibold text-color text-base line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-sm text-secondary mt-1 line-clamp-2">
                  {lesson.description}
                </p>

                <div className="mt-4 pt-3 border-t border-surface space-y-2 text-xs text-secondary">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {lesson.date}
                    </span>
                    {lesson.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.time}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {lesson.className || '—'}
                    </span>
                    <span>
                      {lesson.materials.length} resource
                      {lesson.materials.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface flex items-center justify-between">
                <span className="text-xs text-secondary truncate max-w-37.5">
                  By {lesson.teacherName || '—'}
                </span>
                <div className="flex items-center gap-1">
                  {isTeacherOrAdmin && (
                    <>
                      <button
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenEdit(lesson)
                        }}
                        className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={(e) => handleDelete(lesson.id, e)}
                        className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <span className="text-xs font-medium text-brand-600 flex items-center gap-0.5 ml-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-surface space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    {activeLesson.subjectName || '—'}
                  </span>
                  <span className="text-xs text-secondary">
                    {activeLesson.className} • {activeLesson.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-color">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-secondary mt-1">
                  Instructor: {activeLesson.teacherName || '—'}
                </p>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl text-secondary hover:text-color hover:bg-surface-strong transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {activeLesson.description && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                    Summary
                  </h4>
                  <p className="text-sm text-color leading-relaxed bg-surface-strong p-3.5 rounded-xl border border-surface">
                    {activeLesson.description}
                  </p>
                </div>
              )}

              {activeLesson.content && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                    Notes
                  </h4>
                  <div className="text-sm text-color leading-relaxed bg-surface-strong p-4 rounded-xl border border-surface whitespace-pre-line">
                    {activeLesson.content}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Materials ({activeLesson.materials.length})
                </h4>
                {activeLesson.materials.length === 0 ? (
                  <p className="text-xs text-secondary italic">
                    No attachments.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.materials.map((mat) => (
                      <a
                        key={mat.id}
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-surface bg-surface hover:bg-surface-strong flex items-center justify-between gap-2 transition"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-medium text-color truncate">
                              {mat.name}
                            </p>
                            {mat.size && (
                              <span className="text-[11px] text-secondary">
                                {mat.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <Download className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-surface flex justify-end">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-surface-strong text-color hover:bg-surface transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-surface space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface">
              <h2 className="text-lg font-bold text-color">
                {editingId ? 'Edit Lesson' : 'Create Lesson'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-secondary hover:text-color"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Class
                </label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color"
                >
                  <option value="">—</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Subject *
                </label>
                <select
                  required
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Scheduled
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm({ ...form, scheduledAt: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Attachment URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface-strong text-color"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-surface flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-surface-strong transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}