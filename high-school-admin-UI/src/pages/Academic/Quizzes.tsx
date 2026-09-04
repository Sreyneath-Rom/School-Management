import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  HelpCircle,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  ChevronRight,
  ChevronLeft,
  Award,
  Timer,
  Check,
  RotateCcw,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Quiz, QuizQuestion, QuizSubmission } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'

export default function QuizzesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const currentStudentId = user?.id || '3'
  const currentStudentName = user?.name || 'Emily Watson'

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>(isStudent ? 'Grade 10-A' : 'all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeReviewQuiz, setActiveReviewQuiz] = useState<Quiz | null>(null)

  // Student Active Quiz Taking State
  const [activeTakingQuiz, setActiveTakingQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [studentAnswers, setStudentAnswers] = useState<Record<string, number>>({})
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(1200) // 20 mins default
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Quiz Result Modal State
  const [quizResult, setQuizResult] = useState<{
    submission: QuizSubmission
    detailedResults: { questionId: string; correct: boolean; correctAnswer: number; explanation?: string }[]
    quizTitle: string
  } | null>(null)

  // Teacher Create Quiz State
  const [createQuizForm, setCreateQuizForm] = useState({
    title: '',
    description: '',
    className: 'Grade 10-A',
    subjectName: 'Mathematics',
    durationMinutes: 20,
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: 'Published' as 'Draft' | 'Published',
    questions: [
      {
        id: 'q1',
        question: 'What does a negative discriminant (b² - 4ac < 0) indicate about a quadratic equation?',
        options: [
          'Two distinct real roots',
          'Exactly one real repeated root',
          'Two complex/imaginary roots and no real x-intercepts',
          'The parabola is a straight line',
        ],
        correctAnswer: 2,
        points: 5,
        explanation: 'When b² - 4ac < 0, roots involve imaginary numbers.',
      },
      {
        id: 'q2',
        question: 'What are the roots of x² - 7x + 12 = 0?',
        options: ['x = -3 and x = -4', 'x = 3 and x = 4', 'x = 2 and x = 6', 'x = -2 and x = -6'],
        correctAnswer: 1,
        points: 5,
        explanation: '(x - 3)(x - 4) = 0.',
      },
    ] as QuizQuestion[],
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [qList, subList] = await Promise.all([
        academicService.getQuizzes(),
        academicService.getQuizSubmissions(),
      ])
      setQuizzes(qList)
      setSubmissions(subList)
    } catch {
      showToast('Failed to load quizzes', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Timer countdown hook for active quiz
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!)
            handleAutoSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeRemainingSeconds])

  const getStudentSubmission = (quizId: string): QuizSubmission | undefined => {
    return submissions.find((s) => s.quizId === quizId && s.studentId === currentStudentId)
  }

  const filteredQuizzes = quizzes.filter((q) => {
    if (isStudent && q.className !== 'Grade 10-A') return false
    if (selectedClass !== 'all' && q.className !== selectedClass) return false
    if (selectedSubject !== 'all' && q.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) return false
    if (search.trim()) {
      const term = search.toLowerCase()
      if (!q.title.toLowerCase().includes(term) && !q.subjectName.toLowerCase().includes(term)) return false
    }
    return true
  })

  // Start taking a quiz (Securely: strips answers!)
  const handleStartQuiz = async (quizId: string) => {
    try {
      const securedQuiz = await academicService.getQuizForStudent(quizId)
      if (!securedQuiz) {
        showToast('Quiz not found', 'error')
        return
      }
      setActiveTakingQuiz(securedQuiz)
      setCurrentQuestionIdx(0)
      setStudentAnswers({})
      setTimeRemainingSeconds(securedQuiz.durationMinutes * 60)
      setIsTimerRunning(true)
    } catch {
      showToast('Unable to start quiz session', 'error')
    }
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleAutoSubmitQuiz = () => {
    showToast('Time expired! Submitting your answers automatically.', 'info')
    handleSubmitQuiz()
  }

  const handleSubmitQuiz = async () => {
    if (!activeTakingQuiz) return

    setIsTimerRunning(false)
    try {
      const res = await academicService.submitQuiz({
        quizId: activeTakingQuiz.id,
        studentId: currentStudentId,
        studentName: currentStudentName,
        studentCode: 'STU123456',
        answers: studentAnswers,
      })

      setQuizResult({
        submission: res.submission,
        detailedResults: res.detailedResults,
        quizTitle: activeTakingQuiz.title,
      })

      showToast(`Quiz completed! You scored ${res.submission.score}/${res.submission.totalPoints}`, 'success')
      setActiveTakingQuiz(null)
      loadData()
    } catch {
      showToast('Error submitting quiz', 'error')
    }
  }

  // Teacher Question Builder Helpers
  const handleAddQuestionToForm = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'New question prompt...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      points: 5,
      explanation: 'Explanation of why this answer is correct.',
    }
    setCreateQuizForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }))
  }

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setCreateQuizForm((prev) => {
      const nextQs = [...prev.questions]
      nextQs[index] = { ...nextQs[index], [field]: value }
      return { ...prev, questions: nextQs }
    })
  }

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setCreateQuizForm((prev) => {
      const nextQs = [...prev.questions]
      const nextOpts = [...nextQs[qIndex].options]
      nextOpts[optIndex] = text
      nextQs[qIndex] = { ...nextQs[qIndex], options: nextOpts }
      return { ...prev, questions: nextQs }
    })
  }

  const handleRemoveQuestion = (index: number) => {
    setCreateQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createQuizForm.title.trim()) {
      showToast('Quiz title is required', 'error')
      return
    }
    if (createQuizForm.questions.length === 0) {
      showToast('At least one question is required', 'error')
      return
    }

    const totalPoints = createQuizForm.questions.reduce((sum, q) => sum + (Number(q.points) || 5), 0)

    try {
      await academicService.createQuiz({
        title: createQuizForm.title,
        description: createQuizForm.description,
        classId: createQuizForm.className === 'Grade 10-A' ? 'cls-1' : 'cls-2',
        className: createQuizForm.className,
        subjectId: `sub-${createQuizForm.subjectName.toLowerCase().slice(0, 3)}`,
        subjectName: createQuizForm.subjectName,
        teacherId: user?.id || '2',
        teacherName: user?.name || 'Faculty Instructor',
        durationMinutes: Number(createQuizForm.durationMinutes) || 20,
        totalPoints,
        dueDate: createQuizForm.dueDate,
        status: createQuizForm.status,
        questions: createQuizForm.questions,
      })
      showToast('Quiz created and published successfully', 'success')
      setIsCreateModalOpen(false)
      loadData()
    } catch {
      showToast('Error creating quiz', 'error')
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div id="quizzes-page-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Quizzes & Tests' : 'Quizzes & Assessments'}
          subtitle={
            isStudent
              ? 'Complete timed assessments, track your scores, and review answer explanations.'
              : 'Create multiple-choice quizzes, set time limits, and review student performance analytics.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            id="create-quiz-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-quizzes-input"
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {!isStudent && (
            <select
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
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading quizzes...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">No quizzes available</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Create Quiz" to author a new test for your students.'
              : 'There are currently no active quizzes scheduled for your class.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredQuizzes.map((q) => {
            const studentSub = isStudent ? getStudentSubmission(q.id) : undefined

            return (
              <div
                key={q.id}
                id={`quiz-card-${q.id}`}
                className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/60">
                      <BookOpen className="w-3 h-3" />
                      {q.subjectName}
                    </span>

                    {isStudent ? (
                      studentSub ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed: {studentSub.score}/{studentSub.totalPoints} ({studentSub.percentage}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <AlertCircle className="w-3 h-3" />
                          Ready to Take
                        </span>
                      )
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {q.status}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base line-clamp-1">
                    {q.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {q.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {q.durationMinutes} Minutes Limit
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {q.questions.length} Questions • {q.totalPoints} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {q.className}
                      </span>

                      {!isStudent && (
                        <span className="text-brand-600 font-medium">
                          {q.attemptsCount || 0} student attempts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Due {q.dueDate}
                  </span>

                  {isStudent ? (
                    studentSub ? (
                      <button
                        onClick={() => handleStartQuiz(q.id)}
                        className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Retake Test
                      </button>
                    ) : (
                      <button
                        id={`take-quiz-btn-${q.id}`}
                        onClick={() => handleStartQuiz(q.id)}
                        className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <Timer className="w-3.5 h-3.5" />
                        Start Quiz
                      </button>
                    )
                  ) : (
                    <button
                      id={`review-quiz-btn-${q.id}`}
                      onClick={() => setActiveReviewQuiz(q)}
                      className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1"
                    >
                      View Questions <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Interactive Quiz Taking Modal (Full Screen Experience) */}
      {activeTakingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div
            id="quiz-taking-container"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header with Title & Live Timer */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {activeTakingQuiz.subjectName}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-1">
                  {activeTakingQuiz.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                    timeRemainingSeconds < 180
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 border border-rose-200 animate-pulse'
                      : 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 border border-brand-200/60'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  {formatTimer(timeRemainingSeconds)}
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to exit the quiz? Unsaved answers will be lost.')) {
                      setIsTimerRunning(false)
                      setActiveTakingQuiz(null)
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Question Quick-Jump Tracker */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              {activeTakingQuiz.questions.map((q, idx) => {
                const isAnswered = studentAnswers[q.id] !== undefined
                const isCurrent = idx === currentQuestionIdx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition shrink-0 ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Current Question View */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {activeTakingQuiz.questions[currentQuestionIdx] && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>
                      Question {currentQuestionIdx + 1} of {activeTakingQuiz.questions.length}
                    </span>
                    <span>{activeTakingQuiz.questions[currentQuestionIdx].points} Points</span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-6">
                    {activeTakingQuiz.questions[currentQuestionIdx].question}
                  </h4>

                  <div className="space-y-3">
                    {activeTakingQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                      const qId = activeTakingQuiz.questions[currentQuestionIdx].id
                      const isSelected = studentAnswers[qId] === optIdx
                      const choiceLetter = String.fromCharCode(65 + optIdx)

                      return (
                        <div
                          key={optIdx}
                          id={`quiz-option-${currentQuestionIdx}-${optIdx}`}
                          onClick={() => handleSelectOption(qId, optIdx)}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                            isSelected
                              ? 'bg-brand-50/80 dark:bg-brand-950/30 border-brand-500 shadow-sm'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                              isSelected
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4" /> : choiceLetter}
                          </div>
                          <span
                            className={`text-sm ${
                              isSelected
                                ? 'font-medium text-brand-900 dark:text-brand-100'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="text-xs text-slate-500">
                {Object.keys(studentAnswers).length} of {activeTakingQuiz.questions.length} answered
              </div>

              {currentQuestionIdx < activeTakingQuiz.questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestionIdx((prev) =>
                      Math.min(activeTakingQuiz.questions.length - 1, prev + 1)
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 transition inline-flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="submit-quiz-answers-btn"
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition inline-flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Result Modal */}
      {quizResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
          <div
            id="quiz-result-modal"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
          >
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div
                className={`w-16 h-16 rounded-3xl mx-auto mb-3 flex items-center justify-center ${
                  quizResult.submission.passed
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {quizResult.submission.passed ? 'Quiz Passed!' : 'Quiz Needs Review'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{quizResult.quizTitle}</p>
              <div className="mt-3 inline-flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {quizResult.submission.score} / {quizResult.submission.totalPoints}
                </span>
                <span className="text-base font-semibold text-brand-600">
                  ({quizResult.submission.percentage}%)
                </span>
              </div>
            </div>

            {/* Question Breakdown with explanations */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Performance Review & Explanations
              </h4>

              {quizResult.detailedResults.map((dr, idx) => (
                <div
                  key={dr.questionId}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        dr.correct
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {dr.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Correct choice: Option {String.fromCharCode(65 + dr.correctAnswer)}
                  </p>

                  {dr.explanation && (
                    <div className="mt-1 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 italic">
                      Note: {dr.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setQuizResult(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher View Quiz Details & Questions */}
      {activeReviewQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            id="view-quiz-details-modal"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {activeReviewQuiz.className} • {activeReviewQuiz.subjectName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {activeReviewQuiz.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeReviewQuiz.durationMinutes} mins • {activeReviewQuiz.totalPoints} total points • {activeReviewQuiz.questions.length} questions
                </p>
              </div>
              <button
                onClick={() => setActiveReviewQuiz(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {activeReviewQuiz.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">Question {idx + 1}</span>
                    <span>{q.points} pts</span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border ${
                          optIdx === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 font-semibold text-emerald-800 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctAnswer && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-slate-400 italic pt-1">
                      Explanation: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveReviewQuiz(null)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Create Quiz Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            id="create-quiz-form"
            onSubmit={handleSaveQuiz}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Create Multiple-Choice Quiz
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Test: Polynomials & Factoring"
                  value={createQuizForm.title}
                  onChange={(e) => setCreateQuizForm({ ...createQuizForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class
                </label>
                <select
                  value={createQuizForm.className}
                  onChange={(e) => setCreateQuizForm({ ...createQuizForm, className: e.target.value })}
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
                  value={createQuizForm.subjectName}
                  onChange={(e) => setCreateQuizForm({ ...createQuizForm, subjectName: e.target.value })}
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
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={createQuizForm.durationMinutes}
                  onChange={(e) =>
                    setCreateQuizForm({ ...createQuizForm, durationMinutes: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={createQuizForm.dueDate}
                  onChange={(e) => setCreateQuizForm({ ...createQuizForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Dynamic Question Builder */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Questions ({createQuizForm.questions.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestionToForm}
                  className="text-xs px-3 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                {createQuizForm.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Question #{qIdx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          title="Question Points"
                          min={1}
                          max={50}
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'points', Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-semibold"
                        />
                        <span className="text-xs text-slate-400">pts</span>

                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Type the question prompt..."
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />

                    {/* Choices */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Choices (Check the circle for correct answer)
                      </label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctAnswer', optIdx)}
                            className="text-brand-600"
                          />
                          <span className="text-xs font-bold text-slate-500 w-4">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className="flex-1 px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Optional explanation shown to student after grading..."
                      value={q.explanation || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      className="w-full px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 italic"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
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
