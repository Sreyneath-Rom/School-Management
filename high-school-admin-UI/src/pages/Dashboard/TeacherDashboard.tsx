// src/pages/Dashboard/TeacherDashboard.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import EmptyState from '@/components/common/EmptyState'
import {
  Calendar, Clock, FileCheck2, HelpCircle, Award, ArrowRight,
  BookOpen, ClipboardCheck, Plus,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { Homework, Quiz, GradeRecord } from '@/types/academic'
import type { StatCard } from '@/types'

/**
 * Today's teaching schedule is a placeholder until a schedule endpoint that
 * filters by teacher + day-of-week exists.
 */
const PLACEHOLDER_SCHEDULE = [
  { period: 'Period 1', time: '08:30 - 09:45 AM', subject: 'Mathematics', class: 'Grade 10-A', room: '—', status: 'Upcoming' as const },
  { period: 'Period 2', time: '10:00 - 11:15 AM', subject: 'Physics', class: 'Grade 10-A', room: '—', status: 'Upcoming' as const },
  { period: 'Period 3', time: '01:00 - 02:15 PM', subject: 'Advanced Algebra', class: 'Grade 11-A', room: '—', status: 'Upcoming' as const },
]

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
      // No arguments — the current service has no filter signature. If you
      // add one, pass real class/subject ids, not display names.
      academicService.getGrades(),
    ])
      .then(([hw, qz, gr]) => {
        if (cancelled) return
        setHomeworkList(hw)
        setQuizzes(qz)
        // Take the first five as "recent" — the backend returns them
        // ordered by createdAt desc.
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

    return () => {
      cancelled = true
    }
  }, [])

  // Derived from loaded data — no fabricated counts.
  const teacherStatCards: StatCard[] = [
    {
      id: 'assigned-classes',
      label: 'Assigned Classes',
      value: '—',
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'Not yet available',
      icon: 'Users',
      tint: 'blue',
    },
    {
      id: 'total-students',
      label: 'Total Students',
      value: '—',
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'Not yet available',
      icon: 'BookOpen',
      tint: 'green',
    },
    {
      id: 'pending-reviews',
      label: 'Homework Assigned',
      value: String(homeworkList.length),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'Open assignments',
      icon: 'FileCheck2',
      tint: 'amber',
    },
    {
      id: 'active-quizzes',
      label: 'Published Quizzes',
      value: String(quizzes.length),
      delta: '',
      deltaDirection: 'neutral',
      deltaLabel: 'Assessment count',
      icon: 'HelpCircle',
      tint: 'sky',
    },
  ]

  return (
    <div id="teacher-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Teacher Academic Portal"
          subtitle={`Welcome back, ${user?.name ?? 'Instructor'}. Classroom schedule and teaching overview.`}
        />
        <div className="flex items-center gap-2">
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-surface border border-surface text-fg hover:bg-surface-strong transition"
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
        {/* Today's teaching schedule — placeholder until wired */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Today's Teaching Schedule
            </h3>
            <span className="text-xs text-fg-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="space-y-3">
            {PLACEHOLDER_SCHEDULE.map((slot, i) => (
              <div key={i} className="p-3.5 rounded-xl border bg-surface border-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-surface-strong text-fg-muted border border-surface">
                    P{i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-fg">
                      {slot.subject} — {slot.class}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-fg-muted mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface text-fg-muted border border-surface">
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-3 shadow-xs">
          <h3 className="font-semibold text-sm text-fg">Instructor Quick Actions</h3>
          <div className="space-y-2 text-xs font-medium">
            <QuickLink to="/teacher/lessons" icon={<BookOpen className="w-4 h-4 text-brand-600" />} label="Prepare Lesson Plan" />
            <QuickLink to="/teacher/homework" icon={<FileCheck2 className="w-4 h-4 text-warning" />} label="Review Submissions" />
            <QuickLink to="/teacher/quizzes" icon={<HelpCircle className="w-4 h-4 text-brand-600" />} label="Schedule Unit Test" />
            <QuickLink to="/teacher/grades" icon={<Award className="w-4 h-4 text-success" />} label="Gradebook" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-warning" />
              Active Homework Assignments
            </h3>
            <Link to="/teacher/homework" className="text-xs text-brand-600 hover:underline">View All</Link>
          </div>
          {homeworkList.length === 0 ? (
            <EmptyState icon={FileCheck2} title="No assignments yet" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {homeworkList.slice(0, 5).map((hw) => (
                <div key={hw.id} className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{hw.title}</h4>
                    <p className="text-fg-muted mt-0.5">
                      {hw.className} • Due {hw.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium border border-warning/20">
                      {hw.submissionsCount ?? 0} submitted
                    </span>
                    <Link to="/teacher/homework" className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5 border border-surface bg-surface-strong space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
              <Award className="w-4 h-4 text-success" />
              Recent Grades Entered
            </h3>
            <Link to="/teacher/grades" className="text-xs text-brand-600 hover:underline">Full Gradebook</Link>
          </div>
          {recentGrades.length === 0 ? (
            <EmptyState icon={Award} title="No grades entered yet" variant="compact" />
          ) : (
            <div className="space-y-2.5">
              {recentGrades.map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-surface border border-surface flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-fg truncate">{g.studentName || '—'}</h4>
                    <p className="text-fg-muted mt-0.5">{g.subjectName}</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold shrink-0">
                    <span className="text-fg">{g.totalWeightedScore}%</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      g.letterGrade === 'A'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-500/20'
                    }`}>
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

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
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