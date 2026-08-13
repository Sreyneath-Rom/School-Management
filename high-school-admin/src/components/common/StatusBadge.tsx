import type{ Status } from '@/types/index';

const statusColorMap: Record<Status, string> = {
  Draft: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  Upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Completed: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  Archived: 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
  Inactive: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColorMap[status]}`}>
      {status}
    </span>
  );
}