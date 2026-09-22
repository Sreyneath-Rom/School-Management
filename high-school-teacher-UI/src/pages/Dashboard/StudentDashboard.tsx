import { useState, useEffect } from 'react'
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
  Sparkles,
  TrendingUp,
  MapPin,
  User,
  ChevronRight,
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
      {/* 1. STUDENT HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-sm">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-400/30">
                <Sparkles className="w-3 h-3 text-brand-400" />
                Fall Semester 2026
              </span>
              <span className="text-xs text-slate-400 font-medium">Week 8 • Academic Term A</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome Back, {user?.name || 'Emily Watson'}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Grade 10-A • Student ID: <span className="font-mono text-slate-200">#STU-10294</span> • Advisor: <span className="text-slate-200">Dr. John Whitfield</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/homework"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all duration-150 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              Submit Homework
            </Link>
            <Link
              to="/student/grades"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xs transition-all duration-150"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              View Report Card
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PERFORMANCE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Class & Section</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Grade 10-A
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              Homeroom 101 • 32 Classmates
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cumulative GPA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {gpa} <span className="text-xs font-normal text-slate-400">/ 4.00</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Honor Roll Standing
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Weighted Average</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {avgGrade}%
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Across {grades.length > 0 ? grades.length : 6} Enrolled Subjects
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Attendance</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              96.5%
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              On Track (34/35 Present)
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN SCHEDULE & DIRECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                Today's Class Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Grade 10-A Timetable • Academic Hall A
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Friday, Sep 4
            </span>
          </div>

          <div className="space-y-3">
            {studentSchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slot.status === 'Active Now'
                    ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-500/50 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${
                      slot.status === 'Active Now'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    P{i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {slot.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {slot.room}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {slot.teacher}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${
                      slot.status === 'Active Now'
                        ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300'
                        : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {slot.status === 'Active Now' && (
                      <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                    )}
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Academic Navigation */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Academic Portals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct access to student resources
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/student/lessons"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-brand-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Class Lessons & Slides
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Syllabus and lecture notes
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/student/homework"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Homework Portal
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Submit assignments & view feedback
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/student/quizzes"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-sky-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Tests & Quizzes
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Take timed unit assessments
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/student/grades"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-emerald-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Academic Gradebook
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Official transcripts & GPA breakdown
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              Assignments Due Soon
            </h2>
            <Link
              to="/student/homework"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {homeworkList.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No pending homework due at this time.
              </p>
            ) : (
              homeworkList.slice(0, 4).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {hw.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {hw.subjectName} • Due: <span className="font-semibold text-slate-700 dark:text-slate-300">{hw.dueDate}</span> ({hw.maxPoints} pts)
                    </p>
                  </div>

                  <Link
                    to="/student/homework"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-semibold transition"
                  >
                    Submit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Scheduled Quizzes & Tests
            </h2>
            <Link
              to="/student/quizzes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {quizzes.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No active online quizzes scheduled today.
              </p>
            ) : (
              quizzes.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {q.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {q.subjectName} • {q.durationMinutes} mins • {q.questions?.length || 0} questions
                    </p>
                  </div>

                  <Link
                    to="/student/quizzes"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold transition inline-flex items-center gap-1.5"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Take Test
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
