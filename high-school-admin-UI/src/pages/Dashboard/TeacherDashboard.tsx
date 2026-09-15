import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
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
import type { StatCard } from '@/types'

const teacherStatCards: StatCard[] = [
  { id: 'assigned-classes', label: 'Assigned Classes', value: '2 Classes', delta: '-', deltaDirection: 'neutral', deltaLabel: 'Grade 10-A, Grade 11-A', icon: 'Users', tint: 'blue' },
  { id: 'total-students', label: 'Total Students', value: '62 Students', delta: '-', deltaDirection: 'neutral', deltaLabel: '94.8% Attendance Avg', icon: 'BookOpen', tint: 'green' },
  { id: 'pending-reviews', label: 'Pending Reviews', value: '14 To Grade', delta: '-', deltaDirection: 'neutral', deltaLabel: 'Homework & Lab Reports', icon: 'FileCheck2', tint: 'amber' },
  { id: 'active-quizzes', label: 'Active Quizzes', value: '2 Published', delta: '-', deltaDirection: 'neutral', deltaLabel: '50 Total Attempts', icon: 'HelpCircle', tint: 'sky' },
]

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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-surface border border-surface text-color hover:bg-surface-strong transition"
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

      <StatsGrid cards={teacherStatCards} loading={loading} showHeader={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-color flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Today's Teaching Schedule
            </h3>
            <span className="text-xs text-secondary">Friday, Sep 4</span>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  slot.status === 'In Progress'
                    ? 'bg-brand-500/10 border-brand-500/40'
                    : 'bg-surface border-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      slot.status === 'In Progress'
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface text-secondary border border-surface'
                    }`}
                  >
                    P{i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-color">
                      {slot.subject} — {slot.class}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>{slot.time}</span>
                      <span>•</span>
                      <span>{slot.room}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    slot.status === 'In Progress'
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
                      : 'bg-surface text-secondary border border-surface'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & Resources */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-3 shadow-xs">
          <h3 className="font-semibold text-sm text-color">
            Instructor Quick Actions
          </h3>

          <div className="space-y-2 text-xs font-medium">
            <Link
              to="/teacher/lessons"
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span className="text-color">Prepare Today's Lesson Plan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-brand-600" />
            </Link>

            <Link
              to="/teacher/homework"
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-warning" />
                <span className="text-color">Review Submissions & Assign Grades</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-warning" />
            </Link>

            <Link
              to="/teacher/quizzes"
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span className="text-color">Schedule Unit Multiple-Choice Test</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-brand-600" />
            </Link>

            <Link
              to="/teacher/grades"
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-success" />
                <span className="text-color">Gradebook & Weight Evaluation</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-success" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Homework to Review & Recent Grades entered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-color flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-warning" />
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
                className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-color">{hw.title}</h4>
                  <p className="text-secondary mt-0.5">
                    {hw.className} • Due: {hw.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium border border-warning/20">
                    {hw.submissionsCount || 0} Submitted
                  </span>
                  <Link
                    to="/teacher/homework"
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-color flex items-center gap-2">
              <Award className="w-4 h-4 text-success" />
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
                className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-color">{g.studentName}</h4>
                  <p className="text-secondary mt-0.5">{g.studentCode}</p>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-color">{g.totalWeightedScore}%</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${
                      g.letterGrade === 'A'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-500/20'
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
