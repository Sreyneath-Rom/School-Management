import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/context/AuthContext'
import {
  lessonService,
  type Lesson,
  type LessonStatus,
  type LessonAttachment,
  type CreateLessonPayload,
} from '@/services/lessonService'
import { homeworkService, type HomeworkAssignment } from '@/services/homeworkService'
import { quizService, type Quiz } from '@/services/quizService'
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  Calendar,
  MapPin,
  FileText,
  Video,
  Presentation,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  Edit,
  Trash2,
  Download,
  Eye,
  PenLine,
  FileQuestion,
  Layers,
  ChevronRight,
  Filter,
  RotateCcw,
  Check,
  X,
  GraduationCap,
  Users,
} from 'lucide-react'

export default function Lessons() {
  const { user, role: currentRole } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Support toggling view perspective for ease of previewing both Teacher and Student workflows
  const [activeRolePerspective, setActiveRolePerspective] = useState<'teacher' | 'student'>(() => {
    return currentRole === 'student' ? 'student' : 'teacher'
  })

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline')

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Dynamic filter options
  const [filterOptions, setFilterOptions] = useState<{
    classes: string[]
    subjects: string[]
    units: string[]
  }>({ classes: [], subjects: [], units: [] })

  // Existing assignments & quizzes for linking
  const [availableHomework, setAvailableHomework] = useState<HomeworkAssignment[]>([])
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    const loadAssocs = async () => {
      try {
        const [hws, qzs] = await Promise.all([
          homeworkService.getAssignments(),
          quizService.getQuizzes(),
        ])
        setAvailableHomework(hws)
        setAvailableQuizzes(qzs)
      } catch (e) {
        console.error(e)
      }
    }
    loadAssocs()
  }, [])

  // Load lessons from service
  const loadLessons = useCallback(() => {
    const list = lessonService.list()
    setLessons(list)
    setFilterOptions(lessonService.getFilterOptions())
  }, [])

  useEffect(() => {
    loadLessons()
  }, [loadLessons])

  // Computed statistics
  const stats = useMemo(() => {
    const total = lessons.length
    const scheduled = lessons.filter((l) => l.status === 'Scheduled').length
    const completed = lessons.filter((l) => l.status === 'Completed').length
    const studentId = user?.id || 'std-1'
    const reviewed = lessons.filter((l) => l.reviewedByStudents.includes(studentId)).length
    const reviewPct = total > 0 ? Math.round((reviewed / total) * 100) : 0
    return { total, scheduled, completed, reviewed, reviewPct }
  }, [lessons, user?.id])

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (selectedClass !== 'All Classes' && lesson.class !== selectedClass) return false
      if (selectedSubject !== 'All Subjects' && lesson.subject !== selectedSubject) return false
      if (selectedStatus !== 'All' && lesson.status !== selectedStatus) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = lesson.title.toLowerCase().includes(q)
        const matchSubject = lesson.subject.toLowerCase().includes(q)
        const matchUnit = lesson.unit.toLowerCase().includes(q)
        const matchTeacher = lesson.teacherName.toLowerCase().includes(q)
        const matchSummary = lesson.summary.toLowerCase().includes(q)
        if (!matchTitle && !matchSubject && !matchUnit && !matchTeacher && !matchSummary) {
          return false
        }
      }
      return true
    })
  }, [lessons, selectedClass, selectedSubject, selectedStatus, searchTerm])

  // Group lessons by Unit for the timeline view
  const groupedByUnit = useMemo(() => {
    const map = new Map<string, Lesson[]>()
    filteredLessons.forEach((l) => {
      const unitKey = l.unit || 'General Curriculum'
      if (!map.has(unitKey)) {
        map.set(unitKey, [])
      }
      map.get(unitKey)!.push(l)
    })
    return Array.from(map.entries())
  }, [filteredLessons])

  // Student toggle review status
  const handleToggleReview = (lessonId: string) => {
    const studentId = user?.id || 'std-1'
    const isNowReviewed = lessonService.toggleStudentReviewed(lessonId, studentId)
    loadLessons()
    showToast(
      isNowReviewed
        ? 'Lesson marked as reviewed and studied!'
        : 'Lesson removed from reviewed checklist.',
      'success'
    )
  }

  // Teacher quick status update
  const handleQuickStatusChange = (lessonId: string, newStatus: LessonStatus) => {
    lessonService.updateStatus(lessonId, newStatus)
    loadLessons()
    showToast(`Lesson status updated to ${newStatus}`, 'success')
  }

  // Delete lesson
  const handleDeleteLesson = (id: string) => {
    lessonService.delete(id)
    setDeleteConfirmId(null)
    loadLessons()
    showToast('Lesson deleted successfully', 'success')
  }

  // Reset demo curriculum
  const handleResetData = () => {
    lessonService.resetDemoData()
    loadLessons()
    showToast('Demo curriculum and lessons reset successfully', 'info')
  }

  // Form State for Create / Edit Modal
  const [formData, setFormData] = useState<CreateLessonPayload>({
    title: '',
    subject: 'Mathematics',
    class: 'Grade 10 - A',
    teacherId: user?.id || 'tch-1',
    teacherName: user ? `${user.firstName} ${user.lastName}` : 'Dr. Robert Jenkins',
    unit: 'Unit 1: Foundations & Fundamentals',
    chapter: 'Chapter 1.1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    durationMinutes: 60,
    room: 'Room 204',
    objectives: ['Understand key definitions and underlying theories'],
    summary: '',
    status: 'Scheduled',
    attachments: [],
    linkedHomeworkId: '',
    linkedHomeworkTitle: '',
    linkedQuizId: '',
    linkedQuizTitle: '',
  })

  // Attachment input helper state
  const [newAttachmentName, setNewAttachmentName] = useState('')
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('')
  const [newAttachmentType, setNewAttachmentType] = useState<LessonAttachment['type']>('pdf')
  const [newObjectiveText, setNewObjectiveText] = useState('')

  const openCreateModal = () => {
    setEditingLesson(null)
    setFormData({
      title: '',
      subject: filterOptions.subjects[0] || 'Mathematics',
      class: filterOptions.classes[0] || 'Grade 10 - A',
      teacherId: user?.id || 'tch-1',
      teacherName: user ? `${user.firstName} ${user.lastName}` : 'Dr. Robert Jenkins',
      unit: 'Unit 1: Foundations & Fundamentals',
      chapter: 'Chapter 1.1',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      durationMinutes: 60,
      room: 'Room 204',
      objectives: ['Master foundational concepts and applications'],
      summary: '',
      status: 'Scheduled',
      attachments: [],
      linkedHomeworkId: '',
      linkedHomeworkTitle: '',
      linkedQuizId: '',
      linkedQuizTitle: '',
    })
    setIsCreateModalOpen(true)
  }

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      subject: lesson.subject,
      class: lesson.class,
      teacherId: lesson.teacherId,
      teacherName: lesson.teacherName,
      unit: lesson.unit,
      chapter: lesson.chapter || '',
      date: lesson.date,
      startTime: lesson.startTime,
      durationMinutes: lesson.durationMinutes,
      room: lesson.room,
      objectives: [...lesson.objectives],
      summary: lesson.summary,
      status: lesson.status,
      attachments: [...lesson.attachments],
      linkedHomeworkId: lesson.linkedHomeworkId || '',
      linkedHomeworkTitle: lesson.linkedHomeworkTitle || '',
      linkedQuizId: lesson.linkedQuizId || '',
      linkedQuizTitle: lesson.linkedQuizTitle || '',
    })
    setIsCreateModalOpen(true)
  }

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.unit.trim()) {
      showToast('Please enter lesson title and unit name', 'error')
      return
    }

    if (editingLesson) {
      lessonService.update(editingLesson.id, formData)
      showToast('Lesson updated successfully', 'success')
    } else {
      lessonService.create(formData)
      showToast('Lesson created and published to syllabus', 'success')
    }

    setIsCreateModalOpen(false)
    setEditingLesson(null)
    loadLessons()
  }

  const handleAddObjective = () => {
    if (!newObjectiveText.trim()) return
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjectiveText.trim()],
    }))
    setNewObjectiveText('')
  }

  const handleRemoveObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }))
  }

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return
    const newAtt: LessonAttachment = {
      id: `att-${Date.now()}`,
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim() || '#',
      size: newAttachmentType === 'link' ? 'External Link' : '1.4 MB',
      type: newAttachmentType,
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAtt],
    }))
    setNewAttachmentName('')
    setNewAttachmentUrl('')
  }

  const handleRemoveAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((a) => a.id !== id),
    }))
  }

  const renderAttachmentIcon = (type: LessonAttachment['type']) => {
    switch (type) {
      case 'slide':
        return <Presentation className="w-4 h-4 text-amber-600" />
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />
      case 'link':
        return <ExternalLink className="w-4 h-4 text-sky-600" />
      default:
        return <FileText className="w-4 h-4 text-emerald-600" />
    }
  }

  return (
    <div className="space-y-6 pb-12" id="lessons-page-container">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Lessons & Syllabus"
            subtitle="Plan, organize, and track curriculum delivery with learning objectives, lecture notes, and study resources."
          />
        </div>

        {/* Perspective toggle & Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View mode switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveRolePerspective('teacher')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                activeRolePerspective === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Teacher View</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveRolePerspective('student')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                activeRolePerspective === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student View</span>
              </div>
            </button>
          </div>

          <Button
            variant="solidOutline"
            size="sm"
            onClick={handleResetData}
            title="Reset to default sample curriculum"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Data
          </Button>

          {activeRolePerspective === 'teacher' && (
            <Button variant="solid" size="sm" onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-1.5" />
              New Lesson
            </Button>
          )}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">{stats.total}</div>
            <div className="text-xs font-medium text-slate-500">Total Lessons</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">{stats.completed}</div>
            <div className="text-xs font-medium text-slate-500">Delivered & Completed</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">{stats.scheduled}</div>
            <div className="text-xs font-medium text-slate-500">Upcoming Scheduled</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">
              {stats.reviewPct}%
            </div>
            <div className="text-xs font-medium text-slate-500">
              Reviewed ({stats.reviewed}/{stats.total})
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative min-w-60 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics, objectives, units..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 hidden sm:inline">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="All Classes">All Classes</option>
              {filterOptions.classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 hidden sm:inline">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="All Subjects">All Subjects</option>
              {filterOptions.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Syllabus Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Grid View
          </button>
        </div>
      </div>

      {/* Active Role Notice / Guidance */}
      <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl px-4 py-3 text-xs text-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            {activeRolePerspective === 'teacher'
              ? 'Teacher Mode active: You can create new lesson plans, upload study materials, modify delivery status, and link homework/quizzes.'
              : 'Student Mode active: Review upcoming and delivered syllabus topics, download slides and worksheets, and mark topics as reviewed.'}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            setActiveRolePerspective((p) => (p === 'teacher' ? 'student' : 'teacher'))
          }
          className="font-medium text-sky-700 hover:text-sky-900 underline ml-3 shrink-0"
        >
          Switch to {activeRolePerspective === 'teacher' ? 'Student' : 'Teacher'}
        </button>
      </div>

      {/* Main Content Area */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No lessons found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
            No lesson plans match your current filters. Try changing your class, subject, or search keywords.
          </p>
          <Button
            variant="solidOutline"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedClass('All Classes')
              setSelectedSubject('All Subjects')
              setSelectedStatus('All')
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Syllabus Timeline View */
        <div className="space-y-6">
          {groupedByUnit.map(([unitName, unitLessons]) => (
            <div
              key={unitName}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Unit Header */}
              <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-semibold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{unitName}</h3>
                    <div className="text-xs text-slate-500">
                      {unitLessons.length} {unitLessons.length === 1 ? 'lesson' : 'lessons'} in this unit
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                    {unitLessons[0]?.subject}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                    {unitLessons[0]?.class}
                  </span>
                </div>
              </div>

              {/* Lesson Items inside Unit */}
              <div className="divide-y divide-slate-100">
                {unitLessons.map((lesson) => {
                  const studentId = user?.id || 'std-1'
                  const isReviewed = lesson.reviewedByStudents.includes(studentId)

                  return (
                    <div
                      key={lesson.id}
                      className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-4"
                    >
                      <div className="space-y-2.5 flex-1">
                        {/* Status + Chapter + Meta */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-xs ${
                              lesson.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : lesson.status === 'In Progress'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {lesson.status}
                          </span>

                          {lesson.chapter && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {lesson.chapter}
                            </span>
                          )}

                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{lesson.date}</span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {lesson.startTime} ({lesson.durationMinutes} mins)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{lesson.room}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setViewingLesson(lesson)}
                          className="text-base font-semibold text-slate-900 hover:text-sky-600 cursor-pointer transition-colors"
                        >
                          {lesson.title}
                        </h4>

                        {/* Summary */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {lesson.summary}
                        </p>

                        {/* Objectives preview */}
                        {lesson.objectives && lesson.objectives.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-sky-500" />
                              <span>Key Objectives:</span>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs text-slate-600 pl-4 list-disc">
                              {lesson.objectives.slice(0, 2).map((obj, i) => (
                                <li key={i} className="line-clamp-1">
                                  {obj}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Attachments & Linked Activities pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                          {lesson.attachments.map((att) => (
                            <button
                              key={att.id}
                              type="button"
                              onClick={() => {
                                showToast(`Accessing material: ${att.name}`, 'info')
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors border border-slate-200/60"
                            >
                              {renderAttachmentIcon(att.type)}
                              <span className="font-medium truncate max-w-45">{att.name}</span>
                              <Download className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}

                          {lesson.linkedHomeworkId && (
                            <button
                              type="button"
                              onClick={() => navigate('/academic/homework')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200 transition-colors"
                            >
                              <PenLine className="w-3 h-3 text-amber-600" />
                              <span>HW: {lesson.linkedHomeworkTitle || 'Linked Homework'}</span>
                            </button>
                          )}

                          {lesson.linkedQuizId && (
                            <button
                              type="button"
                              onClick={() => navigate('/academic/quizzes')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-medium border border-purple-200 transition-colors"
                            >
                              <FileQuestion className="w-3 h-3 text-purple-600" />
                              <span>Quiz: {lesson.linkedQuizTitle || 'Linked Quiz'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right Action Column */}
                      <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Student Review Button */}
                        {activeRolePerspective === 'student' ? (
                          <button
                            type="button"
                            onClick={() => handleToggleReview(lesson.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                              isReviewed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isReviewed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Reviewed</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-4 h-4 text-slate-400" />
                                <span>Mark Reviewed</span>
                              </>
                            )}
                          </button>
                        ) : (
                          /* Teacher Quick Status Change */
                          <div className="flex items-center gap-1">
                            <select
                              value={lesson.status}
                              onChange={(e) =>
                                handleQuickStatusChange(lesson.id, e.target.value as LessonStatus)
                              }
                              className="px-2 py-1 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md text-slate-700"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        )}

                        {/* More Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingLesson(lesson)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                            title="View Full Lesson Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {activeRolePerspective === 'teacher' && (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditModal(lesson)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                title="Edit Lesson"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(lesson.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const studentId = user?.id || 'std-1'
            const isReviewed = lesson.reviewedByStudents.includes(studentId)

            return (
              <div
                key={lesson.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lesson.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : lesson.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {lesson.status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {lesson.subject}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-sky-600 font-semibold mb-1">
                      {lesson.unit}
                    </div>
                    <h4
                      onClick={() => setViewingLesson(lesson)}
                      className="text-base font-semibold text-slate-900 line-clamp-2 hover:text-sky-600 cursor-pointer"
                    >
                      {lesson.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {lesson.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {lesson.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {lesson.durationMinutes} mins
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {lesson.room}
                      </span>
                      <span className="font-medium text-slate-700">{lesson.class}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeRolePerspective === 'student' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleReview(lesson.id)}
                        className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                          isReviewed
                            ? 'text-emerald-700 bg-emerald-100/70 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                        }`}
                      >
                        {isReviewed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Reviewed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Review</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">
                        {lesson.attachments.length} {lesson.attachments.length === 1 ? 'asset' : 'assets'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingLesson(lesson)}
                      className="text-xs font-medium text-sky-600 hover:text-sky-800 px-2 py-1 rounded-md hover:bg-sky-50 transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Drawer / Modal (UC-LESSON-02) */}
      {viewingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      viewingLesson.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : viewingLesson.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {viewingLesson.status}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {viewingLesson.subject} • {viewingLesson.class}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{viewingLesson.title}</h3>
                <div className="text-xs font-medium text-sky-600 mt-0.5">
                  {viewingLesson.unit} {viewingLesson.chapter && `• ${viewingLesson.chapter}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingLesson(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Instructor</span>
                  <span className="font-medium text-slate-800">{viewingLesson.teacherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date</span>
                  <span className="font-medium text-slate-800">{viewingLesson.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Time & Duration</span>
                  <span className="font-medium text-slate-800">
                    {viewingLesson.startTime} ({viewingLesson.durationMinutes}m)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-medium text-slate-800">{viewingLesson.room}</span>
                </div>
              </div>

              {/* Summary / Lecture Notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Lecture Synopsis & Notes
                </h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  {viewingLesson.summary}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Learning Objectives
                </h4>
                <ul className="space-y-2">
                  {viewingLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachments / Study Materials */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Study Materials & Resources ({viewingLesson.attachments.length})
                </h4>
                {viewingLesson.attachments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No attached materials.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {viewingLesson.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="p-2 rounded-lg bg-white border border-slate-200">
                            {renderAttachmentIcon(att.type)}
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-xs text-slate-900 truncate">
                              {att.name}
                            </div>
                            <div className="text-[11px] text-slate-400 uppercase">{att.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`Downloading: ${att.name}`, 'info')}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md"
                          title="Download Resource"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Activities (Homework & Quizzes) */}
              {(viewingLesson.linkedHomeworkId || viewingLesson.linkedQuizId) && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Linked Assessments & Tasks
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {viewingLesson.linkedHomeworkId && (
                      <button
                        type="button"
                        onClick={() => navigate('/academic/homework')}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors"
                      >
                        <PenLine className="w-4 h-4 text-amber-600" />
                        <span>Homework: {viewingLesson.linkedHomeworkTitle || 'Open Assignment'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                    )}

                    {viewingLesson.linkedQuizId && (
                      <button
                        type="button"
                        onClick={() => navigate('/academic/quizzes')}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium hover:bg-purple-100 transition-colors"
                      >
                        <FileQuestion className="w-4 h-4 text-purple-600" />
                        <span>Quiz: {viewingLesson.linkedQuizTitle || 'Open Quiz'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => handleToggleReview(viewingLesson.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-white flex items-center gap-1.5 transition-colors"
                >
                  {viewingLesson.reviewedByStudents.includes(user?.id || 'std-1') ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Marked as Reviewed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Mark as Reviewed</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeRolePerspective === 'teacher' && (
                  <Button
                    variant="solidOutline"
                    size="sm"
                    onClick={() => {
                      const l = viewingLesson
                      setViewingLesson(null)
                      openEditModal(l)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Lesson
                  </Button>
                )}
                <Button variant="solid" size="sm" onClick={() => setViewingLesson(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Lesson Modal (UC-LESSON-01) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingLesson ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
                </h3>
                <p className="text-xs text-slate-500">
                  Define learning goals, attach lecture materials, and link assessments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Cellular Respiration: Glycolysis & The Krebs Cycle"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                {/* Subject & Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    >
                      {filterOptions.subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Class *
                    </label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    >
                      {filterOptions.classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Unit & Chapter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Curriculum Unit / Theme *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g., Unit 2: Cellular Bioenergetics"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chapter / Section Reference
                    </label>
                    <input
                      type="text"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                      placeholder="e.g., Chapter 2.4"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Date, Time, Duration, Room */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      min={15}
                      step={5}
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Room / Lab
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="Room 302"
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Delivery Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as LessonStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Summary / Lecture Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lecture Notes & Syllabus Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Provide a summary of the concepts, experiments, or discussion topics covered..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Learning Objectives */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Learning Objectives
                  </label>
                  <div className="space-y-2 mb-2">
                    {formData.objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs text-slate-700 flex-1">{obj}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(i)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newObjectiveText}
                      onChange={(e) => setNewObjectiveText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddObjective()
                        }
                      }}
                      placeholder="Add an actionable outcome (press Enter)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                    <Button type="button" variant="solidOutline" size="sm" onClick={handleAddObjective}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Learning Materials & Attachments
                  </label>
                  <div className="space-y-2 mb-3">
                    {(formData.attachments || []).map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {renderAttachmentIcon(att.type)}
                          <span className="font-medium text-slate-800">{att.name}</span>
                          <span className="text-slate-400">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      placeholder="File or Resource Title"
                      className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg sm:col-span-2"
                    />
                    <div className="flex gap-1">
                      <select
                        value={newAttachmentType}
                        onChange={(e) =>
                          setNewAttachmentType(e.target.value as LessonAttachment['type'])
                        }
                        className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg flex-1"
                      >
                        <option value="pdf">PDF</option>
                        <option value="slide">Slides</option>
                        <option value="doc">Doc / Lab</option>
                        <option value="video">Video</option>
                        <option value="link">External Link</option>
                      </select>
                      <Button
                        type="button"
                        variant="solidOutline"
                        size="sm"
                        onClick={handleAddAttachment}
                      >
                        Attach
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Linked Homework & Quiz Assessment (UC-LESSON-01) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Existing Homework
                    </label>
                    <select
                      value={formData.linkedHomeworkId || ''}
                      onChange={(e) => {
                        const hw = availableHomework.find((h: HomeworkAssignment) => h.id === e.target.value)
                        setFormData({
                          ...formData,
                          linkedHomeworkId: e.target.value,
                          linkedHomeworkTitle: hw ? hw.title : '',
                        })
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="">-- No Linked Homework --</option>
                      {availableHomework.map((hw: HomeworkAssignment) => (
                        <option key={hw.id} value={hw.id}>
                          {hw.title} ({hw.subject})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Existing Quiz / Test
                    </label>
                    <select
                      value={formData.linkedQuizId || ''}
                      onChange={(e) => {
                        const qz = availableQuizzes.find((q: Quiz) => q.id === e.target.value)
                        setFormData({
                          ...formData,
                          linkedQuizId: e.target.value,
                          linkedQuizTitle: qz ? qz.title : '',
                        })
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="">-- No Linked Quiz --</option>
                      {availableQuizzes.map((qz: Quiz) => (
                        <option key={qz.id} value={qz.id}>
                          {qz.title} ({qz.subject})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="solidOutline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="solid" size="sm">
                  {editingLesson ? 'Save Changes' : 'Create Lesson'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Lesson Plan?</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove this lesson from the syllabus? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="solidOutline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => handleDeleteLesson(deleteConfirmId)}
              >
                Delete Lesson
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
