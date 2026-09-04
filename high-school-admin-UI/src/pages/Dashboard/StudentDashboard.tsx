import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Award,
  ArrowRight,
  BookOpen,
  Upload,
  Timer,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord, Lesson } from '@/types/academic'

export default function StudentDashboard() {
  const { user } = useAuth()
  const studentId = user?.id || '3'

  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hw, qz, gr, les] = await Promise.all([
          academicService.getHomeworkList(),
          academicService.getQuizzes(),
          academicService.getStudentGrades(studentId),
          academicService.getLessons(),
        ])
        setHomeworkList(hw)
        setQuizzes(qz)
        setGrades(gr)
        setLessons(les.filter((l) => l.className === 'Grade 10-A'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [studentId])

  const studentSchedule = [
    { period: 'Period 1', time: '08:30 - 09:45 AM', subject: 'Mathematics', teacher: 'Dr. John Whitfield', room: 'Room 101', status: 'Active Now' },
    { period: 'Period 2', time: '10:00 - 11:15 AM', subject: 'Physics', teacher: 'Dr. John Whitfield', room: 'Lab 204', status: 'Upcoming' },
    { period: 'Period 3', time: '01:00 - 02:15 PM', subject: 'English Literature', teacher: 'Ms. Sarah Parker', room: 'Room 105', status: 'Upcoming' },
  ]

  const gpa = grades.length > 0 ? (grades.reduce((sum, r) => sum + r.gpa, 0) / grades.length).toFixed(2) : '3.85'
  const avgGrade = grades.length > 0 ? (grades.reduce((sum, r) => sum + r.totalWeightedScore, 0) / grades.length).toFixed(1) : '92.1'

  return (
    <div id="student-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Student Learning Portal"
          subtitle={`Welcome back, ${user?.name || 'Emily'}. Here is your class timetable and academic schedule for today.`}
        />

        <div className="flex items-center gap-2">
          <Link
            to="/student/homework"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Submit Homework
          </Link>
        </div>
      </div>

      {/* Student Profile & KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">My Enrolled Class</span>
            <GraduationCap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">Grade 10-A</div>
          <span className="text-[11px] text-slate-400">ID: STU123456</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Cumulative GPA</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {gpa} <span className="text-xs font-normal text-slate-400">/ 4.0</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Honor Roll Standing</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Weighted Average</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgGrade}%</div>
          <span className="text-[11px] text-slate-400">{grades.length} Graded Subjects</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Attendance Rate</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">96.5%</div>
          <span className="text-[11px] text-slate-400">Perfect Record This Term</span>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable */}
        <div className="lg:col-span-2 glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Today's Class Schedule (Grade 10-A)
            </h3>
            <span className="text-xs text-slate-400">Friday, Sep 4</span>
          </div>

          <div className="space-y-3">
            {studentSchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  slot.status === 'Active Now'
                    ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-500/60 shadow-sm'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      slot.status === 'Active Now'
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    P{i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {slot.subject}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{slot.time}</span>
                      <span>•</span>
                      <span>{slot.room}</span>
                      <span>•</span>
                      <span>{slot.teacher}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    slot.status === 'Active Now'
                      ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Quick Links */}
        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Academic Quick Navigation
          </h3>

          <div className="space-y-2 text-xs font-medium">
            <Link
              to="/student/lessons"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span>Class Lessons & Lecture Slides</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
            </Link>

            <Link
              to="/student/homework"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Homework & Assignment Portal</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </Link>

            <Link
              to="/student/quizzes"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Timed Online Tests & Quizzes</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
            </Link>

            <Link
              to="/student/grades"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Official Semester Report Card</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Homework Due & Active Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework Section */}
        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              Assignments Due Soon
            </h3>
            <Link to="/student/homework" className="text-xs text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {homeworkList.map((hw) => (
              <div
                key={hw.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{hw.title}</h4>
                  <p className="text-slate-400 mt-0.5">
                    {hw.subjectName} • Due {hw.dueDate} ({hw.maxPoints} pts)
                  </p>
                </div>

                <Link
                  to="/student/homework"
                  className="px-3 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Scheduled Quizzes & Tests
            </h3>
            <Link to="/student/quizzes" className="text-xs text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{q.title}</h4>
                  <p className="text-slate-400 mt-0.5">
                    {q.subjectName} • {q.durationMinutes} mins • {q.questions.length} questions
                  </p>
                </div>

                <Link
                  to="/student/quizzes"
                  className="px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium transition inline-flex items-center gap-1"
                >
                  <Timer className="w-3 h-3" />
                  Take Test
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
