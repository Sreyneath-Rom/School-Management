import { useState, useEffect } from 'react'
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Award,
  ArrowRight,
  ClipboardCheck,
  Plus,
  Sparkles,
  MapPin,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord } from '@/types/academic'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [recentGrades, setRecentGrades] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hw, qz, gr] = await Promise.all([
          academicService.getHomeworkList(),
          academicService.getQuizzes(),
          academicService.getGrades('Grade 10-A', 'Mathematics'),
        ])
        setHomeworkList(hw)
        setQuizzes(qz)
        setRecentGrades(gr.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const todaySchedule = [
    { period: 'Period 1', time: '08:30 - 09:45 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 101', status: 'In Progress' },
    { period: 'Period 2', time: '10:00 - 11:15 AM', subject: 'Physics', class: 'Grade 10-A', room: 'Lab 204', status: 'Upcoming' },
    { period: 'Period 3', time: '01:00 - 02:15 PM', subject: 'Advanced Algebra', class: 'Grade 11-A', room: 'Room 102', status: 'Upcoming' },
  ]

  return (
    <div id="teacher-dashboard" className="space-y-6">
      {/* 1. TEACHER HERO FACULTY BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-sm">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 h-48 w-48 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Faculty Academic Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Fall Semester 2026 • Week 8</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome Back, {user?.name || 'Dr. John Whitfield'}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mathematics & Physics Faculty • Faculty ID: <span className="font-mono text-slate-200">#TCH-4091</span> • Department Chair
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/teacher/attendance"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xs transition-all duration-150"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-brand-300" />
              Mark Attendance
            </Link>
            <Link
              to="/teacher/homework"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all duration-150 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              New Assignment
            </Link>
            <Link
              to="/teacher/grades"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all duration-150"
            >
              <Award className="w-3.5 h-3.5 text-white" />
              Gradebook
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FACULTY KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Assigned Classes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              2 Classes
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Grade 10-A, Grade 11-A
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Students</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              62 Students
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              94.8% Attendance Average
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Reviews</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              14 To Grade
            </div>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              Homework & Lab Reports
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Quizzes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              2 Published
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              50 Total Student Attempts
            </p>
          </div>
        </div>
      </div>

      {/* 3. TEACHING SCHEDULE & INSTRUCTOR QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                Today's Teaching Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instructor Timetable • Academic Hall A
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Friday, Sep 4
            </span>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slot.status === 'In Progress'
                    ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-500/50 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${
                      slot.status === 'In Progress'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    P{i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {slot.subject} <span className="text-slate-400 font-normal">—</span> <span className="text-brand-600 dark:text-brand-400">{slot.class}</span>
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
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${
                      slot.status === 'In Progress'
                        ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300'
                        : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {slot.status === 'In Progress' && (
                      <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                    )}
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Quick Actions */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Instructor Quick Actions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Faculty classroom workflows
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/teacher/lessons"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-brand-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Prepare Lesson Plans
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload slides & course content
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/teacher/homework"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Grade Submissions
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Review homework & lab files
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/teacher/quizzes"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-sky-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Create Unit Quiz
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Schedule timed MC assessments
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/teacher/grades"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-emerald-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Weighted Gradebook
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Input scores and export marks
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. LOWER SECTION: ACTIVE ASSIGNMENTS & RECENT GRADES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              Active Homework Assignments
            </h2>
            <Link
              to="/teacher/homework"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {homeworkList.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No active homework assignments.
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
                      {hw.className} • Due: <span className="font-semibold text-slate-700 dark:text-slate-300">{hw.dueDate}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-[11px]">
                      {hw.submissionsCount || 0} Submitted
                    </span>
                    <Link
                      to="/teacher/homework"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Recent Grades Overview (Grade 10-A Math)
            </h2>
            <Link
              to="/teacher/grades"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Full Gradebook
            </Link>
          </div>

          <div className="space-y-3">
            {recentGrades.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No recent grade entries recorded.
              </p>
            ) : (
              recentGrades.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {g.studentName}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-mono text-[11px]">
                      {g.studentCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 font-bold shrink-0">
                    <span className="text-slate-800 dark:text-slate-200">{g.totalWeightedScore}%</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        g.letterGrade === 'A'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                      }`}
                    >
                      {g.letterGrade}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
