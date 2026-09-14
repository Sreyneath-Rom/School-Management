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
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Action Required & Approvals
            </h2>
            {tasks.length > 0 && (
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-500/20">
                {tasks.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administrative items awaiting institutional clearance
          </p>
        </div>

        <Link
          to="/system/logs"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
            All administrative approvals and clearances are up to date!
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              key={task.id}
              to={task.link}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-teal-500/30 hover:bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase ${
                      task.severity === 'high'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        : task.severity === 'medium'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10.5px] text-slate-400">
                    <Clock size={11} />
                    {task.dueTime}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {task.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {task.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => handleDismiss(task.id, e)}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Dismiss
                </button>
                <span className="flex items-center gap-1 rounded-xl bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs group-hover:bg-teal-700 transition">
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
