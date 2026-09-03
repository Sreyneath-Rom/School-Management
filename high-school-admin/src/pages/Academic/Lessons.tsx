import { useState, useEffect } from 'react'
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
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Lesson, LessonMaterial } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'

export default function Lessons() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>(isStudent ? 'Grade 10-A' : 'all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    className: 'Grade 10-A',
    subjectName: 'Mathematics',
    date: new Date().toISOString().split('T')[0],
    time: '08:30 - 09:45 AM',
    durationMinutes: 75,
    objectives: ['Master key concepts', 'Solve real-world applied problems'],
    content: '',
    status: 'Scheduled' as 'Scheduled' | 'Draft' | 'Completed',
    materials: [] as LessonMaterial[],
  })

  const [newObjective, setNewObjective] = useState('')
  const [newMaterialName, setNewMaterialName] = useState('')
  const [newMaterialType, setNewMaterialType] = useState<'pdf' | 'doc' | 'slides' | 'link'>('pdf')

  const loadLessons = async () => {
    try {
      setLoading(true)
      const data = await academicService.getLessons()
      setLessons(data)
    } catch {
      showToast('Failed to load lessons', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLessons()
  }, [])

  const filteredLessons = lessons.filter((lesson) => {
    if (isStudent && lesson.className !== 'Grade 10-A') return false
    if (selectedClass !== 'all' && lesson.className !== selectedClass) return false
    if (selectedSubject !== 'all' && lesson.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) return false
    if (statusFilter !== 'all' && lesson.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchTitle = lesson.title.toLowerCase().includes(q)
      const matchDesc = lesson.description.toLowerCase().includes(q)
      const matchSub = lesson.subjectName.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchSub) return false
    }
    return true
  })

  const handleOpenCreate = () => {
    setEditingLessonId(null)
    setFormData({
      title: '',
      description: '',
      className: 'Grade 10-A',
      subjectName: 'Mathematics',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 - 10:15 AM',
      durationMinutes: 75,
      objectives: ['Master lesson foundational theorems', 'Engage in collaborative problem set analysis'],
      content: '',
      status: 'Scheduled',
      materials: [
        { id: `mat-${Date.now()}`, name: 'Lecture_Handout.pdf', type: 'pdf', url: '#', size: '1.2 MB' },
      ],
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (l: Lesson) => {
    setEditingLessonId(l.id)
    setFormData({
      title: l.title,
      description: l.description,
      className: l.className,
      subjectName: l.subjectName,
      date: l.date,
      time: l.time,
      durationMinutes: l.durationMinutes,
      objectives: [...l.objectives],
      content: l.content,
      status: l.status,
      materials: [...l.materials],
    })
    setIsCreateModalOpen(true)
  }

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showToast('Lesson title is required', 'error')
      return
    }

    try {
      if (editingLessonId) {
        await academicService.updateLesson(editingLessonId, {
          ...formData,
          classId: formData.className === 'Grade 10-A' ? 'cls-1' : 'cls-2',
          subjectId: `sub-${formData.subjectName.toLowerCase().slice(0, 3)}`,
        })
        showToast('Lesson updated successfully', 'success')
      } else {
        await academicService.createLesson({
          ...formData,
          classId: formData.className === 'Grade 10-A' ? 'cls-1' : 'cls-2',
          subjectId: `sub-${formData.subjectName.toLowerCase().slice(0, 3)}`,
          teacherId: user?.id || '2',
          teacherName: user?.name || 'Faculty Instructor',
        })
        showToast('New lesson created successfully', 'success')
      }
      setIsCreateModalOpen(false)
      loadLessons()
    } catch {
      showToast('Error saving lesson', 'error')
    }
  }

  const handleDeleteLesson = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await academicService.deleteLesson(id)
      showToast('Lesson deleted', 'info')
      if (activeLesson?.id === id) setActiveLesson(null)
      loadLessons()
    }
  }

  const handleAddObjective = () => {
    if (!newObjective.trim()) return
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective.trim()],
    }))
    setNewObjective('')
  }

  const handleRemoveObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }))
  }

  const handleAddMaterial = () => {
    if (!newMaterialName.trim()) return
    const newMat: LessonMaterial = {
      id: `mat-${Date.now()}`,
      name: newMaterialName.trim().endsWith('.pdf') ? newMaterialName.trim() : `${newMaterialName.trim()}.${newMaterialType}`,
      type: newMaterialType,
      url: '#',
      size: '1.5 MB',
    }
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMat],
    }))
    setNewMaterialName('')
  }

  return (
    <div id="lessons-page-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Class Lessons & Notes' : 'Academic Lessons'}
          subtitle={
            isStudent
              ? 'Access class curriculum, lecture notes, syllabus plans, and study materials.'
              : 'Plan, publish, and manage curriculum modules and teaching materials for assigned classes.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            id="create-lesson-btn"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Lesson
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-lessons-input"
            type="text"
            placeholder="Search lessons by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {!isStudent && (
            <select
              id="filter-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Classes</option>
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
              <option value="Grade 11-A">Grade 11-A</option>
            </select>
          )}

          <select
            id="filter-subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="English Literature">English Literature</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          <select
            id="filter-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Lesson Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading lessons...</div>
      ) : filteredLessons.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <NotebookText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">No lessons found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Create Lesson" to publish your first academic lecture plan.'
              : 'There are currently no published lessons matching your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => setActiveLesson(lesson)}
              className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/60">
                    <BookOpen className="w-3 h-3" />
                    {lesson.subjectName}
                  </span>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      lesson.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : lesson.status === 'Scheduled'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base group-hover:text-brand-600 transition line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lesson.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.className}
                    </span>
                    <span className="text-slate-400">
                      {lesson.materials.length} resource{lesson.materials.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 truncate max-w-[150px]">
                  By {lesson.teacherName}
                </span>

                <div className="flex items-center gap-1">
                  {isTeacherOrAdmin && (
                    <>
                      <button
                        title="Edit Lesson"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenEdit(lesson)
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Lesson"
                        onClick={(e) => handleDeleteLesson(lesson.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
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

      {/* Lesson Detail Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            id="lesson-detail-modal"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {activeLesson.subjectName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeLesson.className} • {activeLesson.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Instructor: {activeLesson.teacherName} ({activeLesson.time})
                </p>
              </div>
              <button
                id="close-lesson-detail"
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Lesson Summary
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {activeLesson.description}
                </p>
              </div>

              {activeLesson.objectives.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {activeLesson.objectives.map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeLesson.content && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Lecture Notes & Overview
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-line">
                    {activeLesson.content}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Learning Materials & Attachments ({activeLesson.materials.length})
                </h4>
                {activeLesson.materials.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No attachments for this session.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                              {mat.name}
                            </p>
                            {mat.size && <span className="text-[11px] text-slate-400">{mat.size}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => showToast(`Downloading ${mat.name}...`, 'info')}
                          className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition shrink-0"
                          title="Download Resource"
                        >
                          {mat.type === 'link' ? (
                            <ExternalLink className="w-3.5 h-3.5" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Lesson Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            id="lesson-form-modal"
            onSubmit={handleSaveLesson}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingLessonId ? 'Edit Academic Lesson' : 'Create New Lesson Plan'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solving Quadratic Equations with the Discriminant"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class Assignment
                </label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time / Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. 08:30 - 09:45 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of topics explored in this lesson..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {/* Objectives Builder */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Objectives
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add an objective and press Add..."
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddObjective()
                      }
                    }}
                    className="flex-1 px-3.5 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {formData.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                    >
                      <span className="truncate">{obj}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(i)}
                        className="text-slate-400 hover:text-rose-500 ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Notes / Teaching Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Elaborate on lecture flow, examples, formulas, and references..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                />
              </div>

              {/* Material Attachments */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Materials / File Upload
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Material file name (e.g. Lab_Manual.pdf)..."
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <select
                    value={newMaterialType}
                    onChange={(e) => setNewMaterialType(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="slides">Slides / Presentation</option>
                    <option value="doc">Worksheet</option>
                    <option value="link">Web Link</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                  >
                    Attach
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.materials.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <FileText className="w-3 h-3 text-brand-600" />
                      {m.name}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            materials: formData.materials.filter((item) => item.id !== m.id),
                          })
                        }
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                {editingLessonId ? 'Update Lesson' : 'Publish Lesson'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
