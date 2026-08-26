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

export default function SchoolSetupHeader({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: Props) {
  return (
    <div className="glass-sm relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-brand-300/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* =====================================================
            LEFT — PAGE INFORMATION
        ====================================================== */}
        <div className="min-w-0">
          {/* Section badge */}
          <div
            className="
              mb-4 inline-flex items-center gap-2
              rounded-full
              border border-brand-200/60
              bg-brand-50/70
              px-3.5 py-2
              text-xs font-bold
              tracking-wide
              text-brand-800
              shadow-sm
              backdrop-blur-md
              dark:border-brand-800/40
              dark:bg-brand-950/40
              dark:text-brand-200
            "
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/15">
              <Settings2 size={14} className="text-brand-600 dark:text-brand-300" />
            </span>

            <span>School Administration</span>
          </div>

          {/* Heading */}
          <div className="text-text-main">
            <PageHeading
              title="School Setup"
              subtitle="Configure your school’s identity, academic settings, grading system, and regional preferences."
            />
          </div>
        </div>

        {/* =====================================================
            RIGHT — ACTIONS
        ====================================================== */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Unsaved changes */}
          {isDirty && (
            <div
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-warning/25
                bg-warning/15
                px-3.5 py-2.5
                text-xs font-bold
                text-warning
                shadow-sm
                backdrop-blur-md
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
              </span>

              Unsaved changes
            </div>
          )}

          {/* Discard */}
          {isDirty && (
            <Button
              variant="glass"
              onClick={onDiscard}
              disabled={isSaving}
              className="
                flex items-center justify-center gap-2
                rounded-xl
                px-4 py-2.5
                font-semibold
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RotateCcw size={15} />
              <span>Discard</span>
            </Button>
          )}

          {/* Save */}
          <Button
            variant="solid"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="
              flex items-center justify-center gap-2
              rounded-xl
              bg-brand-600
              px-5 py-2.5
              font-bold
              text-white
              shadow-[0_8px_20px_rgba(15,163,179,0.25)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-brand-700
              hover:shadow-[0_10px_24px_rgba(15,163,179,0.35)]
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:shadow-none
            "
          >
            {isSaving ? (
              <>
                <span
                  className="
                    h-4 w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="pointer-events-none absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-brand-400/30 to-transparent" />
    </div>
  );
}