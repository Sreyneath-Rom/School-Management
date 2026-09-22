// src/pages/Academic/Quizzes.tsx
import { useState, useEffect, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  HelpCircle, Plus, Search, BookOpen, Clock, X, Layers, ChevronRight,
  ChevronLeft, Award, Timer, Check,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Quiz, QuizQuestion, QuizSubmission } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { classService, type ClassRecord } from '@/services/classService'
import { subjectService } from '@/services/subjectService'

interface QuizForm {
  title: string
  classId: string
  subjectId: string
  timeLimitMin: number
  isAutoGrade: boolean
  questions: QuizQuestion[]
}

const EMPTY_QUESTION: QuizQuestion = {
  id: '', question: '', options: ['', '', '', ''], correctAnswer: 0, points: 5,
}

export default function QuizzesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<QuizForm>({
    title: '', classId: '', subjectId: '', timeLimitMin: 20, isAutoGrade: true, questions: [],
  })

  const [reviewQuiz, setReviewQuiz] = useState<Quiz | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [result, setResult] = useState<{ quiz: Quiz; submission: QuizSubmission } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [qs, cls, subj] = await Promise.all([
        academicService.getQuizzes(),
        classService.list().catch(() => []),
        subjectService.list().catch(() => []),
      ])
      setQuizzes(Array.isArray(qs) ? qs : [])
      setClasses(Array.isArray(cls) ? cls : [])
      setSubjects(Array.isArray(subj) ? subj.map((s) => ({ id: s.id, name: s.name })) : [])
    } catch {
      showToast('Failed to load quizzes', 'error')
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => { if (s <= 1) { window.clearInterval(id); return 0 } return s - 1 })
    }, 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, secondsLeft])

  useEffect(() => {
    if (activeQuiz && secondsLeft === 0 && timerRunning) {
      setTimerRunning(false)
      void submitActive()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  const filtered = quizzes.filter((q) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return q.title.toLowerCase().includes(term) || q.subjectName.toLowerCase().includes(term)
  })

  const kpiCards: StatCard[] = [
    { id: 'total',     label: 'Quizzes',         value: String(filtered.length),                                     delta: '-', deltaDirection: 'neutral', deltaLabel: 'matching filters', icon: 'HelpCircle', tint: 'blue' },
    { id: 'questions', label: 'Total Questions', value: String(filtered.reduce((sum, q) => sum + q.questions.length, 0)), delta: '-', deltaDirection: 'neutral', deltaLabel: 'across quizzes', icon: 'Layers',    tint: 'violet' },
    { id: 'points',    label: 'Total Points',    value: String(filtered.reduce((sum, q) => sum + q.totalPoints, 0)),    delta: '-', deltaDirection: 'neutral', deltaLabel: 'available',       icon: 'Award',     tint: 'amber' },
    { id: 'attempts',  label: 'Total Attempts',  value: String(filtered.reduce((sum, q) => sum + q.attemptsCount, 0)),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'by students',     icon: 'Clock',     tint: 'green' },
  ]

  const openCreate = () => {
    setForm({
      title: '',
      classId: classes[0]?.id ?? '',
      subjectId: subjects[0]?.id ?? '',
      timeLimitMin: 20,
      isAutoGrade: true,
      questions: [{ ...EMPTY_QUESTION, id: `q-${Date.now()}` }],
    })
    setIsCreateOpen(true)
  }

  const handleAddQuestion = () => {
    setForm((p) => ({
      ...p,
      questions: [...p.questions, { ...EMPTY_QUESTION, id: `q-${Date.now()}-${p.questions.length}` }],
    }))
  }

  const handleUpdateQuestion = (i: number, patch: Partial<QuizQuestion>) => {
    setForm((p) => {
      const next = [...p.questions]
      next[i] = { ...next[i], ...patch }
      return { ...p, questions: next }
    })
  }

  const handleUpdateOption = (qi: number, oi: number, value: string) => {
    setForm((p) => {
      const next = [...p.questions]
      const opts = [...next[qi].options]
      opts[oi] = value
      next[qi] = { ...next[qi], options: opts }
      return { ...p, questions: next }
    })
  }

  const handleRemoveQuestion = (i: number) => {
    setForm((p) => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.subjectId) {
      showToast('Title and subject are required', 'error'); return
    }
    if (form.questions.length === 0) {
      showToast('At least one question is required', 'error'); return
    }
    for (const q of form.questions) {
      if (!q.question.trim() || q.options.some((o) => !o.trim())) {
        showToast('Every question needs text and all options filled', 'error'); return
      }
    }

    try {
      await academicService.createQuiz({
        title: form.title.trim(),
        subjectId: form.subjectId,
        classId: form.classId || undefined,
        isAutoGrade: form.isAutoGrade,
        timeLimitMin: form.timeLimitMin,
        questions: form.questions.map((q) => ({
          questionText: q.question.trim(),
          options: q.options.map((o) => o.trim()),
          correctAnswer: q.options[q.correctAnswer] ?? '',
          points: q.points,
        })),
      })
      showToast('Quiz created', 'success')
      setIsCreateOpen(false)
      await load()
    } catch {
      showToast('Error creating quiz', 'error')
    }
  }

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setCurrentIdx(0)
    setAnswers({})
    const secs = (quiz.durationMinutes || 20) * 60
    setSecondsLeft(secs)
    setTimerRunning(true)
  }

  const submitActive = async () => {
    if (!activeQuiz) return
    try {
      const res = await academicService.submitQuiz(activeQuiz.id, answers)
      setResult({ quiz: activeQuiz, submission: res })
      setActiveQuiz(null)
      setTimerRunning(false)
      await load()
    } catch {
      showToast('Error submitting quiz', 'error')
    }
  }

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Quizzes' : 'Quizzes & Assessments'}
          subtitle={
            isStudent
              ? 'Take timed assessments and track your scores.'
              : 'Create multiple-choice quizzes and manage attempts.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm shadow-brand-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </button>
        )}
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="glass-sm rounded-2xl p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-fg-muted">Loading quizzes...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-fg-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-fg">No quizzes</h3>
          <p className="text-sm text-fg-muted mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Create Quiz" to author the first assessment.'
              : 'No quizzes available for your class.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((q) => (
            <div key={q.id} className="glass-sm rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/15 text-brand-600 dark:text-brand-300">
                    <BookOpen className="w-3 h-3" />
                    {q.subjectName || '—'}
                  </span>
                </div>

                <h3 className="font-semibold text-fg text-base line-clamp-1">{q.title}</h3>

                <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] space-y-2 text-xs text-fg-muted">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {q.durationMinutes} min limit
                    </span>
                    <span className="font-medium text-fg">
                      {q.questions.length} Qs • {q.totalPoints} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {q.className || '—'}
                    </span>
                    {!isStudent && (
                      <span className="text-brand-600 dark:text-brand-400 font-medium">
                        {q.attemptsCount} attempts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-end">
                {isStudent ? (
                  <button
                    onClick={() => startQuiz(q)}
                    className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Start Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setReviewQuiz(q)}
                    className="text-xs px-3.5 py-1.5 rounded-xl font-medium text-fg shadow-sunken hover:text-brand-600 dark:hover:text-brand-400 transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    View Questions <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Take quiz */}
      {activeQuiz && activeQuiz.questions[currentIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in duration-150">
          <div className="glass-strong rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="p-5 shadow-[0_1px_0_var(--neu-shadow-dark)] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  {activeQuiz.subjectName}
                </span>
                <h3 className="font-bold text-fg text-base mt-1">{activeQuiz.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                    secondsLeft < 180
                      ? 'bg-error/15 text-error animate-pulse'
                      : 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  {formatTimer(secondsLeft)}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Exit? Answers will be lost.')) {
                      setActiveQuiz(null); setTimerRunning(false)
                    }
                  }}
                  className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-3 shadow-[0_1px_0_var(--neu-shadow-dark)] flex items-center gap-2 overflow-x-auto">
              {activeQuiz.questions.map((q, idx) => {
                const answered = answers[q.id] !== undefined
                const current = idx === currentIdx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition shrink-0 cursor-pointer ${
                      current
                        ? 'bg-brand-600 text-white'
                        : answered
                          ? 'bg-success/15 text-success shadow-sunken'
                          : 'text-fg-muted shadow-sunken'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>Question {currentIdx + 1} of {activeQuiz.questions.length}</span>
                <span>{activeQuiz.questions[currentIdx].points} pts</span>
              </div>

              <h4 className="text-base font-semibold text-fg leading-relaxed">
                {activeQuiz.questions[currentIdx].question}
              </h4>

              <div className="space-y-3">
                {activeQuiz.questions[currentIdx].options.map((opt, oi) => {
                  const qId = activeQuiz.questions[currentIdx].id
                  const optLetter = String.fromCharCode(65 + oi)
                  const selected = answers[qId] === opt
                  return (
                    <div
                      key={oi}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qId]: opt }))}
                      className={`p-4 rounded-2xl transition cursor-pointer flex items-center gap-3.5 ${
                        selected
                          ? 'bg-brand-500/15 ring-1 ring-brand-500'
                          : 'shadow-sunken hover:shadow-emboss'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          selected ? 'bg-brand-600 text-white' : 'text-fg-muted shadow-sunken'
                        }`}
                      >
                        {selected ? <Check className="w-4 h-4" /> : optLetter}
                      </div>
                      <span className="text-sm text-fg">{opt}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium text-fg shadow-sunken disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="text-xs text-fg-muted">
                {Object.keys(answers).length} / {activeQuiz.questions.length} answered
              </div>

              {currentIdx < activeQuiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((p) => Math.min(activeQuiz.questions.length - 1, p + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={submitActive}
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-success hover:opacity-90 text-white shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in duration-150">
          <div className="glass-strong rounded-3xl max-w-md w-full p-6 space-y-5 text-center animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-brand-500/15 text-brand-600 dark:text-brand-300 shadow-sunken">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-fg">Quiz Complete</h2>
              <p className="text-sm text-fg-muted mt-1">{result.quiz.title}</p>
            </div>
            <div className="text-3xl font-extrabold text-fg">
              {result.submission.score} / {result.submission.maxScore}
            </div>
            <button
              onClick={() => setResult(null)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Review quiz (teacher) */}
      {reviewQuiz && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setReviewQuiz(null) }}
        >
          <div className="glass-strong rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-start justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  {reviewQuiz.className || '—'} • {reviewQuiz.subjectName}
                </span>
                <h3 className="text-lg font-bold text-fg mt-1">{reviewQuiz.title}</h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  {reviewQuiz.durationMinutes} min • {reviewQuiz.totalPoints} pts
                </p>
              </div>
              <button
                onClick={() => setReviewQuiz(null)}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {reviewQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl shadow-sunken space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-fg-muted">
                    <span className="font-semibold">Question {idx + 1}</span>
                    <span>{q.points} pts</span>
                  </div>
                  <p className="text-sm font-medium text-fg">{q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`p-2.5 rounded-xl ${
                          oi === q.correctAnswer
                            ? 'bg-success/15 font-semibold text-success'
                            : 'text-fg shadow-emboss'
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create quiz */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsCreateOpen(false) }}
        >
          <form
            onSubmit={handleCreate}
            className="glass-strong rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 duration-150"
            role="dialog" aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <h2 className="text-lg font-bold text-fg">Create Multiple-Choice Quiz</h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-fg-muted mb-1">Quiz Title *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Class</label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="">Select</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Time Limit (min)</label>
                <input
                  type="number" min={1} max={180}
                  value={form.timeLimitMin}
                  onChange={(e) => setForm({ ...form, timeLimitMin: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-fg self-end pb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAutoGrade}
                  onChange={(e) => setForm({ ...form, isAutoGrade: e.target.checked })}
                />
                Auto-grade on submit
              </label>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-fg">Questions ({form.questions.length})</h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="text-xs px-3 py-1.5 rounded-xl font-medium text-fg shadow-sunken hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {form.questions.map((q, qi) => (
                <div key={q.id} className="p-4 rounded-2xl shadow-sunken space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-fg-muted">#{qi + 1}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min={1} max={100}
                        value={q.points}
                        onChange={(e) => handleUpdateQuestion(qi, { points: Number(e.target.value) })}
                        className="w-16 px-2 py-1 text-xs rounded-lg text-fg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="text-xs text-fg-muted">pts</span>
                      {form.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qi)}
                          className="p-1 rounded text-fg-muted hover:text-error cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Question prompt"
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qi, { question: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === oi}
                          onChange={() => handleUpdateQuestion(qi, { correctAnswer: oi })}
                          className="accent-brand-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-fg-muted w-4">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qi, oi, e.target.value)}
                          className="flex-1 px-3 py-1 text-xs rounded-lg text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
                Publish Quiz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}