// src/pages/Academic/Homework.tsx
import { useState, useEffect, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  FileCheck2, Plus, Search, BookOpen, Calendar, Clock, FileText,
  Upload, CheckCircle2, AlertCircle, X, Layers, ChevronRight,
  MessageSquare, Award,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, HomeworkSubmission } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { classService, type ClassRecord } from '@/services/classService'
import { subjectService } from '@/services/subjectService'

interface HomeworkForm {
  title: string
  description: string
  classId: string
  subjectId: string
  dueDate: string
  maxScore: number
  allowLateSubmissions: boolean
}

const DEFAULT_FORM: HomeworkForm = {
  title: '', description: '', classId: '', subjectId: '',
  dueDate: '', maxScore: 100, allowLateSubmissions: true,
}

export default function HomeworkPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [mySubmissions, setMySubmissions] = useState<HomeworkSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<HomeworkForm>({ ...DEFAULT_FORM })

  const [reviewHomework, setReviewHomework] = useState<Homework | null>(null)
  const [reviewSubmissions, setReviewSubmissions] = useState<HomeworkSubmission[]>([])
  const [reviewLoading, setReviewLoading] = useState(false)

  const [submitHomework, setSubmitHomework] = useState<Homework | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submissionFileUrl, setSubmissionFileUrl] = useState('')

  const [gradingSubmission, setGradingSubmission] = useState<HomeworkSubmission | null>(null)
  const [gradeInput, setGradeInput] = useState(0)
  const [feedbackInput, setFeedbackInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [list, cls, subj] = await Promise.all([
        academicService.getHomeworkList(),
        classService.list().catch(() => []),
        subjectService.list().catch(() => []),
      ])
      setHomeworkList(Array.isArray(list) ? list : [])
      setClasses(Array.isArray(cls) ? cls : [])
      setSubjects(Array.isArray(subj) ? subj.map((s) => ({ id: s.id, name: s.name })) : [])
    } catch {
      showToast('Failed to load homework', 'error')
      setHomeworkList([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!isStudent) { setMySubmissions([]); return }
    let cancelled = false
    ;(async () => {
      const all: HomeworkSubmission[] = []
      await Promise.all(
        homeworkList.map(async (hw) => {
          try {
            const subs = await academicService.getSubmissions(hw.id)
            for (const s of subs) if (s.studentId === user?.id) all.push(s)
          } catch { /* endpoint may be missing */ }
        })
      )
      if (!cancelled) setMySubmissions(all)
    })()
    return () => { cancelled = true }
  }, [homeworkList, isStudent, user?.id])

  const mySubmissionFor = (hwId: string) => mySubmissions.find((s) => s.homeworkId === hwId)

  const filtered = homeworkList.filter((hw) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      hw.title.toLowerCase().includes(q) ||
      hw.description.toLowerCase().includes(q) ||
      hw.subjectName.toLowerCase().includes(q)
    )
  })

  const kpiCards: StatCard[] = [
    { id: 'available', label: 'Assignments',       value: String(filtered.length),                                     delta: '-', deltaDirection: 'neutral', deltaLabel: 'matching filters',      icon: 'FileCheck2',    tint: 'blue' },
    { id: 'submitted', label: isStudent ? 'Your Submissions' : 'Total Submissions', value: String(mySubmissions.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'this term',             icon: 'CheckCircle2',  tint: 'green' },
    { id: 'graded',    label: 'Graded',            value: String(mySubmissions.filter((s) => s.status === 'Graded').length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'feedback available',  icon: 'Award',         tint: 'amber' },
    { id: 'points',    label: 'Available Points',  value: String(filtered.reduce((sum, h) => sum + h.maxPoints, 0)),    delta: '-', deltaDirection: 'neutral', deltaLabel: 'assessment value',    icon: 'Layers',        tint: 'violet' },
  ]

  const openCreate = () => {
    setForm({
      ...DEFAULT_FORM,
      classId: classes[0]?.id ?? '',
      subjectId: subjects[0]?.id ?? '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    })
    setIsCreateOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.subjectId || !form.dueDate) {
      showToast('Title, subject, and due date are required', 'error')
      return
    }
    try {
      await academicService.createHomework({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        subjectId: form.subjectId,
        classId: form.classId || undefined,
        dueDate: new Date(form.dueDate).toISOString(),
        maxScore: form.maxScore,
        allowLateSubmissions: form.allowLateSubmissions,
      })
      showToast('Assignment published', 'success')
      setIsCreateOpen(false)
      await load()
    } catch {
      showToast('Failed to create assignment', 'error')
    }
  }

  const openReview = async (hw: Homework) => {
    setReviewHomework(hw)
    setReviewLoading(true)
    try {
      const subs = await academicService.getSubmissions(hw.id)
      setReviewSubmissions(Array.isArray(subs) ? subs : [])
    } catch {
      setReviewSubmissions([])
    } finally {
      setReviewLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submitHomework) return
    try {
      await academicService.submitHomework(submitHomework.id, {
        content: submissionText.trim() || undefined,
        fileUrl: submissionFileUrl.trim() || undefined,
      })
      showToast('Assignment submitted', 'success')
      setSubmitHomework(null)
      setSubmissionText('')
      setSubmissionFileUrl('')
      await load()
    } catch {
      showToast('Error submitting assignment', 'error')
    }
  }

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gradingSubmission) return
    try {
      await academicService.gradeSubmission(
        gradingSubmission.id,
        gradeInput,
        feedbackInput || undefined
      )
      showToast('Grade saved', 'success')
      setGradingSubmission(null)
      if (reviewHomework) await openReview(reviewHomework)
    } catch {
      showToast('Error saving grade', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Homework' : 'Homework & Assignments'}
          subtitle={
            isStudent
              ? 'Track deadlines, submit work, and review feedback.'
              : 'Create assignments and review student submissions.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm shadow-brand-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Assign Homework
          </button>
        )}
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="glass-sm rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-fg-muted">Loading assignments...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center">
          <FileCheck2 className="w-12 h-12 text-fg-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-fg">No assignments</h3>
          <p className="text-sm text-fg-muted mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Assign Homework" to create the first assignment.'
              : 'No homework assignments match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((hw) => {
            const sub = isStudent ? mySubmissionFor(hw.id) : undefined
            const isDueSoon =
              new Date(hw.dueDate).getTime() - Date.now() < 3 * 86400000 &&
              new Date(hw.dueDate).getTime() > Date.now()

            return (
              <div
                key={hw.id}
                className="glass-sm rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/15 text-brand-600 dark:text-brand-300">
                      <BookOpen className="w-3 h-3" />
                      {hw.subjectName}
                    </span>

                    {isStudent && (
                      sub?.status === 'Graded' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-success/15 text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          {sub.grade ?? 0} / {hw.maxPoints}
                        </span>
                      ) : sub?.status === 'Submitted' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-info/15 text-info">
                          <Clock className="w-3 h-3" />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-warning/15 text-warning">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )
                    )}
                  </div>

                  <h3 className="font-semibold text-fg text-base line-clamp-1">{hw.title}</h3>
                  <p className="text-sm text-fg-muted mt-1 line-clamp-2">{hw.description}</p>

                  <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] space-y-2 text-xs text-fg-muted">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {hw.dueDate}
                      </span>
                      <span className="font-medium text-fg">Max: {hw.maxPoints} pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {hw.className || '—'}
                      </span>
                      {!isStudent && (
                        <span className="text-brand-600 dark:text-brand-400 font-medium">
                          {hw.submissionsCount} submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {isStudent && sub?.status === 'Graded' && sub.feedback && (
                    <div className="mt-3 p-2.5 rounded-xl shadow-sunken text-xs">
                      <span className="font-semibold text-fg flex items-center gap-1 mb-1">
                        <MessageSquare className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                        Feedback:
                      </span>
                      <p className="text-fg-muted italic">"{sub.feedback}"</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-between">
                  <span className="text-xs text-fg-muted">
                    {isDueSoon && !sub ? (
                      <span className="text-error font-medium">Due soon</span>
                    ) : (
                      `By ${hw.teacherName || '—'}`
                    )}
                  </span>

                  {isStudent ? (
                    sub?.status === 'Graded' ? (
                      <span className="text-xs px-3 py-1.5 rounded-xl font-medium text-fg-muted shadow-sunken">
                        Graded
                      </span>
                    ) : sub?.status === 'Submitted' ? (
                      <button
                        onClick={() => {
                          setSubmitHomework(hw)
                          setSubmissionText(sub.content)
                          setSubmissionFileUrl(sub.attachments[0]?.url ?? '')
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium text-fg shadow-sunken hover:text-brand-600 dark:hover:text-brand-400 transition cursor-pointer"
                      >
                        Resubmit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSubmitHomework(hw)
                          setSubmissionText('')
                          setSubmissionFileUrl('')
                        }}
                        className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Submit
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => openReview(hw)}
                      className="text-xs px-3.5 py-1.5 rounded-xl font-medium text-fg shadow-sunken hover:text-brand-600 dark:hover:text-brand-400 transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      Review <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Student submit modal */}
      {submitHomework && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSubmitHomework(null) }}
        >
          <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog" aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  {submitHomework.subjectName}
                </span>
                <h3 className="text-lg font-bold text-fg mt-1">Submit: {submitHomework.title}</h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  Due {submitHomework.dueDate} • {submitHomework.maxPoints} pts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitHomework(null)}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitHomework.description && (
              <div className="p-3 rounded-xl shadow-sunken text-xs text-fg-muted">
                <span className="font-semibold text-fg block mb-1">Instructions:</span>
                {submitHomework.description}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-fg-muted mb-1">Your Answer</label>
              <textarea
                rows={4}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your solution or notes..."
                className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg-muted mb-1">Attachment URL (optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={submissionFileUrl}
                onChange={(e) => setSubmissionFileUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSubmitHomework(null)}
                className="glass-sm glass-interactive px-4 py-2 rounded-xl text-sm font-medium text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Turn In
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review modal */}
      {reviewHomework && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) { setReviewHomework(null); setGradingSubmission(null) } }}
        >
          <div className="glass-strong rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-start justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  {reviewHomework.className || '—'} • {reviewHomework.subjectName}
                </span>
                <h3 className="text-lg font-bold text-fg mt-1">Submissions: {reviewHomework.title}</h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  Max {reviewHomework.maxPoints} pts • Due {reviewHomework.dueDate}
                </p>
              </div>
              <button
                onClick={() => { setReviewHomework(null); setGradingSubmission(null) }}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewLoading ? (
              <div className="py-12 text-center text-fg-muted text-sm">Loading submissions...</div>
            ) : reviewSubmissions.length === 0 ? (
              <div className="py-12 text-center text-fg-muted">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewSubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl shadow-sunken space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-fg text-sm">{sub.studentName} ({sub.studentCode})</h4>
                        <span className="text-xs text-fg-muted">{sub.submittedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            sub.status === 'Graded' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'
                          }`}
                        >
                          {sub.status === 'Graded' ? `${sub.grade}/${reviewHomework.maxPoints}` : 'Pending'}
                        </span>
                        <button
                          onClick={() => {
                            setGradingSubmission(sub)
                            setGradeInput(sub.grade ?? 0)
                            setFeedbackInput(sub.feedback ?? '')
                          }}
                          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white transition cursor-pointer"
                        >
                          {sub.status === 'Graded' ? 'Edit' : 'Grade'}
                        </button>
                      </div>
                    </div>

                    {sub.content && (
                      <p className="text-xs text-fg-muted p-3 rounded-xl shadow-emboss">
                        {sub.content}
                      </p>
                    )}

                    {sub.feedback && (
                      <div className="text-xs text-fg-muted italic bg-warning/10 p-2 rounded-lg border border-warning/30">
                        Feedback: "{sub.feedback}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {gradingSubmission && (
              <form
                onSubmit={handleGrade}
                className="p-4 rounded-2xl shadow-sunken border border-brand-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-fg flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    Grade for {gradingSubmission.studentName}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="text-xs text-fg-muted hover:text-fg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-fg-muted mb-1">
                      Score (of {reviewHomework.maxPoints})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={reviewHomework.maxPoints}
                      required
                      value={gradeInput}
                      onChange={(e) => setGradeInput(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-sm rounded-xl text-fg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-fg-muted mb-1">Feedback</label>
                    <input
                      type="text"
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsCreateOpen(false) }}
        >
          <form
            onSubmit={handleCreate}
            className="glass-strong rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog" aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <h2 className="text-lg font-bold text-fg">Assign New Homework</h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Title *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1">Class</label>
                  <select
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="">—</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1">Subject *</label>
                  <select
                    required value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="">Select</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1">Due Date *</label>
                  <input
                    type="date" required value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1">Max Points</label>
                  <input
                    type="number" min={1} max={500}
                    value={form.maxScore}
                    onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-fg cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowLateSubmissions}
                  onChange={(e) => setForm({ ...form, allowLateSubmissions: e.target.checked })}
                />
                Allow late submissions
              </label>
            </div>

            <div className="pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="glass-sm glass-interactive px-4 py-2 rounded-xl text-sm font-medium text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition cursor-pointer"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}