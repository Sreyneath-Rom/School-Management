import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/context/AuthContext'
import {
  homeworkService,
  type HomeworkAssignment,
  type HomeworkSubmission,
  type HomeworkStatus,
} from '@/services/homeworkService'
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  GraduationCap,
  Calendar,
  Award,
  Check,
  X,
  Users,
  Paperclip,
  Download,
  BookOpen,
  MessageSquare,
  Sparkles,
  FileCheck,
} from 'lucide-react'

export default function Homework() {
  const { user, role: currentRole } = useAuth()
  const { showToast } = useToast()

  const [activeRolePerspective, setActiveRolePerspective] = useState<'teacher' | 'student'>(() => {
    return currentRole === 'student' ? 'student' : 'teacher'
  })

  const [assignments, setAssignments] = useState<HomeworkAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedHwForReview, setSelectedHwForReview] = useState<HomeworkAssignment | null>(null)
  const [hwSubmissionsList, setHwSubmissionsList] = useState<HomeworkSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [activeGradingSub, setActiveGradingSub] = useState<HomeworkSubmission | null>(null)

  // Student submit assignment modal (UC-HOMEWORK-02)
  const [selectedHwToSubmit, setSelectedHwToSubmit] = useState<HomeworkAssignment | null>(null)

  // Student's submissions cache
  const [mySubmissions, setMySubmissions] = useState<Record<string, HomeworkSubmission>>({})

  // Load assignments & submissions
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await homeworkService.getAssignments()
      setAssignments(data)

      const studentId = user?.id || 'stu-101'
      const subsMap: Record<string, HomeworkSubmission> = {}
      for (const h of data) {
        const sub = await homeworkService.getStudentSubmission(h.id, studentId)
        if (sub) subsMap[h.id] = sub
      }
      setMySubmissions(subsMap)
    } catch (e) {
      console.error(e)
      showToast('Failed to load homework assignments', 'error')
    } finally {
      setLoading(false)
    }
  }, [user?.id, showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Class & Subject options
  const classOptions = useMemo(() => {
    const set = new Set(assignments.map((h) => h.class))
    return ['All Classes', ...Array.from(set)]
  }, [assignments])

  const subjectOptions = useMemo(() => {
    const set = new Set(assignments.map((h) => h.subject))
    return ['All Subjects', ...Array.from(set)]
  }, [assignments])

  // Filtered list
  const filteredAssignments = useMemo(() => {
    return assignments.filter((h) => {
      if (activeRolePerspective === 'student' && h.status !== 'Published') {
        return false
      }
      if (selectedClass !== 'All Classes' && h.class !== selectedClass) return false
      if (selectedSubject !== 'All Subjects' && h.subject !== selectedSubject) return false
      if (selectedStatus !== 'All' && h.status !== selectedStatus) return false

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesTitle = h.title.toLowerCase().includes(term)
        const matchesDesc = h.instructions.toLowerCase().includes(term)
        const matchesSubject = h.subject.toLowerCase().includes(term)
        if (!matchesTitle && !matchesDesc && !matchesSubject) return false
      }

      return true
    })
  }, [assignments, activeRolePerspective, selectedClass, selectedSubject, selectedStatus, searchTerm])

  // Teacher publish action
  const handlePublish = async (id: string) => {
    try {
      await homeworkService.publishHomework(id)
      showToast('Homework assignment published!', 'success')
      loadData()
    } catch (e) {
      console.error(e)
      showToast('Failed to publish homework', 'error')
    }
  }

  // Teacher delete action
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this homework assignment?')) return
    try {
      await homeworkService.deleteHomework(id)
      showToast('Assignment deleted', 'info')
      loadData()
    } catch (e) {
      console.error(e)
      showToast('Failed to delete assignment', 'error')
    }
  }

  // Open review drawer for teacher (UC-HOMEWORK-03)
  const handleOpenReview = async (hw: HomeworkAssignment) => {
    setSelectedHwForReview(hw)
    setLoadingSubmissions(true)
    try {
      const subs = await homeworkService.getSubmissionsForAssignment(hw.id)
      setHwSubmissionsList(subs)
    } catch (e) {
      console.error(e)
      showToast('Failed to load submissions', 'error')
    } finally {
      setLoadingSubmissions(false)
    }
  }

  // Stats
  const stats = useMemo(() => {
    const total = assignments.length
    const published = assignments.filter((a) => a.status === 'Published').length
    const totalSubs = assignments.reduce((acc, a) => acc + (a.submissionsCount || 0), 0)
    const totalGraded = assignments.reduce((acc, a) => acc + (a.gradedCount || 0), 0)
    return { total, published, totalSubs, totalGraded }
  }, [assignments])

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <PageHeading
            title="Homework & Coursework"
            subtitle="Distribute coursework, manage file submissions with drag-and-drop, and conduct rubric-based grading."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Switcher */}
          <div className="flex items-center rounded-2xl glass-sm p-1 border border-text-main/10 shadow-sm">
            <button
              onClick={() => setActiveRolePerspective('teacher')}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                activeRolePerspective === 'teacher'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-text-main/65 hover:text-text-main hover:bg-text-main/5'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Teacher View
            </button>
            <button
              onClick={() => setActiveRolePerspective('student')}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                activeRolePerspective === 'student'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-text-main/65 hover:text-text-main hover:bg-text-main/5'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Student View
            </button>
          </div>

          {activeRolePerspective === 'teacher' && (
            <Button
              variant="solid"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 shadow-brand-700/30"
            >
              <Plus className="h-4 w-4" />
              Assign Homework
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Total Assignments</span>
            <FileText className="h-4 w-4 text-brand-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text-main">{stats.total}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Active in academic curriculum</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.published}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Accessible by students</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Submissions Received</span>
            <UploadCloud className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text-main">{stats.totalSubs}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Files and written solutions</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Reviewed & Graded</span>
            <Award className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text-main">{stats.totalGraded}</p>
          <p className="mt-0.5 text-xs text-text-main/50">With scores & feedback</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-3xl glass-sm p-4 border border-white/20 dark:border-white/10 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-main/40" />
          <input
            type="text"
            placeholder="Search homework by title, subject, or prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl bg-white/60 dark:bg-black/20 pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-main/40 border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            {classOptions.map((c) => (
              <option key={c} value={c} className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            {subjectOptions.map((s) => (
              <option key={s} value={s} className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                {s}
              </option>
            ))}
          </select>

          {activeRolePerspective === 'teacher' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="All" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                All Statuses
              </option>
              <option value="Published" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                Published
              </option>
              <option value="Draft" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                Draft
              </option>
            </select>
          )}
        </div>
      </div>

      {/* Homework Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600"></div>
          <p className="mt-3 text-sm text-text-main/60">Loading assignments...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="rounded-3xl glass-sm p-12 text-center border border-white/20 dark:border-white/10">
          <FileText className="mx-auto h-12 w-12 text-text-main/30" />
          <h3 className="mt-3 text-base font-semibold text-text-main">No homework assignments found</h3>
          <p className="mt-1 text-sm text-text-main/55">
            {activeRolePerspective === 'teacher'
              ? 'Click "Assign Homework" above to distribute coursework to your classes.'
              : 'There are no active homework assignments for your selected filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((hw) => {
            const studentSub = mySubmissions[hw.id]
            const isSubmitted = Boolean(studentSub)
            const isGraded = studentSub?.status === 'Graded'
            const dueDateObj = new Date(hw.dueDate)
            const isPastDue = dueDateObj < new Date()

            return (
              <div
                key={hw.id}
                className="group relative flex flex-col justify-between rounded-3xl glass-sm p-6 border border-white/20 dark:border-white/10 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                      {hw.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {hw.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3.5 text-base font-bold text-text-main group-hover:text-brand-600 transition-colors">
                    {hw.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-text-main/60">
                    {hw.instructions}
                  </p>

                  {/* Attachment pills if any */}
                  {hw.attachments && hw.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hw.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-xl bg-text-main/5 px-2.5 py-1 text-[11px] text-text-main/70 border border-text-main/10"
                        >
                          <Paperclip className="h-3 w-3 text-brand-600" />
                          <span className="truncate max-w-[140px]">{att.name}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-text-main/5 p-3 text-xs text-text-main/70">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{hw.class}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{hw.maxPoints} Points</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-text-main/50" />
                      <span className={isPastDue ? 'text-rose-500 font-semibold' : ''}>
                        Due: {dueDateObj.toLocaleDateString()} {dueDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Student submission state */}
                  {activeRolePerspective === 'student' && isSubmitted && (
                    <div className="mt-3 rounded-2xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-200 border border-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          {isGraded ? `Graded: ${studentSub?.score} / ${hw.maxPoints}` : 'Submitted'}
                        </span>
                        <span className="text-[11px] opacity-75">
                          {new Date(studentSub!.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                      {isGraded && studentSub?.feedback && (
                        <p className="mt-2 text-[11px] bg-white/60 dark:bg-black/30 p-2 rounded-xl italic">
                          "{studentSub.feedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 border-t border-text-main/10 pt-4">
                  {activeRolePerspective === 'teacher' ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {hw.status === 'Draft' ? (
                          <button
                            onClick={() => handlePublish(hw.id)}
                            className="rounded-xl bg-emerald-600/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/25 transition"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenReview(hw)}
                            className="flex items-center gap-1.5 rounded-xl bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-500/25 transition"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Submissions ({hw.submissionsCount || 0})
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(hw.id)}
                        className="rounded-xl p-1.5 text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete Assignment"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    /* Student Perspective */
                    <div>
                      {isSubmitted ? (
                        <Button
                          variant="solidOutline"
                          size="sm"
                          onClick={() => setSelectedHwToSubmit(hw)}
                          className="w-full text-xs"
                        >
                          Resubmit Solution (UC-HOMEWORK-02)
                        </Button>
                      ) : (
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => setSelectedHwToSubmit(hw)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs py-2 shadow-sm"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Submit Assignment (UC-HOMEWORK-02)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CREATE HOMEWORK MODAL (UC-HOMEWORK-01)
         ========================================================================= */}
      {isCreateModalOpen && (
        <CreateHomeworkModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => {
            setIsCreateModalOpen(false)
            loadData()
            showToast('Homework assignment created!', 'success')
          }}
        />
      )}

      {/* =========================================================================
          MODAL 2: STUDENT SUBMIT HOMEWORK MODAL (UC-HOMEWORK-02)
         ========================================================================= */}
      {selectedHwToSubmit && (
        <SubmitHomeworkModal
          assignment={selectedHwToSubmit}
          onClose={() => setSelectedHwToSubmit(null)}
          onSubmitted={() => {
            setSelectedHwToSubmit(null)
            loadData()
            showToast('Assignment submitted successfully for faculty review!', 'success')
          }}
        />
      )}

      {/* =========================================================================
          MODAL 3: TEACHER SUBMISSIONS & GRADING MODAL (UC-HOMEWORK-03)
         ========================================================================= */}
      {selectedHwForReview && (
        <ReviewSubmissionsModal
          assignment={selectedHwForReview}
          submissions={hwSubmissionsList}
          loading={loadingSubmissions}
          onClose={() => setSelectedHwForReview(null)}
          onGraded={() => {
            handleOpenReview(selectedHwForReview)
            loadData()
            showToast('Grade and constructive feedback recorded!', 'success')
          }}
        />
      )}
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: CREATE HOMEWORK MODAL (UC-HOMEWORK-01)
   ========================================================================= */
interface CreateHomeworkModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

function CreateHomeworkModal({ isOpen, onClose, onCreated }: CreateHomeworkModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [targetClass, setTargetClass] = useState('Grade 10 - A')
  const [maxPoints, setMaxPoints] = useState(50)
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toISOString().split('T')[0]
  })
  const [status, setStatus] = useState<HomeworkStatus>('Published')
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await homeworkService.createHomework({
        title,
        instructions,
        subject,
        class: targetClass,
        teacherId: user?.id || 'tch-1',
        teacherName: user ? `${user.firstName} ${user.lastName}` : 'Faculty Member',
        maxPoints,
        dueDate: new Date(`${dueDate}T23:59:59Z`).toISOString(),
        status,
        allowLateSubmissions,
      })
      onCreated()
    } catch (err) {
      console.error(err)
      alert('Failed to create homework')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl glass-strong border border-white/30 dark:border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-2.5 text-brand-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Assign Homework (UC-HOMEWORK-01)</h2>
              <p className="text-xs text-text-main/60">Define task requirements, attach prompt guidelines, and set deadlines.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4: Quadratic Optimization & Word Problems"
              className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1">Instructions & Rubric</label>
            <textarea
              rows={3}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide exact deliverables, problem numbers, citation requirements..."
              className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English Literature">English Literature</option>
                <option value="World History">World History</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">Assigned Class</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Grade 10 - A">Grade 10 - A</option>
                <option value="Grade 10 - B">Grade 10 - B</option>
                <option value="Grade 11 - Advanced">Grade 11 - Advanced</option>
                <option value="Grade 12 - STEM">Grade 12 - STEM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">Max Points</label>
              <input
                type="number"
                min={5}
                max={500}
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as HomeworkStatus)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Published">Published (Immediate Student Access)</option>
                <option value="Draft">Draft (Hold for review)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-main">
                <input
                  type="checkbox"
                  checked={allowLateSubmissions}
                  onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                Allow Late Submissions
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-text-main/10 pt-4">
            <Button type="button" variant="none" size="md" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-text-main/70 hover:bg-text-main/5">
              Cancel
            </Button>
            <Button type="submit" variant="solid" size="md" className="flex items-center gap-2 text-xs font-semibold">
              <Check className="h-4 w-4" />
              Publish Homework
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: STUDENT SUBMIT HOMEWORK MODAL (UC-HOMEWORK-02)
   Supports drag & drop and click file selection
   ========================================================================= */
interface SubmitHomeworkModalProps {
  assignment: HomeworkAssignment
  onClose: () => void
  onSubmitted: () => void
}

function SubmitHomeworkModal({ assignment, onClose, onSubmitted }: SubmitHomeworkModalProps) {
  const { user } = useAuth()
  const [textResponse, setTextResponse] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textResponse.trim() && !selectedFile) {
      alert('Please provide a written response or upload an attachment.')
      return
    }

    setIsSubmitting(true)
    try {
      const studentId = user?.id || 'stu-101'
      const studentName = user ? `${user.firstName} ${user.lastName}` : 'Alex Cooper'

      await homeworkService.submitHomework({
        homeworkId: assignment.id,
        studentId,
        studentName,
        studentClass: assignment.class,
        textResponse,
        fileName: selectedFile ? selectedFile.name : 'Written_Assignment_Response.pdf',
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
      })
      onSubmitted()
    } catch (err) {
      console.error(err)
      alert('Failed to submit assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl glass-strong border border-white/30 dark:border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
          <div>
            <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
              {assignment.subject}
            </span>
            <h2 className="mt-1 text-lg font-bold text-text-main">Submit Assignment (UC-HOMEWORK-02)</h2>
            <p className="text-xs text-text-main/60">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1.5">
              Solution Notes / Explanation
            </label>
            <textarea
              rows={4}
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              placeholder="Describe your reasoning, mention sources referenced, or write your solution text here..."
              className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2.5 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Drag & Drop File Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1.5">
              Attach File (PDF, DOCX, XLSX, Images up to 25MB)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-text-main/20 bg-text-main/5 hover:bg-text-main/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <UploadCloud className="h-8 w-8 text-brand-600 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-text-main">{selectedFile.name}</p>
                  <p className="text-[11px] text-text-main/50">
                    {(selectedFile.size / 1024).toFixed(1)} KB — Click or drop to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-text-main">
                    Drag and drop your file here, or <span className="text-brand-600 underline">browse</span>
                  </p>
                  <p className="text-[11px] text-text-main/50 mt-1">Supports PDF, DOCX, ZIP, PNG, JPEG</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-text-main/10 pt-4">
            <Button type="button" variant="none" size="md" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-text-main/70 hover:bg-text-main/5">
              Cancel
            </Button>
            <Button type="submit" variant="solid" size="md" disabled={isSubmitting} className="flex items-center gap-2 text-xs font-semibold">
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: REVIEW SUBMISSIONS & GRADING MODAL (UC-HOMEWORK-03)
   ========================================================================= */
interface ReviewSubmissionsModalProps {
  assignment: HomeworkAssignment
  submissions: HomeworkSubmission[]
  loading: boolean
  onClose: () => void
  onGraded: () => void
}

function ReviewSubmissionsModal({
  assignment,
  submissions,
  loading,
  onClose,
  onGraded,
}: ReviewSubmissionsModalProps) {
  const { user } = useAuth()
  const [activeSub, setActiveSub] = useState<HomeworkSubmission | null>(null)
  const [scoreInput, setScoreInput] = useState<number>(assignment.maxPoints)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false)

  const handleSelectToGrade = (sub: HomeworkSubmission) => {
    setActiveSub(sub)
    setScoreInput(sub.score !== undefined ? sub.score : assignment.maxPoints)
    setFeedbackInput(sub.feedback || '')
  }

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSub) return
    setIsSubmittingGrade(true)
    try {
      const grader = user ? `${user.firstName} ${user.lastName}` : 'Faculty Member'
      await homeworkService.reviewHomework(activeSub.id, scoreInput, feedbackInput, grader)
      setActiveSub(null)
      onGraded()
    } catch (e) {
      console.error(e)
      alert('Failed to record grade')
    } finally {
      setIsSubmittingGrade(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl glass-strong border border-white/30 dark:border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
          <div>
            <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
              {assignment.subject} • {assignment.class}
            </span>
            <h2 className="mt-1 text-lg font-bold text-text-main">
              Submissions & Evaluation (UC-HOMEWORK-03)
            </h2>
            <p className="text-xs text-text-main/60">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-main/60">
              Student Submissions ({submissions.length})
            </h3>

            {loading ? (
              <p className="text-xs text-text-main/50 py-8 text-center">Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <div className="rounded-2xl bg-text-main/5 p-6 text-center text-xs text-text-main/50">
                No submissions received yet for this assignment.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {submissions.map((sub) => {
                  const isSelected = activeSub?.id === sub.id
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectToGrade(sub)}
                      className={`rounded-2xl p-3 border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-500/15 border-brand-500 ring-2 ring-brand-500/30'
                          : 'bg-white/60 dark:bg-black/30 border-text-main/10 hover:bg-text-main/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-main">{sub.studentName}</span>
                        {sub.status === 'Graded' ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {sub.score} / {assignment.maxPoints} pts
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            Needs Review
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-text-main/60">
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {sub.fileName || 'Solution.pdf'}
                        </span>
                        <span>{new Date(sub.submissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Grading Pane */}
          <div className="rounded-2xl bg-text-main/5 p-5 border border-text-main/10">
            {activeSub ? (
              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div className="border-b border-text-main/10 pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-text-main/50 font-bold">
                    Reviewing Student Work
                  </span>
                  <h4 className="text-base font-bold text-text-main">{activeSub.studentName}</h4>
                  <p className="text-xs text-text-main/60">
                    Submitted: {new Date(activeSub.submissionDate).toLocaleString()}
                  </p>
                </div>

                {/* Submitted Content Preview */}
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">
                    Student Notes / Response
                  </label>
                  <div className="rounded-xl bg-white/70 dark:bg-black/40 p-3 text-xs text-text-main leading-relaxed border border-text-main/10 max-h-28 overflow-y-auto">
                    {activeSub.textResponse || '(No supplementary notes submitted)'}
                  </div>
                </div>

                {/* File Attachment */}
                <div className="flex items-center justify-between rounded-xl bg-white/70 dark:bg-black/40 p-3 border border-text-main/10">
                  <div className="flex items-center gap-2 text-xs">
                    <FileCheck className="h-4 w-4 text-brand-600" />
                    <div>
                      <p className="font-semibold text-text-main">{activeSub.fileName}</p>
                      <p className="text-[10px] text-text-main/50">{activeSub.fileSize}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Simulating download of ${activeSub.fileName}`)}
                    className="flex items-center gap-1 rounded-lg bg-text-main/10 px-2.5 py-1 text-xs font-medium text-text-main hover:bg-text-main/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>

                {/* Score & Feedback Inputs */}
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">
                    Score (out of {assignment.maxPoints})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={assignment.maxPoints}
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">
                    Faculty Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Commend strengths, point out calculations needing improvement..."
                    className="w-full rounded-xl bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="solid"
                    size="sm"
                    disabled={isSubmittingGrade}
                    className="text-xs px-4"
                  >
                    {isSubmittingGrade ? 'Saving...' : 'Record Grade & Feedback'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-main/40">
                <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-xs font-medium">Select a student submission on the left to grade and provide feedback.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-text-main/10 pt-4">
          <Button variant="glass" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
