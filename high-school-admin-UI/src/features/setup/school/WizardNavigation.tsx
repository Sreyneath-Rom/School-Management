// src/features/setup/school/WizardNavigation.tsx

import Button from '@/components/common/Button';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving: boolean;
  onSave: () => void;
  isDirty: boolean;
}

export default function WizardNavigation({
  currentStep, totalSteps, onPrevious, onNext,
  canGoPrevious, canGoNext, isSaving, onSave, isDirty,
}: Props) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="glass-sm relative overflow-hidden rounded-3xl p-4 sm:p-5">
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-40 w-40 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-warning/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-bold text-fg-muted shadow-sunken">
            {currentStep + 1}
            <span className="mx-1 text-fg-muted/60">/</span>
            {totalSteps}
          </div>

          {/* Divider → shadow seam (previous border-(--glass-outline) was
              transparent under this theme) */}
          <div className="hidden h-5 w-px sm:block shadow-[1px_0_0_var(--neu-shadow-dark)]" />

          <p className="text-xs font-semibold text-fg-muted">
            {isLastStep ? 'Ready to save' : 'Continue setup'}
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="glass"
            onClick={onPrevious}
            disabled={!canGoPrevious || isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold glass-interactive disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>

          {!isLastStep && (
            <Button
              variant="solid"
              onClick={onNext}
              disabled={!canGoNext || isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white shadow-sm shadow-brand-600/25 transition-all duration-200 hover:bg-brand-700 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:flex-none"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          )}

          {isLastStep && (
            <Button
              variant="solid"
              onClick={onSave}
              disabled={isSaving || !isDirty}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white shadow-sm shadow-brand-600/25 transition-all duration-200 hover:bg-brand-700 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:flex-none"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-brand-400/30 to-transparent" />
    </div>
  );
}