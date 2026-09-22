// src/pages/Dashboard/TeacherDashboard.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import EmptyState from '@/components/common/EmptyState'
import {
  Calendar, FileCheck2, HelpCircle, Award, ArrowRight,
  BookOpen, ClipboardCheck, Plus,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord } from '@/types/academic'
import type { StatCard } from '@/types'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [homeworkList, setHomeworkList] = useState<Homework[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [recentGrades, setRecentGrades] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      academicService.getHomeworkList(),
      academicService.getQuizzes(),
      // Staff-only endpoint — the backend enforces grades.view.
      academicService.getAllGrades(),
    ])
      .then(([hw, qz, gr]) => {
        if (cancelled) return
        setHomeworkList(hw)
        setQuizzes(qz)
        setRecentGrades(gr.slice(0, 5))
      })
      .catch(() => {
        if (cancelled) return
        setHomeworkList([])
        setQuizzes([])
        setRecentGrades([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const teacherStatCards: StatCard[] = [
    { id: 'homework-assigned', label: 'Assignments',     value: String(homeworkList.length),                             delta: '', deltaDirection: 'neutral', deltaLabel: 'Open assignments',           icon: 'FileCheck2',     tint: 'amber' },
    { id: 'active-quizzes',    label: 'Quizzes',         value: String(quizzes.length),                                  delta: '', deltaDirection: 'neutral', deltaLabel: 'Published',                  icon: 'HelpCircle',     tint: 'sky' },
    { id: 'grade-records',     label: 'Grade Records',   value: String(recentGrades.length),                             delta: '', deltaDirection: 'neutral', deltaLabel: 'Most recent entries',        icon: 'Award',          tint: 'green' },
    { id: 'submissions',       label: 'Submissions',     value: String(homeworkList.reduce((sum, h) => sum + (h.submissionsCount ?? 0), 0)), delta: '', deltaDirection: 'neutral', deltaLabel: 'Across your assignments', icon: 'ClipboardCheck', tint: 'blue' },
  ]

  return (
    <div id="teacher-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Teacher Portal"
          subtitle={`Welcome back, ${user?.name ?? 'Instructor'}.`}
        />
        <div className="flex items-center gap-2">
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium glass-sm glass-interactive text-fg"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Mark Attendance
          </Link>
          <Link
            to="/teacher/homework"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/25 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assignment
          </Link>
        </div>
      </div>

      <StatsGrid cards={teacherStatCards} loading={loading} showHeader={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule — deferred, same reasoning as student dashboard */}
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

          <div className="py-6 text-center rounded-xl shadow-[var(--shadow-emboss-sunken)]">
            <p className="text-xs text-fg-muted">
              Your daily schedule isn't available here yet.
            </p>
            <Link
              to="/teacher/calendar"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Open full schedule
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl glass-sm p-5 space-y-3">
          <h3 className="font-semibold text-sm text-fg">Quick Actions</h3>
          <div className="space-y-2 text-xs font-medium">
            <QuickLink to="/teacher/lessons"  icon={<BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />} label="Prepare Lesson Plan" />
            <QuickLink to="/teacher/homework" icon={<FileCheck2 className="w-4 h-4 text-warning" />}                     label="Review Submissions" />
            <QuickLink to="/teacher/quizzes"  icon={<HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />} label="Schedule a Quiz" />
            <QuickLink to="/teacher/grades"   icon={<Award className="w-4 h-4 text-success" />}                           label="Open Gradebook" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl glass-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-warning" />
              Your Assignments
            </h3>
            <Link to="/teacher/homework" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              View all
            </Link>
          </div>
          {homeworkList.length === 0 ? (
            <EmptyState icon={FileCheck2} title="No assignments yet" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {homeworkList.slice(0, 5).map((hw) => (
                <div key={hw.id} className="p-3 rounded-xl shadow-[var(--shadow-emboss-sunken)] flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{hw.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {hw.className || '—'} • Due {hw.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Semantic count badge — warning-tinted, kept */}
                    <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning font-medium border border-warning/25">
                      {hw.submissionsCount ?? 0} submitted
                    </span>
                    <Link
                      to="/teacher/homework"
                      className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-[var(--shadow-emboss-raised)] transition"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <Award className="w-4 h-4 text-success" />
              Recent Grades
            </h3>
            <Link to="/teacher/grades" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              Full gradebook
            </Link>
          </div>
          {recentGrades.length === 0 ? (
            <EmptyState icon={Award} title="No grades recorded yet" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {recentGrades.map((g) => (
                <div key={g.id} className="p-3 rounded-xl shadow-[var(--shadow-emboss-sunken)] flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">
                      {g.studentName || '—'}
                    </h4>
                    <p className="text-fg-muted mt-0.5">{g.subjectName}</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold shrink-0">
                    <span className="text-fg">{g.percentage}%</span>
                    {/* Grade badge keeps the same semantic tints used
                        everywhere else in the codebase */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${
                        g.letterGrade === 'A'
                          ? 'bg-success/15 text-success border-success/25'
                          : g.letterGrade === 'B'
                            ? 'bg-info/15 text-info border-info/25'
                            : g.letterGrade === 'C'
                              ? 'bg-warning/15 text-warning border-warning/25'
                              : 'bg-error/15 text-error border-error/25'
                      }`}
                    >
                      {g.letterGrade}
                    </span>
                  </div>
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
      className="flex items-center justify-between p-3 rounded-xl shadow-[var(--shadow-emboss-sunken)] hover:bg-brand-500/5 transition group"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-fg">{label}</span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
    </Link>
  )
}