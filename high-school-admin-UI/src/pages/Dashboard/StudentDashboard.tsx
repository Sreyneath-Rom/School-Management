// src/pages/Dashboard/StudentDashboard.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, FileCheck2, HelpCircle, Award, ArrowRight,
  BookOpen, Upload, Timer, CheckCircle2,
} from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid, { type StatCard } from '@/components/cards/StatsGrid'
import EmptyState from '@/components/common/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord } from '@/types/academic'

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

    return () => { cancelled = true }
  }, [])

  const gpa = grades.length > 0
    ? (grades.reduce((sum, r) => sum + r.gpa, 0) / grades.length).toFixed(2)
    : null

  const avgGrade = grades.length > 0
    ? (grades.reduce((sum, r) => sum + r.percentage, 0) / grades.length).toFixed(1)
    : null

  const studentStatCards: StatCard[] = [
    {
      id: 'grades-recorded',
      label: 'Graded Subjects',
      value: String(grades.length),
      icon: BookOpen,
      accent: 'brand',
      footerLabel: grades.length === 1 ? '1 record' : `${grades.length} records`,
    },
    {
      id: 'gpa',
      label: 'Cumulative GPA',
      value: gpa ? `${gpa} / 4.0` : '—',
      icon: Award,
      accent: 'warning',
      footerLabel: gpa ? 'Across graded subjects' : 'No grades yet',
    },
    {
      id: 'weighted-average',
      label: 'Average Score',
      value: avgGrade ? `${avgGrade}%` : '—',
      icon: CheckCircle2,
      accent: 'success',
      footerLabel: avgGrade ? 'Across graded subjects' : 'No grades yet',
    },
    {
      id: 'open-homework',
      label: 'Open Assignments',
      value: String(homeworkList.length),
      icon: FileCheck2,
      accent: 'info',
      footerLabel: 'Assigned to your class',
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/25 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          Submit Homework
        </Link>
      </div>

      <StatsGrid
        cards={studentStatCards}
        loading={loading}
        showHeader={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl glass-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
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

          <div className="py-6 text-center rounded-xl shadow-sunken">
            <p className="text-xs text-fg-muted">
              Your daily schedule isn't available here yet.
            </p>
            <Link
              to="/student/calendar"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Open full schedule
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl glass-sm p-5 space-y-3">
          <h3 className="font-semibold text-sm text-fg">Quick Navigation</h3>
          <div className="space-y-2 text-xs font-medium">
            <QuickLink to="/student/lessons"  icon={<BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />} label="Lessons & Materials" />
            <QuickLink to="/student/homework" icon={<FileCheck2 className="w-4 h-4 text-warning" />}                     label="Homework & Assignments" />
            <QuickLink to="/student/quizzes"  icon={<HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />} label="Quizzes & Tests" />
            <QuickLink to="/student/grades"   icon={<Award className="w-4 h-4 text-success" />}                           label="My Grades" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl glass-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-warning" />
              Upcoming Assignments
            </h3>
            <Link to="/student/homework" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              View all
            </Link>
          </div>

          {homeworkList.length === 0 ? (
            <EmptyState icon={FileCheck2} title="No homework assigned" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {homeworkList.slice(0, 4).map((hw) => (
                <div key={hw.id} className="p-3 rounded-xl shadow-sunken flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{hw.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {hw.subjectName} • Due {hw.dueDate} • {hw.maxPoints} pts
                    </p>
                  </div>
                  <Link
                    to="/student/homework"
                    className="shrink-0 ml-3 px-3 py-1 rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-500/25 transition"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Available Quizzes
            </h3>
            <Link to="/student/quizzes" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              View all
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <EmptyState icon={HelpCircle} title="No quizzes scheduled" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {quizzes.slice(0, 4).map((q) => (
                <div key={q.id} className="p-3 rounded-xl shadow-sunken flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{q.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {q.subjectName} • {q.durationMinutes} min • {q.questions?.length ?? 0} questions
                    </p>
                  </div>
                  <Link
                    to="/student/quizzes"
                    className="shrink-0 ml-3 px-3 py-1 rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-500/25 transition inline-flex items-center gap-1"
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
      className="flex items-center justify-between p-3 rounded-xl shadow-sunken hover:bg-brand-500/5 transition group"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-fg">{label}</span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
    </Link>
  )
}