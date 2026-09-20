// src/pages/Dashboard/StudentDashboard.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import EmptyState from '@/components/common/EmptyState'
import {
  Calendar,
  Clock,
  FileCheck2,
  HelpCircle,
  Award,
  ArrowRight,
  BookOpen,
  Upload,
  Timer,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord } from '@/types/academic'
import type { StatCard } from '@/types'

export default function StudentDashboard() {
  const { user } = useAuth()

  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      academicService.getHomeworkList(),
      academicService.getQuizzes(),
      // No argument — the service hits /grades/me, scoped to the token.
      academicService.getMyGrades(),
    ])
      .then(([hw, qz, gr]) => {
        if (cancelled) return
        setHomeworkList(hw)
        setQuizzes(qz)
        setGrades(gr)
      })
      .catch(() => {
        if (cancelled) return
        setHomeworkList([])
        setQuizzes([])
        setGrades([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Derive only from real data. If a metric has no source, it renders as
  // an explicit dash — no invented numbers.
  const gpa =
    grades.length > 0
      ? (grades.reduce((sum, r) => sum + r.gpa, 0) / grades.length).toFixed(2)
      : null

  const avgGrade =
    grades.length > 0
      ? (
          grades.reduce((sum, r) => sum + r.percentage, 0) / grades.length
        ).toFixed(1)
      : null

  const studentStatCards: StatCard[] = [
    {
      id: 'grades-recorded',
      label: 'Graded Subjects',
      value: String(grades.length),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: grades.length === 1 ? '1 record' : `${grades.length} records`,
      icon: 'BookOpen',
      tint: 'blue',
    },
    {
      id: 'gpa',
      label: 'Cumulative GPA',
      value: gpa ? `${gpa} / 4.0` : '—',
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: gpa ? 'Across graded subjects' : 'No grades yet',
      icon: 'Award',
      tint: 'amber',
    },
    {
      id: 'weighted-average',
      label: 'Average Score',
      value: avgGrade ? `${avgGrade}%` : '—',
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: avgGrade ? 'Across graded subjects' : 'No grades yet',
      icon: 'CheckCircle2',
      tint: 'green',
    },
    {
      id: 'open-homework',
      label: 'Open Assignments',
      value: String(homeworkList.length),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'Assigned to your class',
      icon: 'FileCheck2',
      tint: 'sky',
    },
  ]

  return (
    <div id="student-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Student Portal"
          subtitle={`Welcome back, ${user?.name ?? 'Student'}.`}
        />
        <Link
          to="/student/homework"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
        >
          <Upload className="w-3.5 h-3.5" />
          Submit Homework
        </Link>
      </div>

      <StatsGrid cards={studentStatCards} loading={loading} showHeader={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule — deferred. The backend has no per-day filter
            yet, and the previous version showed three made-up periods.
            Link into the full schedule instead of inventing rows. */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Today's Classes
            </h3>
            <span className="text-xs text-fg-muted">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="py-6 text-center">
            <p className="text-xs text-fg-muted">
              Your daily schedule isn't available here yet.
            </p>
            <Link
              to="/student/calendar"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600 hover:underline"
            >
              Open full schedule
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-3 shadow-xs">
          <h3 className="font-semibold text-sm text-fg">Quick Navigation</h3>
          <div className="space-y-2 text-xs font-medium">
            <QuickLink
              to="/student/lessons"
              icon={<BookOpen className="w-4 h-4 text-brand-600" />}
              label="Lessons & Materials"
            />
            <QuickLink
              to="/student/homework"
              icon={<FileCheck2 className="w-4 h-4 text-warning" />}
              label="Homework & Assignments"
            />
            <QuickLink
              to="/student/quizzes"
              icon={<HelpCircle className="w-4 h-4 text-brand-600" />}
              label="Quizzes & Tests"
            />
            <QuickLink
              to="/student/grades"
              icon={<Award className="w-4 h-4 text-success" />}
              label="My Grades"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-warning" />
              Upcoming Assignments
            </h3>
            <Link
              to="/student/homework"
              className="text-xs text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {homeworkList.length === 0 ? (
            <EmptyState
              icon={FileCheck2}
              title="No homework assigned"
              variant="compact"
            />
          ) : (
            <div className="space-y-2.5">
              {homeworkList.slice(0, 4).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{hw.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {hw.subjectName} • Due {hw.dueDate} • {hw.maxPoints} pts
                    </p>
                  </div>
                  <Link
                    to="/student/homework"
                    className="shrink-0 ml-3 px-3 py-1 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-300 font-medium transition"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quizzes */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              Available Quizzes
            </h3>
            <Link
              to="/student/quizzes"
              className="text-xs text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No quizzes scheduled"
              variant="compact"
            />
          ) : (
            <div className="space-y-2.5">
              {quizzes.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{q.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {q.subjectName} • {q.durationMinutes} min • {q.questions?.length ?? 0} questions
                    </p>
                  </div>
                  <Link
                    to="/student/quizzes"
                    className="shrink-0 ml-3 px-3 py-1 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-300 font-medium transition inline-flex items-center gap-1"
                  >
                    <Timer className="w-3 h-3" />
                    Take
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickLink({
  to,
  icon,
  label,
}: {
  to: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface hover:border-brand-500/50 transition group"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-fg">{label}</span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-brand-600" />
    </Link>
  )
}