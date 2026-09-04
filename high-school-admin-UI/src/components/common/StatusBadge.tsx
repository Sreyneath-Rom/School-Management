import type{ Status } from '@/types/index';

const statusColorMap: Record<Status, string> = {
  Draft: 'bg-text-main/8 text-text-main/70',
  Upcoming: 'bg-info/15 text-info',
  Active: 'bg-success/15 text-success',
  Completed: 'bg-orange-600/15 text-orange-600 dark:text-orange-300',
  Archived: 'bg-text-main/15 text-text-main/65',
  Inactive: 'bg-error/15 text-error',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColorMap[status]}`}>
      {status}
    </span>
  );
}