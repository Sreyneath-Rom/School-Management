import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'

interface UrgentTask {
  id: string
  title: string
  subtitle: string
  category: 'Leave Approval' | 'Exam Marks' | 'Fee Invoice' | 'Student Profile'
  dueTime: string
  severity: 'high' | 'medium' | 'low'
  link: string
}

const urgentTasks: UrgentTask[] = [
  {
    id: 't-1',
    title: 'Teacher Seng Vanna - 2 Days Medical Leave',
    subtitle: 'Substitute teacher coverage needed for Physics 11-B',
    category: 'Leave Approval',
    dueTime: 'Pending for 2h',
    severity: 'high',
    link: '/teachers',
  },
  {
    id: 't-2',
    title: 'Grade 10 Chemistry Semester Exam Verification',
    subtitle: '45 Student records waiting for administrative sign-off',
    category: 'Exam Marks',
    dueTime: 'Due Today',
    severity: 'medium',
    link: '/academic/exams',
  },
  {
    id: 't-3',
    title: 'New Student Enrollment Documentation',
    subtitle: 'Chan Sophea (Transfer from Siem Reap Secondary) birth certificate upload',
    category: 'Student Profile',
    dueTime: 'Due in 4h',
    severity: 'low',
    link: '/students',
  },
]

export default function PendingApprovalsWidget() {
  const [tasks, setTasks] = useState(urgentTasks)

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="rounded-3xl border border-surface bg-surface-strong p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-color">
              Action Required & Approvals
            </h2>
            {tasks.length > 0 && (
              <span className="rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error border border-error/20">
                {tasks.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-secondary">
            Administrative items awaiting institutional clearance
          </p>
        </div>

        <Link
          to="/system/logs"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-secondary">
            <CheckCircle size={24} className="mx-auto mb-2 text-success" />
            All administrative approvals and clearances are up to date!
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              key={task.id}
              to={task.link}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-surface bg-surface p-3.5 transition hover:border-brand-500/30"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase ${
                      task.severity === 'high'
                        ? 'bg-error/15 text-error'
                        : task.severity === 'medium'
                        ? 'bg-warning/15 text-warning'
                        : 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                    }`}
                  >
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10.5px] text-secondary">
                    <Clock size={11} />
                    {task.dueTime}
                  </span>
                </div>

                <p className="text-xs font-bold text-color leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {task.title}
                </p>
                <p className="text-[11px] text-secondary leading-normal">
                  {task.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => handleDismiss(task.id, e)}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-secondary hover:bg-surface-strong hover:text-color cursor-pointer"
                >
                  Dismiss
                </button>
                <span className="flex items-center gap-1 rounded-xl bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs group-hover:bg-brand-700 transition">
                  Review
                  <ChevronRight size={13} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
