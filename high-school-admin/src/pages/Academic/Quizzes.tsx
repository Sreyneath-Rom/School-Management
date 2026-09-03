import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/context/AuthContext'
import {
  quizService,
  type Quiz,
  type QuizQuestion,
  type StudentSafeQuiz,
  type QuizSubmission,
  type QuizStatus,
} from '@/services/quizService'
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Sparkles,
  Play,
  RotateCcw,
  Eye,
  Trash2,
  Users,
  Timer,
  GraduationCap,
  ShieldCheck,
  Check,
  X,
  FileCheck2,
  Layers,
  ArrowRight,
} from 'lucide-react'

export default function Quizzes() {
  const { user, role: currentRole } = useAuth()
  const { showToast } = useToast()

  // Support toggling view perspective for ease of testing both Teacher and Student use cases
  const [activeRolePerspective, setActiveRolePerspective] = useState<'teacher' | 'student'>(() => {
    return currentRole === 'student' ? 'student' : 'teacher'
  })

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('All Classes')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false)
  const [selectedQuizForSubmissions, setSelectedQuizForSubmissions] = useState<Quiz | null>(null)
  const [submissionsList, setSubmissionsList] = useState<QuizSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  // Student taking quiz state (UC-QUIZ-03)
  const [activeQuizToTake, setActiveQuizToTake] = useState<StudentSafeQuiz | null>(null)
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false)

  // Quiz completed review modal
  const [completedResult, setCompletedResult] = useState<{
    submission: QuizSubmission
    review: {
      questionId: string
      questionText: string
      userAnswer: string
      correctAnswer: string
      isCorrect: boolean
      pointsEarned: number
      maxPoints: number
      explanation?: string
    }[]
  } | null>(null)

  // Student's existing submissions cache
  const [mySubmissions, setMySubmissions] = useState<Record<string, QuizSubmission>>({})

  // Fetch quizzes
  const loadQuizzes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await quizService.getQuizzes()
      setQuizzes(data)

      // Load user submissions if in student perspective
      const studentId = user?.id || 'stu-101'
      const subsMap: Record<string, QuizSubmission> = {}
      for (const q of data) {
        const sub = await quizService.getStudentSubmission(q.id, studentId)
        if (sub) {
          subsMap[q.id] = sub
        }
      }
      setMySubmissions(subsMap)
    } catch (e) {
      console.error(e)
      showToast('Failed to load quizzes', 'error')
    } finally {
      setLoading(false)
    }
  }, [user?.id, showToast])

  useEffect(() => {
    loadQuizzes()
  }, [loadQuizzes])

  // Timer for active quiz (UC-QUIZ-03)
  useEffect(() => {
    if (!activeQuizToTake || timeRemainingSeconds <= 0) return

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleFinalSubmit(activeQuizToTake.id, studentAnswers, activeQuizToTake.durationMinutes * 60)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeQuizToTake, timeRemainingSeconds, studentAnswers])

  // Class & Subject options
  const classOptions = useMemo(() => {
    const set = new Set(quizzes.map((q) => q.class))
    return ['All Classes', ...Array.from(set)]
  }, [quizzes])

  const subjectOptions = useMemo(() => {
    const set = new Set(quizzes.map((q) => q.subject))
    return ['All Subjects', ...Array.from(set)]
  }, [quizzes])

  // Filtered quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      // If student view, only show published quizzes
      if (activeRolePerspective === 'student' && q.status !== 'Published') {
        return false
      }

      if (selectedClass !== 'All Classes' && q.class !== selectedClass) return false
      if (selectedSubject !== 'All Subjects' && q.subject !== selectedSubject) return false
      if (selectedStatus !== 'All' && q.status !== selectedStatus) return false

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesTitle = q.title.toLowerCase().includes(term)
        const matchesDesc = q.description.toLowerCase().includes(term)
        const matchesSubject = q.subject.toLowerCase().includes(term)
        if (!matchesTitle && !matchesDesc && !matchesSubject) return false
      }

      return true
    })
  }, [quizzes, activeRolePerspective, selectedClass, selectedSubject, selectedStatus, searchTerm])

  // Teacher action: Publish quiz (UC-QUIZ-02)
  const handlePublishQuiz = async (quizId: string) => {
    try {
      await quizService.publishQuiz(quizId)
      showToast('Quiz published successfully! Students can now access it.', 'success')
      loadQuizzes()
    } catch (e) {
      console.error(e)
      showToast('Failed to publish quiz', 'error')
    }
  }

  // Teacher action: Delete quiz
  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return
    try {
      await quizService.deleteQuiz(quizId)
      showToast('Quiz deleted', 'info')
      loadQuizzes()
    } catch (e) {
      console.error(e)
      showToast('Failed to delete quiz', 'error')
    }
  }

  // Teacher action: View submissions
  const handleOpenSubmissions = async (quiz: Quiz) => {
    setSelectedQuizForSubmissions(quiz)
    setIsSubmissionsModalOpen(true)
    setLoadingSubmissions(true)
    try {
      const subs = await quizService.getQuizSubmissions(quiz.id)
      setSubmissionsList(subs)
    } catch (e) {
      console.error(e)
      showToast('Failed to fetch submissions', 'error')
    } finally {
      setLoadingSubmissions(false)
    }
  }

  // Student action: Start Quiz (UC-QUIZ-03 & BR-06)
  const handleStartQuiz = async (quizId: string) => {
    try {
      // BR-06: getStudentSafeQuiz strips correct answers from the payload
      const safeQuiz = await quizService.getStudentSafeQuiz(quizId)
      setActiveQuizToTake(safeQuiz)
      setStudentAnswers({})
      setCurrentQuestionIndex(0)
      setTimeRemainingSeconds(safeQuiz.durationMinutes * 60)
    } catch (e) {
      console.error(e)
      showToast('Failed to start quiz', 'error')
    }
  }

  // Student answer selection
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  // Final submit handler (UC-QUIZ-03)
  const handleFinalSubmit = async (
    quizId: string,
    answersToSubmit: Record<string, string>,
    timeSpent: number
  ) => {
    if (isSubmittingQuiz) return
    setIsSubmittingQuiz(true)
    try {
      const studentId = user?.id || 'stu-101'
      const studentName = user ? `${user.firstName} ${user.lastName}` : 'Alex Cooper'
      const studentClass = activeQuizToTake?.class || 'Grade 10 - A'

      const result = await quizService.submitQuiz(
        quizId,
        studentId,
        studentName,
        studentClass,
        answersToSubmit,
        timeSpent
      )

      setActiveQuizToTake(null)
      setCompletedResult(result)
      showToast(`Quiz completed! You scored ${result.submission.percentage}%`, 'success')
      loadQuizzes()
    } catch (e) {
      console.error(e)
      showToast('Failed to submit quiz', 'error')
    } finally {
      setIsSubmittingQuiz(false)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const total = quizzes.length
    const published = quizzes.filter((q) => q.status === 'Published').length
    const drafts = quizzes.filter((q) => q.status === 'Draft').length
    const totalSubs = quizzes.reduce((acc, q) => acc + (q.submissionsCount || 0), 0)
    return { total, published, drafts, totalSubs }
  }, [quizzes])

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Role Perspective Switcher */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <PageHeading
            title="Quizzes & Test Assessments"
            subtitle="Author interactive tests, schedule exam windows, and conduct secure student evaluations (BR-06 compliant)."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Perspective Switcher */}
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
              Create Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Total Quizzes</span>
            <Layers className="h-4 w-4 text-brand-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text-main">{stats.total}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Curriculum tests created</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Published & Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.published}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Ready for student attempts</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Total Submissions</span>
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text-main">{stats.totalSubs}</p>
          <p className="mt-0.5 text-xs text-text-main/50">Evaluated student responses</p>
        </div>

        <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
            <span>Quiz Security</span>
            <ShieldCheck className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm font-semibold text-text-main">BR-06 Enforced</p>
          </div>
          <p className="mt-0.5 text-xs text-text-main/50">Answers securely masked</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-3xl glass-sm p-4 border border-white/20 dark:border-white/10 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-main/40" />
          <input
            type="text"
            placeholder="Search by quiz title, topic, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl bg-white/60 dark:bg-black/20 pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-main/40 border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
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

          {/* Subject Filter */}
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

          {/* Status Filter (Teacher view only) */}
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
              <option value="Closed" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">
                Closed
              </option>
            </select>
          )}
        </div>
      </div>

      {/* Quizzes List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600"></div>
          <p className="mt-3 text-sm text-text-main/60">Loading academic quizzes...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="rounded-3xl glass-sm p-12 text-center border border-white/20 dark:border-white/10">
          <BookOpen className="mx-auto h-12 w-12 text-text-main/30" />
          <h3 className="mt-3 text-base font-semibold text-text-main">No quizzes found</h3>
          <p className="mt-1 text-sm text-text-main/55">
            {activeRolePerspective === 'teacher'
              ? 'Click "Create Quiz" above to author a new test for your class.'
              : 'There are no active quizzes assigned to your selected filters right now.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => {
            const studentSubmission = mySubmissions[quiz.id]
            const isCompleted = Boolean(studentSubmission)
            const totalQuestions = quiz.questions?.length || 0
            const totalPoints = quiz.questions?.reduce((a, b) => a + b.points, 0) || 0

            return (
              <div
                key={quiz.id}
                className="group relative flex flex-col justify-between rounded-3xl glass-sm p-6 border border-white/20 dark:border-white/10 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                      {quiz.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {quiz.status === 'Published' ? (
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

                  {/* Title & Description */}
                  <h3 className="mt-3.5 text-base font-bold text-text-main group-hover:text-brand-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-main/60">
                    {quiz.description}
                  </p>

                  {/* Details grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-text-main/5 p-3 text-xs text-text-main/70">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{quiz.class}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{quiz.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-text-main/50" />
                      <span>{totalPoints} Total Pts</span>
                    </div>
                  </div>

                  {/* Teacher stats */}
                  {activeRolePerspective === 'teacher' && (
                    <div className="mt-3 flex items-center justify-between text-xs text-text-main/60">
                      <span>Submissions: <strong className="text-text-main">{quiz.submissionsCount || 0}</strong></span>
                      {quiz.averageScore !== undefined && (
                        <span>Avg: <strong className="text-emerald-600">{quiz.averageScore}%</strong></span>
                      )}
                    </div>
                  )}

                  {/* Student completion info */}
                  {activeRolePerspective === 'student' && isCompleted && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold">Score: {studentSubmission.percentage}%</span>
                      </div>
                      <span className="text-[11px] font-medium opacity-80">
                        {studentSubmission.passed ? 'Passed' : 'Needs Review'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 border-t border-text-main/10 pt-4">
                  {activeRolePerspective === 'teacher' ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {quiz.status === 'Draft' ? (
                          <button
                            onClick={() => handlePublishQuiz(quiz.id)}
                            className="rounded-xl bg-emerald-600/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/25 transition"
                            title="Publish Quiz (UC-QUIZ-02)"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenSubmissions(quiz)}
                            className="flex items-center gap-1 rounded-xl bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-500/25 transition"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Submissions ({quiz.submissionsCount || 0})
                          </button>
                        )}

                        <button
                          onClick={() => handleStartQuiz(quiz.id)}
                          className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-main/70 hover:bg-text-main/10 transition"
                          title="Preview taking quiz as a student"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="rounded-xl p-1.5 text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete Quiz"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    /* Student Perspective */
                    <div>
                      {isCompleted ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-main/50">Already submitted</span>
                          <Button
                            variant="solidOutline"
                            size="sm"
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Retake
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => handleStartQuiz(quiz.id)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs py-2 shadow-sm"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Start Quiz (UC-QUIZ-03)
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
          MODAL 1: CREATE QUIZ MODAL (UC-QUIZ-01 & UC-QUIZ-02)
         ========================================================================= */}
      {isCreateModalOpen && (
        <CreateQuizModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => {
            setIsCreateModalOpen(false)
            loadQuizzes()
            showToast('New quiz authored successfully!', 'success')
          }}
        />
      )}

      {/* =========================================================================
          MODAL 2: TEACHER SUBMISSIONS OVERVIEW MODAL
         ========================================================================= */}
      {isSubmissionsModalOpen && selectedQuizForSubmissions && (
        <QuizSubmissionsModal
          isOpen={isSubmissionsModalOpen}
          quiz={selectedQuizForSubmissions}
          submissions={submissionsList}
          loading={loadingSubmissions}
          onClose={() => {
            setIsSubmissionsModalOpen(false)
            setSelectedQuizForSubmissions(null)
          }}
        />
      )}

      {/* =========================================================================
          MODAL 3: ACTIVE QUIZ TAKER (UC-QUIZ-03 with BR-06 Security)
         ========================================================================= */}
      {activeQuizToTake && (
        <ActiveQuizTakerModal
          quiz={activeQuizToTake}
          answers={studentAnswers}
          onSelectAnswer={handleSelectAnswer}
          currentIndex={currentQuestionIndex}
          setCurrentIndex={setCurrentQuestionIndex}
          timeRemaining={timeRemainingSeconds}
          onSubmit={() => {
            const timeSpent = activeQuizToTake.durationMinutes * 60 - timeRemainingSeconds
            handleFinalSubmit(activeQuizToTake.id, studentAnswers, Math.max(1, timeSpent))
          }}
          onCancel={() => {
            if (window.confirm('Leave quiz? Any unsubmitted responses will not be saved.')) {
              setActiveQuizToTake(null)
            }
          }}
          isSubmitting={isSubmittingQuiz}
        />
      )}

      {/* =========================================================================
          MODAL 4: QUIZ EVALUATION RESULT & BREAKDOWN MODAL
         ========================================================================= */}
      {completedResult && (
        <QuizResultModal
          result={completedResult}
          onClose={() => setCompletedResult(null)}
        />
      )}
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: CREATE QUIZ MODAL (UC-QUIZ-01)
   ========================================================================= */
interface CreateQuizModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

function CreateQuizModal({ isOpen, onClose, onCreated }: CreateQuizModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [targetClass, setTargetClass] = useState('Grade 10 - A')
  const [durationMinutes, setDurationMinutes] = useState(20)
  const [passingPercentage, setPassingPercentage] = useState(70)
  const [status, setStatus] = useState<QuizStatus>('Published')
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  })

  // Dynamic question builder
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      text: 'What is the primary formula or theorem used to solve this problem?',
      type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'Explanation of why Option A is the correct answer.',
      points: 5,
    },
  ])

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        text: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 5,
      },
    ])
  }

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateQuestionText = (idx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], text }
      return copy
    })
  }

  const updateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      const currentOpts = copy[qIdx].options ? [...copy[qIdx].options!] : []
      currentOpts[optIdx] = val
      copy[qIdx] = {
        ...copy[qIdx],
        options: currentOpts,
        correctAnswer: copy[qIdx].correctAnswer === copy[qIdx].options?.[optIdx] ? val : copy[qIdx].correctAnswer,
      }
      return copy
    })
  }

  const setCorrectAnswer = (qIdx: number, answerVal: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      copy[qIdx] = { ...copy[qIdx], correctAnswer: answerVal }
      return copy
    })
  }

  const updateExplanation = (qIdx: number, explanation: string) => {
    setQuestions((prev) => {
      const copy = [...prev]
      copy[qIdx] = { ...copy[qIdx], explanation }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.text.trim()) {
        alert(`Please enter question text for Question #${i + 1}`)
        return
      }
      if (!q.correctAnswer.trim()) {
        alert(`Please designate a correct answer for Question #${i + 1}`)
        return
      }
    }

    try {
      await quizService.createQuiz({
        title,
        description,
        subject,
        class: targetClass,
        teacherId: user?.id || 'tch-1',
        teacherName: user ? `${user.firstName} ${user.lastName}` : 'Faculty Member',
        durationMinutes,
        passingPercentage,
        status,
        dueDate: new Date(dueDate).toISOString(),
        questions,
      })
      onCreated()
    } catch (err) {
      console.error(err)
      alert('Failed to save quiz')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl glass-strong border border-white/30 dark:border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-2.5 text-brand-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Create New Quiz (UC-QUIZ-01)</h2>
              <p className="text-xs text-text-main/60">
                Author assessment parameters, add multiple-choice questions, and configure answers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-main mb-1.5">Quiz Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unit 3 Test: Linear Algebra & Matrix Transformations"
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-main mb-1.5">Instructions / Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Guidelines, reference materials allowed, or topics assessed..."
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="World History">World History</option>
                <option value="English Literature">English Literature</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Assigned Class</label>
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
              <label className="block text-xs font-semibold text-text-main mb-1.5">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Passing Threshold (%)</label>
              <input
                type="number"
                min={10}
                max={100}
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Submission Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuizStatus)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/30 px-4 py-2 text-sm text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Published">Published (Students can see & take)</option>
                <option value="Draft">Draft (Faculty only)</option>
              </select>
            </div>
          </div>

          {/* Question Builder */}
          <div className="border-t border-text-main/10 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-text-main">Questions ({questions.length})</h4>
                <p className="text-xs text-text-main/55">Add question prompts, choices, and designate the correct answer key.</p>
              </div>
              <Button type="button" variant="solidOutline" size="sm" onClick={addQuestion} className="flex items-center gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="rounded-2xl bg-text-main/5 p-4 border border-text-main/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                      Question #{qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Enter question statement or prompt..."
                      value={q.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      className="w-full rounded-xl bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-medium text-text-main/60">
                      Options (Click the radio to mark the correct answer):
                    </label>
                    {q.options?.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === opt && opt.length > 0}
                          onChange={() => setCorrectAnswer(qIndex, opt)}
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          className="flex-1 rounded-xl bg-white/70 dark:bg-black/40 px-3 py-1 text-xs text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Optional explanation shown to student after grading..."
                      value={q.explanation || ''}
                      onChange={(e) => updateExplanation(qIndex, e.target.value)}
                      className="w-full rounded-xl bg-white/70 dark:bg-black/40 px-3 py-1 text-xs text-text-main/80 border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-text-main/10 pt-4">
            <Button type="button" variant="none" size="md" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-text-main/70 hover:bg-text-main/5">
              Cancel
            </Button>
            <Button type="submit" variant="solid" size="md" className="flex items-center gap-2 text-xs font-semibold">
              <Check className="h-4 w-4" />
              Save & Author Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: QUIZ SUBMISSIONS MODAL (Teacher View)
   ========================================================================= */
interface QuizSubmissionsModalProps {
  isOpen: boolean
  quiz: Quiz
  submissions: QuizSubmission[]
  loading: boolean
  onClose: () => void
}

function QuizSubmissionsModal({ isOpen, quiz, submissions, loading, onClose }: QuizSubmissionsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl glass-strong border border-white/30 dark:border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
          <div>
            <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
              {quiz.subject} • {quiz.class}
            </span>
            <h2 className="mt-1 text-lg font-bold text-text-main">{quiz.title}</h2>
            <p className="text-xs text-text-main/60">Submissions received & automated grades</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-text-main/60">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-main/50">
              No students have submitted this quiz yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-text-main/10 text-text-main/60">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Class</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Percentage</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text-main/5">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-text-main/5 transition">
                      <td className="py-3 font-medium text-text-main flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-brand-600/20 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-[11px]">
                          {sub.studentName.charAt(0)}
                        </div>
                        {sub.studentName}
                      </td>
                      <td className="py-3 text-text-main/70">{sub.class}</td>
                      <td className="py-3 font-bold text-text-main">
                        {sub.score} / {sub.totalPoints}
                      </td>
                      <td className="py-3 font-semibold text-text-main">{sub.percentage}%</td>
                      <td className="py-3">
                        {sub.passed ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Passed
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-text-main/50">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

/* =========================================================================
   SUB-COMPONENT: ACTIVE QUIZ TAKER MODAL (UC-QUIZ-03 & BR-06)
   ========================================================================= */
interface ActiveQuizTakerModalProps {
  quiz: StudentSafeQuiz
  answers: Record<string, string>
  onSelectAnswer: (qId: string, ans: string) => void
  currentIndex: number
  setCurrentIndex: (idx: number) => void
  timeRemaining: number
  onSubmit: () => void
  onCancel: () => void
  isSubmitting: boolean
}

function ActiveQuizTakerModal({
  quiz,
  answers,
  onSelectAnswer,
  currentIndex,
  setCurrentIndex,
  timeRemaining,
  onSubmit,
  onCancel,
  isSubmitting,
}: ActiveQuizTakerModalProps) {
  const currentQuestion = quiz.questions[currentIndex]
  const totalQuestions = quiz.questions.length
  const answeredCount = Object.keys(answers).length

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const isLowTime = timeRemaining <= 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl glass-strong border border-white/30 dark:border-white/15 p-6 md:p-8 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header with Title & Security Badge */}
        <div>
          <div className="flex items-center justify-between border-b border-text-main/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {quiz.subject}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  BR-06 Secure Assessment
                </span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-text-main">{quiz.title}</h2>
            </div>

            {/* Live Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 font-mono text-sm font-bold shadow-sm transition-colors ${
                isLowTime
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-text-main/10 text-text-main'
              }`}
            >
              <Timer className="h-4 w-4" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-text-main/60 mb-1.5 font-medium">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>{answeredCount} of {totalQuestions} answered</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-text-main/10">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Display */}
          {currentQuestion && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-text-main/5 p-4 border border-text-main/10">
                <div className="flex items-center justify-between text-xs text-text-main/50 mb-1">
                  <span>Question #{currentIndex + 1}</span>
                  <span>{currentQuestion.points} points</span>
                </div>
                <h3 className="text-base font-semibold text-text-main">
                  {currentQuestion.text}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectAnswer(currentQuestion.id, option)}
                      className={`w-full flex items-center gap-3 rounded-2xl p-4 text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 ring-2 ring-brand-500'
                          : 'bg-white/60 dark:bg-black/20 text-text-main border border-text-main/10 hover:bg-text-main/5'
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                          isSelected
                            ? 'border-white bg-white text-brand-700'
                            : 'border-text-main/30 text-text-main/70'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-text-main/10 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-rose-500 hover:underline"
          >
            Quit Quiz
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="none"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="rounded-full px-3 py-1.5 text-xs text-text-main/70 disabled:opacity-30"
            >
              Previous
            </Button>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                type="button"
                variant="teal"
                size="sm"
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="flex items-center gap-1 text-xs px-4"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="solid"
                size="sm"
                disabled={isSubmitting}
                onClick={onSubmit}
                className="flex items-center gap-1 text-xs px-5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              >
                {isSubmitting ? 'Evaluating...' : 'Finish & Submit Quiz'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   SUB-COMPONENT: QUIZ RESULT & REVIEW MODAL (UC-QUIZ-03 Results)
   ========================================================================= */
interface QuizResultModalProps {
  result: {
    submission: QuizSubmission
    review: {
      questionId: string
      questionText: string
      userAnswer: string
      correctAnswer: string
      isCorrect: boolean
      pointsEarned: number
      maxPoints: number
      explanation?: string
    }[]
  }
  onClose: () => void
}

function QuizResultModal({ result, onClose }: QuizResultModalProps) {
  const { submission, review } = result
  const passed = submission.passed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl glass-strong border border-white/30 dark:border-white/15 p-6 md:p-8 shadow-2xl">
        {/* Banner */}
        <div
          className={`rounded-2xl p-6 text-center shadow-lg ${
            passed
              ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
              : 'bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-200'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-black/40 shadow-inner">
            {passed ? (
              <Sparkles className="h-8 w-8 text-emerald-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-500" />
            )}
          </div>
          <h2 className="mt-3 text-2xl font-black">
            {passed ? 'Assessment Passed!' : 'Quiz Completed'}
          </h2>
          <p className="mt-1 text-sm opacity-80">
            {passed
              ? 'Congratulations! You achieved the mastery threshold for this test.'
              : 'Review your missed questions below to reinforce these concepts.'}
          </p>

          <div className="mt-4 flex items-center justify-center gap-6">
            <div>
              <p className="text-3xl font-extrabold">{submission.percentage}%</p>
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Score</p>
            </div>
            <div className="h-8 w-px bg-current opacity-20"></div>
            <div>
              <p className="text-3xl font-extrabold">{submission.score} / {submission.totalPoints}</p>
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Points</p>
            </div>
          </div>
        </div>

        {/* Item-by-item breakdown */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60">
            Item Breakdown & Explanations (BR-06 Post-submission)
          </h4>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {review.map((item, idx) => (
              <div
                key={item.questionId}
                className={`rounded-2xl p-4 border text-xs space-y-2 ${
                  item.isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-rose-500/5 border-rose-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-main">Question #{idx + 1}</span>
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      +{item.pointsEarned} pts
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                      <X className="h-3.5 w-3.5" />
                      0 / {item.maxPoints} pts
                    </span>
                  )}
                </div>

                <p className="font-medium text-text-main">{item.questionText}</p>

                <div className="grid grid-cols-1 gap-1 text-[11px]">
                  <div>
                    <span className="text-text-main/60">Your Answer: </span>
                    <strong className={item.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                      {item.userAnswer || '(No answer provided)'}
                    </strong>
                  </div>
                  {!item.isCorrect && (
                    <div>
                      <span className="text-text-main/60">Correct Answer: </span>
                      <strong className="text-emerald-600">{item.correctAnswer}</strong>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <p className="rounded-xl bg-text-main/5 p-2 text-[11px] text-text-main/70 italic">
                    💡 {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-text-main/10 pt-4">
          <Button variant="solid" size="md" onClick={onClose} className="rounded-full px-6 text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
