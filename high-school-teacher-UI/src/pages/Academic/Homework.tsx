import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  FileCheck2,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  ChevronRight,
  MessageSquare,
  Award,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, HomeworkSubmission } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'
import FileUploadZone from '@/components/common/FileUploadZone'

export default function HomeworkPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const currentStudentId = user?.id || '3'
  const currentStudentName = user?.name || 'Emily Watson'

  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>(isStudent ? 'Grade 10-A' : 'all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeReviewHomework, setActiveReviewHomework] = useState<Homework | null>(null)
  const [activeSubmitHomework, setActiveSubmitHomework] = useState<Homework | null>(null)

  // Student submission form
  const [submissionText, setSubmissionText] = useState('')
  const [submissionAttachment, setSubmissionAttachment] = useState('')

  // Teacher grading state
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] = useState<HomeworkSubmission | null>(null)
  const [gradeInput, setGradeInput] = useState<number>(90)
  const [feedbackInput, setFeedbackInput] = useState<string>('')

  // Teacher Create Homework form
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    className: 'Grade 10-A',
    subjectName: 'Mathematics',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxPoints: 100,
    status: 'Published' as 'Draft' | 'Published',
    materialName: '',
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [hw, subs] = await Promise.all([
        academicService.getHomeworkList(),
        academicService.getSubmissions(),
      ])
      setHomeworkList(hw)
      setSubmissions(subs)
    } catch {
      showToast('Failed to load homework assignments', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Helper for student's submission status for a specific homework
  const getStudentSubmission = (hwId: string): HomeworkSubmission | undefined => {
    return submissions.find((s) => s.homeworkId === hwId && s.studentId === currentStudentId)
  }

  const filteredHomework = homeworkList.filter((hw) => {
    if (isStudent && hw.className !== 'Grade 10-A') return false
    if (selectedClass !== 'all' && hw.className !== selectedClass) return false
    if (selectedSubject !== 'all' && hw.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) return false

    if (isStudent) {
      const sub = getStudentSubmission(hw.id)
      const studentStatus = sub ? sub.status : 'Pending'
      if (statusFilter !== 'all' && studentStatus !== statusFilter) return false
    } else {
      if (statusFilter !== 'all' && hw.status !== statusFilter) return false
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      const matchTitle = hw.title.toLowerCase().includes(q)
      const matchDesc = hw.description.toLowerCase().includes(q)
      const matchSub = hw.subjectName.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchSub) return false
    }
    return true
  })

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.title.trim()) {
      showToast('Title is required', 'error')
      return
    }

    try {
      await academicService.createHomework({
        title: createForm.title,
        description: createForm.description,
        classId: createForm.className === 'Grade 10-A' ? 'cls-1' : 'cls-2',
        className: createForm.className,
        subjectId: `sub-${createForm.subjectName.toLowerCase().slice(0, 3)}`,
        subjectName: createForm.subjectName,
        teacherId: user?.id || '2',
        teacherName: user?.name || 'Faculty Instructor',
        assignedDate: createForm.assignedDate,
        dueDate: createForm.dueDate,
        maxPoints: Number(createForm.maxPoints) || 100,
        status: createForm.status,
        materials: createForm.materialName
          ? [{ id: `mat-${Date.now()}`, name: createForm.materialName, type: 'pdf', url: '#' }]
          : [],
      })
      showToast('Assignment published successfully', 'success')
      setIsCreateModalOpen(false)
      loadData()
    } catch {
      showToast('Failed to create assignment', 'error')
    }
  }

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSubmitHomework) return

    try {
      await academicService.submitHomework({
        homeworkId: activeSubmitHomework.id,
        studentId: currentStudentId,
        studentName: currentStudentName,
        studentCode: 'STU123456',
        content: submissionText || 'Work completed as instructed.',
        attachments: submissionAttachment
          ? [{ name: submissionAttachment, url: '#' }]
          : [{ name: `${currentStudentName.replace(' ', '_')}_Assignment.pdf`, url: '#' }],
      })
      showToast('Assignment submitted successfully!', 'success')
      setActiveSubmitHomework(null)
      setSubmissionText('')
      setSubmissionAttachment('')
      loadData()
    } catch {
      showToast('Error submitting assignment', 'error')
    }
  }

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmissionToGrade) return

    try {
      await academicService.gradeSubmission(
        selectedSubmissionToGrade.id,
        gradeInput,
        feedbackInput
      )
      showToast('Grade and feedback saved successfully', 'success')
      setSelectedSubmissionToGrade(null)
      loadData()
    } catch {
      showToast('Error saving grade', 'error')
    }
  }

  return (
    <div id="homework-page-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Homework & Assignments' : 'Homework & Assignments'}
          subtitle={
            isStudent
              ? 'Track deadlines, review instructor rubrics, and submit your homework online.'
              : 'Create homework assignments, set grading rubrics, and review student submissions.'
          }
        />

        {isTeacherOrAdmin && (
          <button
            id="create-homework-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Assign Homework
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-homework-input"
            type="text"
            placeholder="Search assignments..."
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            {isStudent ? (
              <>
                <option value="Pending">Pending Submission</option>
                <option value="Submitted">Submitted</option>
                <option value="Graded">Graded</option>
              </>
            ) : (
              <>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Homework Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading assignments...</div>
      ) : filteredHomework.length === 0 ? (
        <div className="glass-sm rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">No homework found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {isTeacherOrAdmin
              ? 'Click "Assign Homework" to create a new assignment for your students.'
              : 'You have no homework assignments matching these filters. Great job!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredHomework.map((hw) => {
            const studentSub = isStudent ? getStudentSubmission(hw.id) : undefined
            const isDueSoon = new Date(hw.dueDate).getTime() - Date.now() < 3 * 86400000

            return (
              <div
                key={hw.id}
                id={`hw-card-${hw.id}`}
                className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/60">
                      <BookOpen className="w-3 h-3" />
                      {hw.subjectName}
                    </span>

                    {isStudent ? (
                      studentSub?.status === 'Graded' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Graded: {studentSub.grade}/{hw.maxPoints}
                        </span>
                      ) : studentSub?.status === 'Submitted' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          <Clock className="w-3 h-3" />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {hw.status}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base line-clamp-1">
                    {hw.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {hw.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Due: {hw.dueDate}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Max: {hw.maxPoints} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {hw.className}
                      </span>

                      {!isStudent && (
                        <span className="text-brand-600 font-medium">
                          {hw.submissionsCount || 0}/{hw.totalStudents || 32} submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student feedback display if graded */}
                  {isStudent && studentSub?.status === 'Graded' && studentSub.feedback && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                        <MessageSquare className="w-3 h-3 text-brand-600" /> Teacher Feedback:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 italic">"{studentSub.feedback}"</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {isDueSoon && !studentSub ? (
                      <span className="text-rose-600 font-medium">Deadline soon</span>
                    ) : (
                      `By ${hw.teacherName}`
                    )}
                  </span>

                  {isStudent ? (
                    studentSub?.status === 'Graded' ? (
                      <button
                        onClick={() => {
                          showToast(`Submitted on ${studentSub.submittedAt}`, 'info')
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                      >
                        View Submission
                      </button>
                    ) : studentSub?.status === 'Submitted' ? (
                      <button
                        onClick={() => setActiveSubmitHomework(hw)}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                      >
                        Resubmit Work
                      </button>
                    ) : (
                      <button
                        id={`submit-hw-${hw.id}`}
                        onClick={() => {
                          setActiveSubmitHomework(hw)
                          setSubmissionText('')
                          setSubmissionAttachment('')
                        }}
                        className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Submit Work
                      </button>
                    )
                  ) : (
                    <button
                      id={`review-submissions-${hw.id}`}
                      onClick={() => setActiveReviewHomework(hw)}
                      className="text-xs px-3.5 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1"
                    >
                      Review Submissions <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Student Submit Modal */}
      {activeSubmitHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            id="student-submit-homework-modal"
            onSubmit={handleSubmitHomework}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {activeSubmitHomework.subjectName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Submit: {activeSubmitHomework.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Due: {activeSubmitHomework.dueDate} • Worth {activeSubmitHomework.maxPoints} pts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubmitHomework(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Instructions:</span>
              {activeSubmitHomework.description}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Notes / Submission Content
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your explanation or notes on how you solved the problems..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <FileUploadZone
                id="student-homework-file-upload"
                label="Attach Assignment File (Optional)"
                value={submissionAttachment}
                onChange={(file) => setSubmissionAttachment(file ? file.name : '')}
                helperText="Supports PDF, DOCX, ZIP, PNG, JPG up to 25MB (UC-FILE-01)"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveSubmitHomework(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition inline-flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Turn In Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teacher Review Submissions Drawer / Modal */}
      {activeReviewHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            id="review-homework-modal"
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {activeReviewHomework.className} • {activeReviewHomework.subjectName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Submissions: {activeReviewHomework.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Max: {activeReviewHomework.maxPoints} pts • Due {activeReviewHomework.dueDate}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveReviewHomework(null)
                  setSelectedSubmissionToGrade(null)
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of submissions for this assignment */}
            {submissions.filter((s) => s.homeworkId === activeReviewHomework.id).length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No student submissions received yet for this assignment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions
                  .filter((s) => s.homeworkId === activeReviewHomework.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {sub.studentName} ({sub.studentCode})
                          </h4>
                          <span className="text-xs text-slate-400">
                            Submitted: {sub.submittedAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              sub.status === 'Graded'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                            }`}
                          >
                            {sub.status === 'Graded' ? `Graded: ${sub.grade}/${activeReviewHomework.maxPoints}` : 'Pending Grade'}
                          </span>

                          <button
                            id={`grade-btn-${sub.id}`}
                            onClick={() => {
                              setSelectedSubmissionToGrade(sub)
                              setGradeInput(sub.grade || 90)
                              setFeedbackInput(sub.feedback || '')
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl font-medium bg-brand-600 hover:bg-brand-700 text-white transition"
                          >
                            {sub.status === 'Graded' ? 'Edit Grade' : 'Assign Grade'}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {sub.content}
                      </p>

                      {sub.attachments.length > 0 && (
                        <div className="flex items-center gap-2">
                          {sub.attachments.map((att, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 text-xs text-brand-600 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800"
                            >
                              <FileText className="w-3 h-3" />
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {sub.feedback && (
                        <div className="text-xs text-slate-500 italic bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                          Teacher Feedback: "{sub.feedback}"
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Grading Drawer/Form if selected */}
            {selectedSubmissionToGrade && (
              <form
                onSubmit={handleGradeSubmission}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-brand-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-600" />
                    Enter Grade & Feedback for {selectedSubmissionToGrade.studentName}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmissionToGrade(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Score (out of {activeReviewHomework.maxPoints})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={activeReviewHomework.maxPoints}
                      required
                      value={gradeInput}
                      onChange={(e) => setGradeInput(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Constructive Teacher Feedback
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent attention to quadratic roots and step calculations."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                  >
                    Save Grade
                  </button>
                </div>
              </form>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveReviewHomework(null)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Create Homework Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            id="create-homework-form"
            onSubmit={handleCreateHomework}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Assign New Homework
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Problem Set: Quadratics"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class
                  </label>
                  <select
                    value={createForm.className}
                    onChange={(e) => setCreateForm({ ...createForm, className: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                    value={createForm.subjectName}
                    onChange={(e) => setCreateForm({ ...createForm, subjectName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={createForm.maxPoints}
                    onChange={(e) => setCreateForm({ ...createForm, maxPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the questions, expectations, and grading rubric..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <FileUploadZone
                  id="teacher-homework-material-upload"
                  label="Reference Material / Rubric (Optional)"
                  value={createForm.materialName}
                  onChange={(file) => setCreateForm({ ...createForm, materialName: file ? file.name : '' })}
                  helperText="Upload supplementary PDF, worksheets, or rubrics (< 25MB)"
                />
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
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
