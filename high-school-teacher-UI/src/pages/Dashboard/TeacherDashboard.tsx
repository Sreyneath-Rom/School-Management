import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Teacher Academic Portal"
          subtitle={`Welcome back, ${user?.name || 'Instructor'}. Here is your classroom schedule and teaching overview.`}
        />

        <div className="flex items-center gap-2">
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-brand-600" />
            Mark Attendance
          </Link>
          <Link
            to="/teacher/homework"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assignment
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid for Teacher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Assigned Classes</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2 Classes</div>
          <span className="text-[11px] text-slate-400">Grade 10-A, Grade 11-A</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Students</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">62 Students</div>
          <span className="text-[11px] text-slate-400">94.8% Attendance Avg</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Reviews</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">14 To Grade</div>
          <span className="text-[11px] text-amber-600">Homework & Lab Reports</span>
        </div>

        <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Quizzes</span>
            <HelpCircle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2 Published</div>
          <span className="text-[11px] text-slate-400">50 Total Attempts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-2 glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Today's Teaching Schedule
            </h3>
            <span className="text-xs text-slate-400">Friday, Sep 4</span>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  slot.status === 'In Progress'
                    ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-500/60 shadow-sm'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      slot.status === 'In Progress'
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    P{i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {slot.subject} — {slot.class}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{slot.time}</span>
                      <span>•</span>
                      <span>{slot.room}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    slot.status === 'In Progress'
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

        {/* Quick Links & Resources */}
        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Instructor Quick Actions
          </h3>

          <div className="space-y-2 text-xs font-medium">
            <Link
              to="/teacher/lessons"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span>Prepare Today's Lesson Plan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
            </Link>

            <Link
              to="/teacher/homework"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Review Submissions & Assign Grades</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </Link>

            <Link
              to="/teacher/quizzes"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Schedule Unit Multiple-Choice Test</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
            </Link>

            <Link
              to="/teacher/grades"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Gradebook & Weight Evaluation</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Homework to Review & Recent Grades entered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              Active Homework Assignments
            </h3>
            <Link to="/teacher/homework" className="text-xs text-brand-600 hover:underline">
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
                    {hw.className} • Due: {hw.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
                    {hw.submissionsCount || 0} Submitted
                  </span>
                  <Link
                    to="/teacher/homework"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Recent Grades Overview (Grade 10-A Math)
            </h3>
            <Link to="/teacher/grades" className="text-xs text-brand-600 hover:underline">
              Full Gradebook
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentGrades.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{g.studentName}</h4>
                  <p className="text-slate-400 mt-0.5">{g.studentCode}</p>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <span>{g.totalWeightedScore}%</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      g.letterGrade === 'A'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                    }`}
                  >
                    {g.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
