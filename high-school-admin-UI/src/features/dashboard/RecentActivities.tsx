import { Link } from 'react-router-dom'
import { Activity, ArrowUpRight } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'

/**
 * The backend has no activity-feed endpoint. This widget will populate
 * once one exists — the shape would be a list of recent mutations
 * (user created, grade updated, homework submitted, etc.) which the
 * backend would need to project from the AuditLog table.
 *
 * Until then, this renders an honest empty state instead of fake rows.
 */
export default function RecentActivities() {
  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-fg">System Activities</h2>
          <p className="text-xs text-fg-muted">Real-time administrative feed</p>
        </div>
        <Link
          to="/system/activity"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Logs</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <EmptyState
        icon={Activity}
        title="Activity feed coming soon"
        description="An event feed endpoint is needed on the backend to populate this widget."
        variant="compact"
      />
    </section>
  )
}