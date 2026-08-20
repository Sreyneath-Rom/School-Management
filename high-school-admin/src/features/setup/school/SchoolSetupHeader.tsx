// src/features/setup/school/SchoolSetupHeader.tsx
import PageHeading from '@/components/common/PageHeading';
import Button from '@/components/common/Button';
import { Settings2, RotateCcw, Save } from 'lucide-react';

interface Props {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export default function SchoolSetupHeader({ isDirty, isSaving, onSave, onDiscard }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[28px] glass-sm p-6">
      <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-3 py-1.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
            <Settings2 size={14} />
            School Administration
          </div>
          <PageHeading
            title="School Setup"
            subtitle="Configure your school's identity, academic settings, grading system, and regional preferences."
          />
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <div className="hidden items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 sm:flex dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Unsaved changes
            </div>
          )}
          {isDirty && (
            <Button variant="glass" onClick={onDiscard} disabled={isSaving} className="flex items-center gap-2">
              <RotateCcw size={15} />
              Discard
            </Button>
          )}
          <Button
            variant="solid"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}